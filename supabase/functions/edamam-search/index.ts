import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const EDAMAM_APP_ID = Deno.env.get("EDAMAM_APP_ID");
    const EDAMAM_APP_KEY = Deno.env.get("EDAMAM_APP_KEY");

    if (!EDAMAM_APP_ID) throw new Error("EDAMAM_APP_ID is not configured");
    if (!EDAMAM_APP_KEY) throw new Error("EDAMAM_APP_KEY is not configured");

    const { query, diet, health, cuisineType, mealType, calories, from = 0, to = 20 } = await req.json();

    if (!query) throw new Error("Search query is required");

    const params = new URLSearchParams({
      type: "public",
      q: query,
      app_id: EDAMAM_APP_ID,
      app_key: EDAMAM_APP_KEY,
      from: String(from),
      to: String(to),
    });

    if (diet) params.append("diet", diet);
    if (health) params.append("health", health);
    if (cuisineType) params.append("cuisineType", cuisineType);
    if (mealType) params.append("mealType", mealType);
    if (calories) params.append("calories", calories);

    console.log("Searching Edamam for:", query);

    const response = await fetch(
      `https://api.edamam.com/api/recipes/v2?${params.toString()}`
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Edamam API error:", response.status, errText);
      throw new Error(`Edamam API failed [${response.status}]: ${errText}`);
    }

    const data = await response.json();

    // Transform to our format
    const recipes = (data.hits || []).map((hit: any, i: number) => ({
      id: `edamam-${from + i}`,
      title: hit.recipe.label,
      image: hit.recipe.image,
      source: hit.recipe.source,
      sourceUrl: hit.recipe.url,
      servings: hit.recipe.yield || 4,
      calories: Math.round(hit.recipe.calories / (hit.recipe.yield || 1)),
      time: hit.recipe.totalTime ? `${hit.recipe.totalTime} min` : "N/A",
      ingredients: hit.recipe.ingredientLines || [],
      cuisineType: hit.recipe.cuisineType || [],
      mealType: hit.recipe.mealType || [],
      dietLabels: hit.recipe.dietLabels || [],
      healthLabels: hit.recipe.healthLabels || [],
      nutrients: {
        protein: Math.round(hit.recipe.totalNutrients?.PROCNT?.quantity || 0),
        fat: Math.round(hit.recipe.totalNutrients?.FAT?.quantity || 0),
        carbs: Math.round(hit.recipe.totalNutrients?.CHOCDF?.quantity || 0),
        fiber: Math.round(hit.recipe.totalNutrients?.FIBTG?.quantity || 0),
      },
      tags: [
        ...(hit.recipe.dietLabels || []),
        ...(hit.recipe.cuisineType || []),
      ],
    }));

    return new Response(
      JSON.stringify({
        recipes,
        count: data.count || 0,
        from: data.from || 0,
        to: data.to || 20,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edamam search error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
