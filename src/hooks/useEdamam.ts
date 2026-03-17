import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface EdamamRecipe {
  id: string;
  title: string;
  image: string;
  source: string;
  sourceUrl: string;
  servings: number;
  calories: number;
  time: string;
  ingredients: string[];
  cuisineType: string[];
  mealType: string[];
  dietLabels: string[];
  healthLabels: string[];
  nutrients: {
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
  };
  tags: string[];
}

export interface NutritionResult {
  ingredients: string[];
  nutrition: {
    calories: number;
    totalWeight: number;
    dietLabels: string[];
    healthLabels: string[];
    nutrients: {
      protein: number;
      fat: number;
      carbs: number;
      fiber: number;
      sugar: number;
    };
  };
  model: string;
  confidence: number;
}

interface SearchParams {
  query: string;
  diet?: string;
  health?: string;
  cuisineType?: string;
  mealType?: string;
  calories?: string;
}

export function useEdamam() {
  const [recipes, setRecipes] = useState<EdamamRecipe[]>([]);
  const [nutrition, setNutrition] = useState<NutritionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchRecipes = useCallback(async (params: SearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase.functions.invoke("edamam-search", {
        body: params,
      });

      if (fetchError) throw fetchError;
      setRecipes(data.recipes || []);
      return data.recipes || [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Search failed";
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeNutrition = useCallback(async (input: { ingredients?: string[]; imageBase64?: string }) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase.functions.invoke("nutrition-analyze", {
        body: input,
      });

      if (fetchError) throw fetchError;
      if (data.error) throw new Error(data.error);
      setNutrition(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Analysis failed";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { recipes, nutrition, loading, error, searchRecipes, analyzeNutrition };
}
