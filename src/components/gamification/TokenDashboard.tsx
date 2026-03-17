import { motion } from "framer-motion";
import { Trophy, Flame, Eye, Heart, Camera, ChefHat, Zap, Star } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { Progress } from "@/components/ui/progress";

const LEVEL_THRESHOLDS = [0, 10, 30, 60, 100, 150, 220, 300, 400, 500];

export function TokenDashboard() {
  const { stats, loading, getBadges } = useGamification();
  const badges = getBadges();

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const currentThreshold = LEVEL_THRESHOLDS[stats.level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[stats.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const levelProgress = Math.min(
    100,
    ((stats.total_tokens - currentThreshold) / (nextThreshold - currentThreshold)) * 100
  );

  const counters = [
    { label: "Recipes Viewed", value: stats.recipes_viewed, icon: Eye, color: "text-primary" },
    { label: "Recipes Cooked", value: stats.recipes_cooked, icon: ChefHat, color: "text-sage" },
    { label: "Favorites", value: stats.recipes_favorited, icon: Heart, color: "text-destructive" },
    { label: "AI Scans", value: stats.scans_completed, icon: Camera, color: "text-honey" },
  ];

  return (
    <div className="space-y-8">
      {/* Level & Tokens Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-hero rounded-3xl p-8 text-primary-foreground"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Level {stats.level}</span>
            </div>
            <h2 className="font-display text-4xl font-bold">{stats.total_tokens} Tokens</h2>
          </div>
          <div className="flex items-center gap-2 bg-primary-foreground/20 rounded-full px-4 py-2">
            <Flame className="w-5 h-5" />
            <span className="font-bold">{stats.current_streak} day streak</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2 opacity-90">
            <span>Level {stats.level}</span>
            <span>Level {Math.min(stats.level + 1, LEVEL_THRESHOLDS.length)}</span>
          </div>
          <div className="h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-primary-foreground/80 rounded-full"
            />
          </div>
          <p className="text-sm mt-2 opacity-80">
            {nextThreshold - stats.total_tokens} tokens to next level
          </p>
        </div>
      </motion.div>

      {/* Counters Grid */}
      <div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-4">Your Activity</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {counters.map((counter, i) => (
            <motion.div
              key={counter.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 text-center shadow-soft"
            >
              <counter.icon className={`w-8 h-8 mx-auto mb-3 ${counter.color}`} />
              <div className="font-display text-3xl font-bold text-foreground mb-1">
                {counter.value}
              </div>
              <div className="text-sm text-muted-foreground">{counter.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-4">Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl p-5 text-center transition-all ${
                badge.earned
                  ? "bg-card shadow-soft"
                  : "bg-muted/50 opacity-60"
              }`}
            >
              <div className={`text-3xl mb-2 ${badge.earned ? "" : "grayscale"}`}>
                {badge.icon}
              </div>
              <h4 className="font-medium text-sm text-foreground mb-1">{badge.name}</h4>
              <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
              <Progress
                value={Math.min(100, (badge.current / badge.requirement) * 100)}
                className="h-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {badge.current}/{badge.requirement}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
