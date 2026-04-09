import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client"; // adjust path if needed
import { Recipe } from "./useRecipes";

export interface FoodAnalysis {
  dishName: string;
  ingredients: string[];
  cuisine: string;
  category: string;
  searchTerms?: string[];
}

export interface RecognitionResult {
  analysis: FoodAnalysis;
  recipe: object;
  recipes: Recipe[];
  confidence: number;
}

export function useFoodRecognition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecognitionResult | null>(null);

  const recognizeFood = useCallback(async (imageBase64: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "recognize-food",
        {
          body: { imageBase64 },
        }
      );

      if (fnError) throw fnError;

      const safeResult: RecognitionResult = {
        analysis: {
          dishName: data?.analysis?.dishName || "Unknown Dish",
          cuisine: data?.analysis?.cuisine || "Unknown",
          category: data?.analysis?.category || "General",
          ingredients: data?.analysis?.ingredients || [],
          searchTerms: data?.analysis?.searchTerms || [],
        },
        recipe: data?.recipe || {},
        recipes: data?.recipes || [],
        confidence: data?.confidence ?? 0.9,
      };

      setResult(safeResult);
      return safeResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Recognition failed";
      console.error("Recognition error:", err);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { loading, error, result, recognizeFood, clearResult };
}