import { useState, useCallback } from "react";

export interface Recipe {
  id: string;
  uri: string; // ✅ ADDED (IMPORTANT)
  title: string;
  image: string;
  ingredients: string[];
  instructions: string[];
  time: string;
  servings: number;
  calories: number;
  category: string;
  difficulty: string;
  description: string | null;
  cuisine: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface SearchOptions {
  query?: string;
  category?: string;
  diet?: string;
  limit?: number;
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchRecipes = useCallback(async (options: SearchOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      let query = options.query || "chicken";
      if (options.category) query = options.category;

      const res = await fetch(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(
          query
        )}&app_id=00db35c1&app_key=acf203c49e1aafe6f8af9d9fc10d95fc`,
        {
          headers: {
            "Edamam-Account-User": "monisha",
          },
        }
      );

      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      const data = await res.json();

      const recipesData: Recipe[] =
        data?.hits?.map((item: any, i: number) => ({
          id: item.recipe.uri || `recipe-${i}`,
          uri: item.recipe.uri, // ✅ REQUIRED FOR DETAILS PAGE
          title: item.recipe.label,
          image: item.recipe.image,
          ingredients: item.recipe.ingredientLines || [],
          instructions: [],
          time: item.recipe.totalTime
            ? `${item.recipe.totalTime} min`
            : "N/A",
          servings: item.recipe.yield || 1,
          calories: Math.round(item.recipe.calories || 0),
          category: options.category || "food",
          difficulty: "medium",
          description: null,
          cuisine: item.recipe.cuisineType?.[0] || null,
          tags: item.recipe.dishType || [],
          created_at: "",
          updated_at: "",
        })) || [];

      setRecipes(recipesData);
      return recipesData;
    } catch (err) {
      console.error("Recipe fetch error:", err);
      setError("Failed to fetch recipes");
      setRecipes([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllRecipes = useCallback(() => searchRecipes(), [searchRecipes]);

  return {
    recipes,
    loading,
    error,
    searchRecipes,
    fetchAllRecipes,
  };
}