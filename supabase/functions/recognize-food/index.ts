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
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      throw new Error("No image provided");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing food image with AI...");

    // Use Gemini for image analysis
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this food image and identify the dish or ingredients. Return a JSON object with:
- "dishName": the name of the dish or primary food item
- "ingredients": array of visible ingredients
- "cuisine": likely cuisine type (Italian, Mexican, Asian, etc.)
- "category": meal category (Breakfast, Lunch, Dinner, Dessert, Snack)
- "searchTerms": array of 3-5 terms to search for related recipes

Only return valid JSON, no markdown or explanation.`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "API credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      throw new Error("Failed to analyze image");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";
    
    console.log("AI response:", content);

    // Parse the JSON response
    let foodAnalysis;
    try {
      // Clean the response in case it has markdown
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      foodAnalysis = JSON.parse(cleanContent);
    } catch {
      console.error("Failed to parse AI response:", content);
      foodAnalysis = {
        dishName: "Unknown Dish",
        ingredients: [],
        cuisine: "Unknown",
        category: "Lunch",
        searchTerms: ["food"]
      };
    }

    // Search for matching recipes
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Search using the identified terms
    const searchTerms = foodAnalysis.searchTerms || [foodAnalysis.dishName];
    const searchQuery = searchTerms.join(" ");

    console.log("Searching for recipes with:", searchQuery);

    const { data: recipes, error: dbError } = await supabase
      .from("recipes")
      .select("*")
      .or(`title.ilike.%${searchQuery}%,tags.cs.{${searchTerms[0]?.toLowerCase() || "food"}}`)
      .limit(8);

    if (dbError) {
      console.error("Database error:", dbError);
    }

    return new Response(
      JSON.stringify({
        analysis: foodAnalysis,
        recipes: recipes || [],
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Food recognition error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
