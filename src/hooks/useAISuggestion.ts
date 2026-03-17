import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Recipe } from "./useRecipes";

interface AISuggestion {
  message: string;
  subtext: string;
  recipeId: string;
  emoji: string;
  mood: "excited" | "cozy" | "healthy" | "adventurous";
  recipe?: Recipe;
}

export function useAISuggestion() {
  const { user } = useAuth();
  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSuggestion = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-suggest", {
        body: {
          userId: user?.id || null,
          context: { timeOfDay: new Date().getHours() },
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setSuggestion(data);
      return data;
    } catch (err) {
      console.error("AI suggestion error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const dismiss = useCallback(() => {
    setSuggestion(null);
  }, []);

  return { suggestion, loading, fetchSuggestion, dismiss };
}
