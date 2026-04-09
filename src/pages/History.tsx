import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Search, Calendar, Trash2 } from "lucide-react";
import { Layout } from "../components/layout/Layout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockRecipes } from "@/data/mockData";
import { Link } from "react-router-dom";

// Mock history data with dates
const historyData = [
  { date: "Today", recipes: mockRecipes.slice(0, 3) },
  { date: "Yesterday", recipes: mockRecipes.slice(3, 5) },
  { date: "Last Week", recipes: mockRecipes.slice(5, 8) },
];

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const hasHistory = historyData.some((group) => group.recipes.length > 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Cooking History
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Recipes you've recently viewed or cooked
          </p>
        </motion.div>

        {hasHistory ? (
          <>
            {/* Search & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between"
            >
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl"
                />
              </div>
              <Button variant="outline" className="text-destructive hover:bg-destructive/10 rounded-xl">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </Button>
            </motion.div>

            {/* History Groups */}
            {historyData.map((group, groupIndex) => (
              <motion.div
                key={group.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (groupIndex + 1) }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    {group.date}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    ({group.recipes.length} recipes)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {group.recipes
                    .filter((recipe) =>
                      recipe.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((recipe, i) => (
                      <motion.div
                        key={recipe.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                      
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            ))}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">📚</div>
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
              No history yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start exploring recipes and your cooking history will appear here
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

export default History;
