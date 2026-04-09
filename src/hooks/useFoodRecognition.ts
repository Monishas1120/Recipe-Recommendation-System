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

interface RecipeSteps {
  steps: string[];
  prepTime: string;
  cookTime: string;
  servings: string;
}

interface RecognitionResult {
  analysis: FoodAnalysis;
  recipe: RecipeSteps;   // Claude's own recipe with steps
  recipes: Recipe[];     // Edamam cards (optional)
  confidence: number;
}

export function useFoodRecognition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecognitionResult | null>(null);

  // Resize image before sending — reduces payload from ~4MB to ~200KB
  const resizeImage = useCallback(
    (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const MAX = 512;
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const scale = Math.min(MAX / img.width, MAX / img.height, 1);
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", 0.85));
          };
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }),
    []
  );

  const recognizeFood = useCallback(async (imageBase64: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error: fetchError } = await supabase.functions.invoke(
        "recognize-food",
        { body: { imageBase64 } }
      );

      if (fetchError) throw fetchError;
      if (data?.error) throw new Error(data.error);

      setResult(data);
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to recognize food";
      setError(message);
      console.error("Recognition error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Call this from the component — it resizes first, then sends
  const recognizeFoodFromFile = useCallback(
    async (file: File) => {
      try {
        const resized = await resizeImage(file);
        return await recognizeFood(resized);
      } catch {
        return await recognizeFood(
          await new Promise<string>((res, rej) => {
            const r = new FileReader();
            r.onload = (e) => res(e.target?.result as string);
            r.onerror = rej;
            r.readAsDataURL(file);
          })
        );
      }
    },
    [resizeImage, recognizeFood]
  );

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    result,
    recognizeFood,
    recognizeFoodFromFile,  // use this in your component
    clearResult,
  };
}