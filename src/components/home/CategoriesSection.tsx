import { motion } from "framer-motion";
import { ArrowRight, Coffee, Utensils, Pizza, Cake, Salad, Leaf, Fish, Soup } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/recipe/CategoryCard";
import { categories } from "@/data/mockData";

const categoryIcons = [Coffee, Utensils, Pizza, Cake, Salad, Leaf, Fish, Soup];

export function CategoriesSection() {
  return (
    <section className="py-20 bg-gradient-warm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Browse by Category
            </h2>
            <p className="text-muted-foreground">Explore curated recipe collections</p>
          </div>
          <Link to="/categories">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, i) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <CategoryCard
                name={category.name}
                icon={categoryIcons[i]}
                count={category.count}
                color={category.color}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
