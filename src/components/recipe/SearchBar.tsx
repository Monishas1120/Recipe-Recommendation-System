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
  const [aiResults, setAiResults] = useState<string[]>([]); // ✅ AI state

  const { recipes, loading, searchRecipes } = useRecipes();
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();

  // 🔍 Search from your existing system
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

  // 🤖 Python AI call
  const getAIRecommendations = async (query: string) => {
    try {
      const res = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: query }),
      });

      const data = await res.json();
      setAiResults(data.recommendations || []);
    } catch (err) {
      console.error("AI error:", err);
    }
  };

  // 🔍 Submit
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (query.trim()) {
      await getAIRecommendations(query); // ✅ AI call
      navigate(`/categories?search=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
    }
  }, [query, navigate]);

  // 👉 Click result
  const handleResultClick = useCallback((recipeId: string) => {
    setShowDropdown(false);
    setQuery("");
    navigate(`/recipe?id=${recipeId}`); // ✅ FIXED route
  }, [navigate]);

  const clearQuery = useCallback(() => {
    setQuery("");
    setShowDropdown(false);
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      
      {/* SEARCH BAR */}
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

      {/* 🔽 DROPDOWN RESULTS (SCROLL FIXED) */}
      <AnimatePresence>
        {showResults && showDropdown && recipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-strong border border-border z-50 max-h-72 overflow-y-auto"
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

      {/* 🤖 AI RESULTS */}
      {aiResults.length > 0 && (
        <div className="mt-4 bg-muted p-4 rounded-xl">
          <h3 className="font-semibold mb-2">AI Suggestions 🤖</h3>
          <ul className="list-disc list-inside">
            {aiResults.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}