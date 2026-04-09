// @ts-nocheck
/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function extractJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("No valid JSON found in response");
  }
}

async function analyzeFoodWithOpenRouter(imageBase64: string) {
  const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
  if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is not set");

  const imageData = imageBase64.includes(",")
    ? imageBase64
    : `data:image/jpeg;base64,${imageBase64}`;

  const prompt = `You are a professional chef and food recognition expert.
Return ONLY valid JSON (no markdown, no explanation).

{
  "dishName": "name",
  "cuisine": "type",
  "category": "category",
  "ingredients": ["item1","item2"],
  "recipe": {
    "steps": ["step1","step2"],
    "prepTime": "time",
    "cookTime": "time",
    "servings": "number"
  },
  "searchTerms": ["term1","term2"]
}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://wntfxtgdzxhgqvpkbyxy.supabase.co",
      "X-Title": "Food Recognition App",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageData },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content || "";
  console.log("🔍 OpenRouter raw:", rawText);
  const cleaned = rawText.replace(/```json|```/g, "").trim();
  return extractJSON(cleaned);
}

async function fetchEdamamRecipes(query: string) {
  const EDAMAM_APP_ID = Deno.env.get("EDAMAM_APP_ID");
  const EDAMAM_APP_KEY = Deno.env.get("EDAMAM_APP_KEY");

  if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) return [];

  try {
    const url = `https://api.edamam.com/search?q=${encodeURIComponent(
      query
    )}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&to=4`;

    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();

    return (
      data.hits?.map((hit: any) => ({
        id: hit.recipe.uri,
        label: hit.recipe.label,
        image: hit.recipe.image,
        url: hit.recipe.url,
        ingredients: hit.recipe.ingredientLines?.slice(0, 8) || [],
      })) || []
    );
  } catch {
    return [];
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid or missing JSON body" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const imageBase64 = body?.imageBase64 || body?.image;

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    let analysis;

    try {
      analysis = await analyzeFoodWithOpenRouter(imageBase64);
    } catch (err) {
      console.error("❌ OpenRouter error:", err.message);
      return new Response(
        JSON.stringify({
          error: "Food recognition failed",
          details: err.message,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const recipes = await fetchEdamamRecipes(
      analysis.searchTerms?.[0] || analysis.dishName
    );

    return new Response(
      JSON.stringify({
        analysis: {
          dishName: analysis.dishName || "Unknown Dish",
          cuisine: analysis.cuisine || "Unknown",
          category: analysis.category || "Unknown",
          ingredients: analysis.ingredients || [],
          searchTerms: analysis.searchTerms || [],
        },
        recipe: analysis.recipe || {},
        recipes,
        confidence: 0.9,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("🔥 Server error:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: err.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});