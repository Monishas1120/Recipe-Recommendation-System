import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Search, Grid, List } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockRecipes } from "@/data/mockData";
import { Link } from "react-router-dom";

const Favorites = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Filter favorites
  const favoriteRecipes = mockRecipes.filter((r) => r.isFavorite);
  const filteredRecipes = favoriteRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-coral fill-coral" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Favorites
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Recipes you've saved for quick access
          </p>
        </motion.div>

        {favoriteRecipes.length > 0 ? (
          <>
            {/* Search & View Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between"
            >
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-xl"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-xl"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* Results Count */}
            <p className="text-muted-foreground mb-6">
              {filteredRecipes.length} favorite recipes
            </p>

            {/* Recipes Grid */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredRecipes.map((recipe, i) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                 
                </motion.div>
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                  No matches found
                </h3>
                <p className="text-muted-foreground">
                  Try a different search term
                </p>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">💝</div>
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
              No favorites yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start exploring recipes and tap the heart icon to save your favorites here
            </p>
            <Link to="/categories">
              <Button className="bg-gradient-hero hover:opacity-90">
                Browse Recipes
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Favorites;
