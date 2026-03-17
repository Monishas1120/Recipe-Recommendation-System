import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRecipes, Recipe } from "@/hooks/useRecipes";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  onSearch?: (results: Recipe[]) => void;
  placeholder?: string;
  showResults?: boolean;
  className?: string;
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Search recipes...",
  showResults = true,
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { recipes, loading, searchRecipes } = useRecipes();
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchRecipes({ query: debouncedQuery, limit: 6 });
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [debouncedQuery, searchRecipes]);

  useEffect(() => {
    if (onSearch && recipes.length > 0) {
      onSearch(recipes);
    }
  }, [recipes, onSearch]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/categories?search=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
    }
  }, [query, navigate]);

  const handleResultClick = useCallback((recipeId: string) => {
    setShowDropdown(false);
    setQuery("");
    navigate(`/categories?id=${recipeId}`);
  }, [navigate]);

  const clearQuery = useCallback(() => {
    setQuery("");
    setShowDropdown(false);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-12 pr-20 h-14 text-lg rounded-2xl border-2 border-border focus:border-primary bg-background shadow-medium"
            onFocus={() => query.length >= 2 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="absolute right-24 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <Button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-hero hover:opacity-90 rounded-xl"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </Button>
        </div>
      </form>

      {/* Dropdown Results */}
      <AnimatePresence>
        {showResults && showDropdown && recipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-strong border border-border overflow-hidden z-50"
          >
            <div className="p-2">
              {recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => handleResultClick(recipe.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{recipe.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {recipe.time} • {recipe.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t border-border p-2">
              <button
                onClick={handleSubmit}
                className="w-full text-center text-sm text-primary hover:underline py-2"
              >
                View all results for "{query}"
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
