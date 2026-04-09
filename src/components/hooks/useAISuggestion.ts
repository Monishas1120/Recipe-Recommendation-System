import { useState, useCallback } from "react";
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
      const res = await fetch("http://localhost:5000/ai-suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Suggest a food for a user. Time: ${new Date().getHours()}`,
          userId: user?.id || null,
        }),
      });

      const data = await res.json();

      // 🔥 Transform backend response → your UI format
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Try something healthy today! 🥗";

      const formatted: AISuggestion = {
        message: text,
        subtext: "AI generated suggestion",
        recipeId: "ai-temp",
        emoji: "🍽️",
        mood: "healthy",
      };

      setSuggestion(formatted);
      return formatted;
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