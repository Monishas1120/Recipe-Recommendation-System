// @ts-nocheck
/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { userId, context } = await req.json();

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
      const recipeIds = recentActivity.filter((a: any) => a.recipe_id).map((a: any) => a.recipe_id).slice(0, 10);
      let recentRecipes: any[] = [];
      if (recipeIds.length > 0) {
        const { data } = await supabase.from("recipes").select("title, category, cuisine").in("id", recipeIds);
        recentRecipes = data || [];
      }
      userContext = `User preferences: ${JSON.stringify(profile?.preferred_cuisine || [])}
Dietary restrictions: ${JSON.stringify(profile?.dietary_preferences || [])}
Recent recipes: ${recentRecipes.map((r: any) => `${r.title} (${r.cuisine || r.category})`).join(", ")}
Stats: Level ${stats?.level || 1}, ${stats?.recipes_viewed || 0} recipes viewed`.trim();
    }

    const { data: allRecipes } = await supabase.from("recipes").select("id, title, category, cuisine, image, time, calories").limit(50);

    const hour = context?.timeOfDay ?? new Date().getHours();
    let mealContext = "any meal";
    if (hour >= 5 && hour < 11) mealContext = "breakfast or brunch";
    else if (hour >= 11 && hour < 15) mealContext = "lunch";
    else if (hour >= 15 && hour < 18) mealContext = "snack or tea-time";
    else if (hour >= 18 && hour < 22) mealContext = "dinner";

    const prompt = `You are a fun friendly food recommendation AI for an app called Refi.
Time: ${mealContext}
${userContext}
Available recipes: ${JSON.stringify((allRecipes || []).map((r: any) => ({ id: r.id, title: r.title, cuisine: r.cuisine, category: r.category })))}

Return ONLY a valid JSON object (no markdown):
{
  "message": "short catchy suggestion max 6 words with food emoji",
  "subtext": "short subtitle max 8 words",
  "recipeId": "one recipe id from the list above",
  "emoji": "food emoji",
  "mood": "excited"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 256 }
        })
      }
    );

    let suggestion;
    if (response.ok) {
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      try { suggestion = JSON.parse(cleaned); } catch { suggestion = null; }
    }

    if (!suggestion) {
      suggestion = {
        message: "Something delicious awaits! ???",
        subtext: "We picked a recipe just for you",
        recipeId: allRecipes?.[Math.floor(Math.random() * (allRecipes?.length || 1))]?.id,
        emoji: "???",
        mood: "excited",
      };
    }

    if (suggestion.recipeId) {
      const { data: recipe } = await supabase.from("recipes").select("*").eq("id", suggestion.recipeId).single();
      suggestion.recipe = recipe ?? null;
    }

    return new Response(JSON.stringify(suggestion), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("AI suggest error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
