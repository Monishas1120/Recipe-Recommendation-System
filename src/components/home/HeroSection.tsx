import { motion } from "framer-motion";
import { Sparkles, Brain, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/recipe/SearchBar";
import { FoodRecognition } from "@/components/recipe/FoodRecognition";
import heroKitchen from "@/assets/hero-kitchen.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[95vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroKitchen} alt="Kitchen" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-40 right-40 w-48 h-48 bg-honey/10 rounded-full blur-3xl animate-float" />

      <div className="container mx-auto px-4 py-24 md:py-36 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 text-primary text-sm font-semibold mb-8">
                <Brain className="w-4 h-4" />
                InceptionV3 Deep Learning Powered
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-[0.95]"
            >
              Cook
              <br />
              <span className="text-gradient">Smarter</span>
              <br />
              Not Harder
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed"
            >
              AI-powered recipe discovery with real-time nutrition analysis. Snap a photo, get instant recipes with deep learning.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="max-w-xl space-y-6"
            >
              <SearchBar
                placeholder="Try 'high protein breakfast' or 'keto dinner'..."
                showResults={true}
              />

              <div className="flex flex-wrap gap-2">
                {["Quick meals", "Vegetarian", "Keto", "Under 30 min", "High protein"].map((tag) => (
                  <Link
                    key={tag}
                    to={`/categories?search=${encodeURIComponent(tag)}`}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted/60 backdrop-blur-sm hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all border border-border/50"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <FoodRecognition />
                <span className="text-sm text-muted-foreground">
                  Snap a photo → AI identifies & finds recipes
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right side: AI Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 border border-border/50 shadow-strong">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-hero flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground">Deep Learning Engine</p>
                    <p className="text-xs text-muted-foreground">InceptionV3 • Gemini • Edamam</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-sage/10">
                    <Zap className="w-5 h-5 text-sage" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Food Recognition</p>
                      <p className="text-xs text-muted-foreground">94.2% accuracy • 1.2s avg</p>
                    </div>
                    <span className="text-xs font-bold text-sage">LIVE</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-honey/10">
                    <Sparkles className="w-5 h-5 text-honey" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Nutrition Analysis</p>
                      <p className="text-xs text-muted-foreground">200+ nutrients tracked</p>
                    </div>
                    <span className="text-xs font-bold text-honey">LIVE</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10">
                    <Brain className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Smart Recommendations</p>
                      <p className="text-xs text-muted-foreground">Personalized by AI</p>
                    </div>
                    <span className="text-xs font-bold text-primary">LIVE</span>
                  </div>
                </div>

                {/* Live processing animation */}
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-hero rounded-full"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    style={{ width: "40%" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">Neural network processing active</p>
              </div>

              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-honey/15 rounded-full blur-3xl" />
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary/15 rounded-full blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
