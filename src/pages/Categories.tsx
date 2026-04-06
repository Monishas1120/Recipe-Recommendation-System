import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useRecipes } from "@/hooks/useRecipes";
import { categories } from "@/data/mockData";
import { RecipeCard } from "@/components/recipe/RecipeCard";

export default function CategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const { recipes, loading, searchRecipes, fetchAllRecipes } = useRecipes();

  // ✅ SYNC STATE WITH URL PARAMS
  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    setSelectedCategory(category);
    setSearchQuery(search || "");
  }, [searchParams]);

  // ✅ FETCH DATA BASED ON STATE
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchRecipes({ query: searchQuery });
      } else if (selectedCategory) {
        searchRecipes({ category: selectedCategory });
      } else {
        fetchAllRecipes();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  // ✅ CATEGORY CLICK HANDLER
  const handleCategoryClick = (categoryName: string) => {
    const newCategory =
      selectedCategory === categoryName ? null : categoryName;

    setSearchParams(
      newCategory ? { category: newCategory } : {}
    );
  };

  // ✅ SEARCH INPUT HANDLER (sync URL)
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    setSearchParams(
      value ? { search: value } : {}
    );
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
          <h1 className="font-display text-4xl font-bold mb-4">
            Explore Recipes
          </h1>
          <p className="text-muted-foreground">
            Browse delicious recipes by category
          </p>
        </motion.div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-10">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`cursor-pointer p-4 rounded-xl text-center transition ${
                  selectedCategory === category.name
                    ? "ring-2 ring-primary scale-105"
                    : ""
                }`}
                style={{ backgroundColor: category.color }}
              >
                <Icon className="mx-auto mb-2 text-white" />
                <h3 className="text-white font-semibold">
                  {category.name}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="new">Newest</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">Filters</Button>
        </div>

        {/* Results */}
        <p className="mb-4">
          {loading ? "Loading..." : `${recipes.length} recipes found`}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <p className="col-span-full text-center">Loading...</p>
          ) : (
            recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
          )}
        </div>

        {!loading && recipes.length === 0 && (
          <p className="text-center mt-10">No recipes found</p>
        )}
      </div>
    </Layout>
  );
}