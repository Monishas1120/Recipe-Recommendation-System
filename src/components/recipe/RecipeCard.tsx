import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Recipe {
  uri: string;
  title: string;
  image: string;
  time: string;
  servings: number;
  calories: number;
  category: string;
  difficulty: string;
  description?: string | null;
  ingredients?: string[];
  url?: string;
  cuisine?: string | null;
  tags?: string[];
  isFavorite?: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
  onFavoriteToggle?: (id: string) => void;
  compact?: boolean;
}

export const RecipeCard = ({
  recipe,
  onFavoriteToggle,
  compact = false,
}: RecipeCardProps) => {
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorite);
  const navigate = useNavigate();

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavoriteToggle?.(recipe.uri);
  };

  // ✅ Compact version (small lists)
  if (compact) {
    return (
      <div
        onClick={() => navigate("/recipe-details", { state: { recipe } })}
        className="flex items-center gap-3 p-3 bg-muted rounded-xl hover:bg-muted/80 transition cursor-pointer"
      >
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{recipe.title}</h4>
          <p className="text-sm text-muted-foreground">
            {recipe.time} • {recipe.calories} kcal
          </p>
        </div>
      </div>
    );
  }

  // ✅ MAIN PREMIUM CARD
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      onClick={() => navigate("/recipe-details", { state: { recipe } })}
      className="rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative h-56">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />

        {/* GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        {/* CATEGORY */}
        <span className="absolute top-3 left-3 bg-white/90 text-xs px-3 py-1 rounded-full font-medium">
          {recipe.category}
        </span>

        {/* FAVORITE */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* TITLE OVER IMAGE */}
        <div className="absolute bottom-0 p-4 text-white w-full">
          <h3 className="text-lg font-semibold leading-tight line-clamp-2">
            {recipe.title}
          </h3>
        </div>
      </div>

      {/* INFO */}
      <div className="p-4 space-y-3">

        {/* META */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>⏱ {recipe.time}</span>
          <span>🔥 {recipe.calories}</span>
          <span>👥 {recipe.servings}</span>
        </div>

        {/* INGREDIENT PREVIEW */}
        {recipe.ingredients?.length > 0 && (
          <div className="text-sm text-gray-600 line-clamp-2">
            🧂 {recipe.ingredients.slice(0, 3).join(", ")}...
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate("/recipe-details", { state: { recipe } });
          }}
          className="w-full py-2 text-sm font-medium bg-black text-white rounded-lg hover:opacity-90 transition"
        >
          View Recipe
        </button>
      </div>
    </motion.div>
  );
};