import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, Coffee, Utensils, Pizza, Cake, Salad, Leaf, Fish, Soup, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRecipes } from "@/hooks/useRecipes";
import { categories } from "@/data/mockData";

const categoryIcons = [Coffee, Utensils, Pizza, Cake, Salad, Leaf, Fish, Soup];

const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category"));
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("popular");
  
  const { recipes, loading, searchRecipes, fetchAllRecipes } = useRecipes();

  // Initial load
  useEffect(() => {
    const initialSearch = searchParams.get("search");
    const initialCategory = searchParams.get("category");
    
    if (initialSearch) {
      setSearchQuery(initialSearch);
      searchRecipes({ query: initialSearch, limit: 50 });
    } else if (initialCategory) {
      setSelectedCategory(initialCategory);
      searchRecipes({ category: initialCategory, limit: 50 });
    } else {
      fetchAllRecipes(50);
    }
  }, []);

  // Handle search and filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      searchRecipes({
        query: searchQuery || undefined,
        category: selectedCategory || undefined,
        limit: 50,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, searchRecipes]);

  const handleCategoryClick = (categoryName: string) => {
    const newCategory = selectedCategory === categoryName ? null : categoryName;
    setSelectedCategory(newCategory);
    if (newCategory) {
      setSearchParams({ category: newCategory });
    } else {
      setSearchParams({});
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Explore Recipes
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse through our collection of delicious recipes organized by category
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category, i) => (
              <div
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`transition-all cursor-pointer ${
                  selectedCategory === category.name
                    ? "ring-2 ring-primary ring-offset-2 rounded-2xl"
                    : ""
                }`}
              >
                {(() => {
  const Icon = categoryIcons[i];
  return (
    <div
      className="p-4 rounded-2xl border hover:shadow-md transition flex flex-col items-center justify-center text-center"
      style={{ backgroundColor: category.color }}
    >
      <Icon className="w-6 h-6 mb-2 text-white" />
      <h3 className="font-semibold text-white">{category.name}</h3>
      <p className="text-xs text-white/80">{category.count} recipes</p>
    </div>
  );
})()}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 h-12 rounded-xl">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="time">Cooking Time</SelectItem>
              <SelectItem value="calories">Lowest Calories</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-12 rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </motion.div>

        {/* Active Filters */}
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="text-sm text-muted-foreground">Filtering by:</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="rounded-full"
            >
              {selectedCategory} ×
            </Button>
          </motion.div>
        )}

        {/* Results Count */}
        <p className="text-muted-foreground mb-6">
          {loading ? "Searching..." : `Showing ${recipes.length} recipes`}
        </p>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            recipes.map((recipe, i) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
              </motion.div>
            ))
          )}
        </div>

        {!loading && recipes.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
              No recipes found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Categories;
