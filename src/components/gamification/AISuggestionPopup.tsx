import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAISuggestion } from "@/hooks/useAISuggestion";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const moodColors: Record<string, string> = {
  excited: "from-coral to-honey",
  cozy: "from-honey to-coral-light",
  healthy: "from-sage to-accent",
  adventurous: "from-primary to-honey",
};

export function AISuggestionPopup() {
  const { user } = useAuth();
  const { suggestion, loading, fetchSuggestion, dismiss } = useAISuggestion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show popup after a delay when user is on the page
    const timer = setTimeout(() => {
      fetchSuggestion().then((data) => {
        if (data) setVisible(true);
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [fetchSuggestion]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(dismiss, 300);
  };

  if (!suggestion || !visible) return null;

  const gradientClass = moodColors[suggestion.mood] || moodColors.excited;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <div className="bg-card rounded-3xl shadow-strong overflow-hidden border border-border">
            {/* Header gradient */}
            <div className={`bg-gradient-to-r ${gradientClass} p-4 relative`}>
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 text-primary-foreground/80 hover:text-primary-foreground"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="text-4xl">{suggestion.emoji}</div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3 h-3 text-primary-foreground/80" />
                    <span className="text-xs text-primary-foreground/80 font-medium">AI Suggestion</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-primary-foreground">
                    {suggestion.message}
                  </h3>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-3">{suggestion.subtext}</p>

              {suggestion.recipe && (
                <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3 mb-3">
                  <img
                    src={suggestion.recipe.image}
                    alt={suggestion.recipe.title}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {suggestion.recipe.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {suggestion.recipe.time} • {suggestion.recipe.calories} cal
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="flex-1 text-muted-foreground"
                >
                  Maybe Later
                </Button>
                <Link to={`/categories?search=${encodeURIComponent(suggestion.recipe?.title || "")}`} className="flex-1">
                  <Button
                    size="sm"
                    className="w-full bg-gradient-hero hover:opacity-90"
                    onClick={handleDismiss}
                  >
                    Let's Go <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
