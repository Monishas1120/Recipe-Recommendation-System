import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface UserStats {
  total_tokens: number;
  recipes_viewed: number;
  recipes_cooked: number;
  recipes_favorited: number;
  scans_completed: number;
  current_streak: number;
  longest_streak: number;
  level: number;
  last_active_date: string | null;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  requirement: number;
  current: number;
}

const LEVEL_THRESHOLDS = [0, 10, 30, 60, 100, 150, 220, 300, 400, 500];

export function useGamification() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code === "PGRST116") {
        // No stats yet, create them
        const { data: newData } = await supabase
          .from("user_stats")
          .insert({ user_id: user.id })
          .select()
          .single();
        setStats(newData);
      } else if (data) {
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const trackActivity = useCallback(async (
    activityType: string,
    recipeId?: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return;

    try {
      // Log activity
      await supabase.from("user_activity").insert({
        user_id: user.id,
        activity_type: activityType,
        recipe_id: recipeId || null,
        metadata: metadata || {},
      });

      // Award token
      const tokenMap: Record<string, { amount: number; description: string }> = {
        view: { amount: 1, description: "Viewed a recipe" },
        cook: { amount: 5, description: "Marked recipe as cooked" },
        favorite: { amount: 2, description: "Saved a favorite" },
        scan: { amount: 3, description: "Scanned food with AI" },
        search: { amount: 1, description: "Searched for recipes" },
      };

      const token = tokenMap[activityType];
      if (token) {
        await supabase.from("user_tokens").insert({
          user_id: user.id,
          token_type: activityType,
          amount: token.amount,
          description: token.description,
          metadata: { recipe_id: recipeId },
        });
      }

      // Update counters
      const counterMap: Record<string, string> = {
        view: "recipes_viewed",
        cook: "recipes_cooked",
        favorite: "recipes_favorited",
        scan: "scans_completed",
      };

      const counterField = counterMap[activityType];
      if (counterField && stats) {
        const today = new Date().toISOString().split("T")[0];
        const lastActive = stats.last_active_date;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

        let newStreak = stats.current_streak;
        if (lastActive !== today) {
          newStreak = lastActive === yesterday ? stats.current_streak + 1 : 1;
        }

        const newTokens = stats.total_tokens + (token?.amount || 0);
        const newLevel = LEVEL_THRESHOLDS.findIndex((t) => newTokens < t);
        const level = newLevel === -1 ? LEVEL_THRESHOLDS.length : Math.max(1, newLevel);

        await supabase
          .from("user_stats")
          .update({
            [counterField]: (stats[counterField as keyof UserStats] as number) + 1,
            total_tokens: newTokens,
            current_streak: newStreak,
            longest_streak: Math.max(stats.longest_streak, newStreak),
            level,
            last_active_date: today,
          })
          .eq("user_id", user.id);

        fetchStats();
      }
    } catch (err) {
      console.error("Failed to track activity:", err);
    }
  }, [user, stats, fetchStats]);

  const getBadges = useCallback((): Badge[] => {
    if (!stats) return [];
    return [
      { id: "first_taste", name: "First Taste", description: "View your first recipe", icon: "👀", earned: stats.recipes_viewed >= 1, requirement: 1, current: stats.recipes_viewed },
      { id: "explorer", name: "Explorer", description: "View 10 recipes", icon: "🧭", earned: stats.recipes_viewed >= 10, requirement: 10, current: stats.recipes_viewed },
      { id: "home_chef", name: "Home Chef", description: "Cook 5 recipes", icon: "👨‍🍳", earned: stats.recipes_cooked >= 5, requirement: 5, current: stats.recipes_cooked },
      { id: "food_lover", name: "Food Lover", description: "Favorite 10 recipes", icon: "❤️", earned: stats.recipes_favorited >= 10, requirement: 10, current: stats.recipes_favorited },
      { id: "ai_scanner", name: "AI Scanner", description: "Scan 3 food images", icon: "📸", earned: stats.scans_completed >= 3, requirement: 3, current: stats.scans_completed },
      { id: "streak_master", name: "Streak Master", description: "5-day streak", icon: "🔥", earned: stats.longest_streak >= 5, requirement: 5, current: stats.current_streak },
      { id: "centurion", name: "Centurion", description: "Earn 100 tokens", icon: "💎", earned: stats.total_tokens >= 100, requirement: 100, current: stats.total_tokens },
      { id: "master_chef", name: "Master Chef", description: "Reach level 5", icon: "⭐", earned: stats.level >= 5, requirement: 5, current: stats.level },
    ];
  }, [stats]);

  return { stats, loading, trackActivity, fetchStats, getBadges };
}
