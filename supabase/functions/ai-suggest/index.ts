import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, context } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch user context
    let userContext = "";
    if (userId) {
      const [profileRes, activityRes, statsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).single(),
        supabase.from("user_activity").select("activity_type, recipe_id, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
        supabase.from("user_stats").select("*").eq("user_id", userId).single(),
      ]);

      const profile = profileRes.data;
      const recentActivity = activityRes.data || [];
      const stats = statsRes.data;

      // Get recently viewed recipe titles
      const recipeIds = recentActivity
        .filter((a: any) => a.recipe_id)
        .map((a: any) => a.recipe_id)
        .slice(0, 10);

      let recentRecipes: any[] = [];
      if (recipeIds.length > 0) {
        const { data } = await supabase
          .from("recipes")
          .select("title, category, cuisine")
          .in("id", recipeIds);
        recentRecipes = data || [];
      }

      userContext = `
User preferences: ${JSON.stringify(profile?.preferred_cuisine || [])}
Dietary: ${JSON.stringify(profile?.dietary_preferences || [])}
Recent recipes: ${recentRecipes.map((r: any) => `${r.title} (${r.cuisine || r.category})`).join(", ")}
Stats: Level ${stats?.level || 1}, ${stats?.recipes_viewed || 0} viewed, ${stats?.current_streak || 0} day streak
`;
    }

    // Get some random recipes for suggestions
    const { data: allRecipes } = await supabase
      .from("recipes")
      .select("id, title, category, cuisine, image, time, calories")
      .limit(50);

    const timeOfDay = context?.timeOfDay || new Date().getHours();
    let mealContext = "any meal";
    if (timeOfDay >= 5 && timeOfDay < 11) mealContext = "breakfast or brunch";
    else if (timeOfDay >= 11 && timeOfDay < 15) mealContext = "lunch";
    else if (timeOfDay >= 15 && timeOfDay < 18) mealContext = "snack or tea-time";
    else if (timeOfDay >= 18 && timeOfDay < 22) mealContext = "dinner";

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a fun, friendly food recommendation AI for an app called Refi. Generate personalized food suggestions in a casual, exciting tone — like a friend nudging you to try something. Use food emojis. Be culturally diverse. Keep it short and catchy.`
          },
          {
            role: "user",
            content: `Generate a personalized food popup suggestion for this user. Time context: ${mealContext}.

${userContext}

Available recipes: ${JSON.stringify((allRecipes || []).map((r: any) => ({ id: r.id, title: r.title, cuisine: r.cuisine, category: r.category })))}

Return a JSON object with:
- "message": A short catchy suggestion (like "Biryani venuma? 🍛" or "Craving pasta tonight? 🍝" — use the local language style, be playful, max 6 words)
- "subtext": A one-line description (max 15 words)
- "recipeId": The ID of the suggested recipe from the available list
- "emoji": A single food emoji that matches
- "mood": One of "excited", "cozy", "healthy", "adventurous"

Only return valid JSON.`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    let suggestion;
    try {
      const clean = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      suggestion = JSON.parse(clean);
    } catch {
      suggestion = {
        message: "Hungry? Try something new! 🍽️",
        subtext: "We picked a recipe just for you",
        recipeId: allRecipes?.[Math.floor(Math.random() * (allRecipes?.length || 1))]?.id,
        emoji: "🍽️",
        mood: "excited"
      };
    }

    // Attach recipe data
    if (suggestion.recipeId) {
      const { data: recipe } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", suggestion.recipeId)
        .single();
      suggestion.recipe = recipe;
    }

    return new Response(JSON.stringify(suggestion), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI suggest error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
