import { motion } from "framer-motion";
import { Heart, Clock, Users, Flame } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Recipe {
  id: string;
  title: string;
  image: string;
  time: string;
  servings: number;
  calories: number;
  category: string;
  difficulty: string;
  description?: string | null;
  ingredients?: string[];
  instructions?: string[];
  cuisine?: string | null;
  tags?: string[];
  isFavorite?: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
  onFavoriteToggle?: (id: string) => void;
  compact?: boolean;
}

export const RecipeCard = ({ recipe, onFavoriteToggle, compact = false }: RecipeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorite);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavoriteToggle?.(recipe.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-sage/20 text-sage";
      case "Hard":
        return "bg-coral/20 text-coral";
      default:
        return "bg-honey/20 text-honey";
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors cursor-pointer">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{recipe.title}</h4>
          <p className="text-sm text-muted-foreground">
            {recipe.time} • {recipe.calories} kcal
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-strong transition-shadow duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <motion.img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              isFavorite ? "fill-coral text-coral" : "text-muted-foreground"
            )}
          />
        </button>

        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
          {recipe.category}
        </span>

        {/* Difficulty */}
        <span
          className={cn(
            "absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-medium",
            getDifficultyColor(recipe.difficulty)
          )}
        >
          {recipe.difficulty}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-card-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings}</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4" />
            <span>{recipe.calories} kcal</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};