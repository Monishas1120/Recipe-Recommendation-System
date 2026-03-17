import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image: string;
  time: string;
  servings: number;
  calories: number;
  category: string;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  cuisine: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  isFavorite?: boolean;
}

interface SearchParams {
  query?: string;
  category?: string;
  difficulty?: string;
  limit?: number;
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchRecipes = useCallback(async (params: SearchParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase.functions.invoke("search-recipes", {
        body: params,
      });

      if (fetchError) {
        throw fetchError;
      }

      setRecipes(data.recipes || []);
      return data.recipes || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to search recipes";
      setError(message);
      console.error("Search error:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllRecipes = useCallback(async (limit = 50) => {
    return searchRecipes({ limit });
  }, [searchRecipes]);

  const fetchByCategory = useCallback(async (category: string) => {
    return searchRecipes({ category, limit: 50 });
  }, [searchRecipes]);

  return {
    recipes,
    loading,
    error,
    searchRecipes,
    fetchAllRecipes,
    fetchByCategory,
  };
}
