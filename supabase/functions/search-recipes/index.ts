import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function searchEdamam(query: string, limit: number) {
  const EDAMAM_APP_ID = Deno.env.get("EDAMAM_APP_ID");
  const EDAMAM_APP_KEY = Deno.env.get("EDAMAM_APP_KEY");

  if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) {
    console.warn("Edamam API keys not configured, skipping external search");
    return [];
  }

  const params = new URLSearchParams({
    type: "public",
    q: query,
    app_id: EDAMAM_APP_ID,
    app_key: EDAMAM_APP_KEY,
    from: "0",
    to: String(limit),
  });

  console.log("Fetching from Edamam API for:", query);

  const response = await fetch(
    `https://api.edamam.com/api/recipes/v2?${params.toString()}`
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error("Edamam API error:", response.status, errText);
    return [];
  }

  const data = await response.json();

  return (data.hits || []).map((hit: { recipe: any }, i: number) => ({
    id: `edamam-${i}-${Date.now()}`,
    title: hit.recipe.label,
    description: hit.recipe.source || null,
    image:
      hit.recipe.image ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    time: hit.recipe.totalTime ? `${hit.recipe.totalTime} min` : "30 min",
    servings: hit.recipe.yield || 4,
    calories: Math.round(hit.recipe.calories / (hit.recipe.yield || 1)),
    category: hit.recipe.mealType?.[0] || "Lunch",
    difficulty:
      hit.recipe.totalTime > 45
        ? "Hard"
        : hit.recipe.totalTime > 20
        ? "Medium"
        : "Easy",
    ingredients: hit.recipe.ingredientLines || [],
    instructions: ["Visit source for full instructions"],
    cuisine: hit.recipe.cuisineType?.[0] || null,
    tags: [...(hit.recipe.dietLabels || []), ...(hit.recipe.cuisineType || [])],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    source: "edamam",
    sourceUrl: hit.recipe.url,
  }));
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query, category, difficulty, limit = 20 } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Searching recipes with:", {
      query,
      category,
      difficulty,
      limit,
    });

    let dbQuery = supabase.from("recipes").select("*").limit(limit);

    if (query && query.trim()) {
      dbQuery = dbQuery.or(
        `title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query.toLowerCase()}}`
      );
    }

    if (category && category !== "all") {
      dbQuery = dbQuery.eq("category", category);
    }

    if (difficulty && difficulty !== "all") {
      dbQuery = dbQuery.eq("difficulty", difficulty);
    }

    const { data: recipes, error } = await dbQuery.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    let allRecipes = recipes || [];

    if (query && query.trim() && allRecipes.length < 4) {
      console.log(
        `Only ${allRecipes.length} DB results, fetching from Edamam...`
      );
      const edamamRecipes = await searchEdamam(
        query,
        limit - allRecipes.length
      );
      allRecipes = [...allRecipes, ...edamamRecipes];
    }

    return new Response(JSON.stringify({ recipes: allRecipes }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Search error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});