import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useRecipes } from "@/hooks/useRecipes";
import { RecipeCard } from "@/components/recipe/RecipeCard"; // ✅ IMPORTANT

export function TrendingRecipes() {
  const { recipes, fetchAllRecipes, loading } = useRecipes();

  useEffect(() => {
    fetchAllRecipes();
  }, [fetchAllRecipes]);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-2">
              <TrendingUp className="w-4 h-4" />
              Trending Now
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Popular Recipes
            </h2>
          </div>

          <Link to="/categories">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              See More <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : recipes.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No recipes found
            </div>
          ) : (
            recipes.slice(0, 8).map((recipe, i) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                {/* ✅ USE SAME CARD AS CATEGORIES */}
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))
          )}

        </div>
      </div>
    </section>
  );
}