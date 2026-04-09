import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Search, Grid, List } from "lucide-react";
import { Layout } from "../components/layout/Layout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRecipes } from "@/hooks/useRecipes";

const Favorites = () => {
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all recipes on mount for lookup
  const { recipes, loading: recipesLoading } = useRecipes();
  const [allRecipes, setAllRecipes] = useState<any[]>([]);
  useEffect(() => {
    setAllRecipes(recipes);
  }, [recipes]);

  // ✅ FETCH FAVORITES
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id);

      if (!error) setFavorites(data || []);
      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  // ✅ REMOVE FAVORITE
  const removeFavorite = async (id: string) => {
    await supabase.from("favorites").delete().eq("id", id);

    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ FILTER
  const filtered = favorites.filter((fav) =>
    fav.recipe_names.some((name: string) =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-coral fill-coral" />
          </div>
          <h1 className="font-display text-4xl font-bold mb-4">
            Your Favorites
          </h1>
          <p className="text-muted-foreground">
            Recipes you've saved
          </p>
        </motion.div>

        {/* LOADING */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : favorites.length > 0 ? (
          <>
            {/* SEARCH + VIEW */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                <Input
                  placeholder="Search favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setViewMode("grid")}>
                  <Grid className="w-4 h-4" />
                </Button>
                <Button onClick={() => setViewMode("list")}>
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* GRID */}
            <div
              className={
                viewMode === "grid"
                  ? "grid md:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filtered.map((fav) =>
                fav.recipe_names.map((uri: string) => {
                  const recipe = allRecipes.find((r) => r.uri === uri);
                  return (
                    <motion.div
                      key={fav.id + uri}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 bg-white rounded-xl shadow"
                    >
                      {recipe ? (
                        <>
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-40 object-cover rounded mb-2"
                          />
                          <h3 className="font-semibold mb-2">{recipe.title}</h3>
                        </>
                      ) : (
                        <h3 className="font-semibold mb-2">{uri}</h3>
                      )}
                      <div className="flex justify-between items-center">
                        <Link to="/recipe-details" state={{ recipeUri: uri }}>
                          <Button size="sm">View</Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFavorite(fav.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {filtered.length === 0 && (
              <p className="text-center mt-10">No matches found</p>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-2xl font-semibold mb-2">
              No favorites yet
            </h3>
            <Link to="/categories">
              <Button>Browse Recipes</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Favorites;
