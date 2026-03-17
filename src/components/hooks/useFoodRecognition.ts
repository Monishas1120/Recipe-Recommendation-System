import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Recipe } from "./useRecipes";

interface FoodAnalysis {
  dishName: string;
  ingredients: string[];
  cuisine: string;
  category: string;
  searchTerms: string[];
}

interface RecognitionResult {
  analysis: FoodAnalysis;
  recipes: Recipe[];
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
      const { data, error: fetchError } = await supabase.functions.invoke("recognize-food", {
        body: { imageBase64 },
      });

      if (fetchError) {
        throw fetchError;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to recognize food";
      setError(message);
      console.error("Recognition error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    result,
    recognizeFood,
    clearResult,
  };
}
