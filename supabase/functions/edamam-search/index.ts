// index.ts — Supabase function (clean, Node-style)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
    const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;

    if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) throw new Error("API keys not configured");

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

    const response = await fetch(`https://api.edamam.com/api/recipes/v2?${params.toString()}`);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Edamam API failed [${response.status}]: ${errText}`);
    }

    const data = await response.json();

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
      tags: [...(hit.recipe.dietLabels || []), ...(hit.recipe.cuisineType || [])],
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
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}