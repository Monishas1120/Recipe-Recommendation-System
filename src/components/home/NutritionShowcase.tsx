import { motion } from "framer-motion";
import { Flame, Beef, Wheat, Droplets, Leaf, TrendingUp } from "lucide-react";

const nutrients = [
  { icon: Flame, label: "Calories", value: "2,150", unit: "kcal", color: "text-coral bg-coral/10" },
  { icon: Beef, label: "Protein", value: "85", unit: "g", color: "text-primary bg-primary/10" },
  { icon: Wheat, label: "Carbs", value: "245", unit: "g", color: "text-honey bg-honey/10" },
  { icon: Droplets, label: "Fat", value: "72", unit: "g", color: "text-sage bg-sage/10" },
  { icon: Leaf, label: "Fiber", value: "32", unit: "g", color: "text-accent bg-accent/10" },
  { icon: TrendingUp, label: "Sugar", value: "48", unit: "g", color: "text-destructive bg-destructive/10" },
];

export function NutritionShowcase() {
  return (
    <section className="py-20 bg-gradient-warm">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Flame className="w-4 h-4" />
              Edamam Nutrition API
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              Real-Time Nutrition Tracking
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Every recipe comes with detailed macro and micronutrient breakdowns powered by the Edamam database — the world's largest food nutrition API.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {nutrients.map((n, i) => (
                <motion.div
                  key={n.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card rounded-xl p-4 text-center shadow-soft border border-border/50"
                >
                  <div className={`w-10 h-10 rounded-lg ${n.color} flex items-center justify-center mx-auto mb-2`}>
                    <n.icon className="w-5 h-5" />
                  </div>
                  <div className="text-xl font-bold text-foreground">{n.value}</div>
                  <div className="text-xs text-muted-foreground">{n.unit} • {n.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-card rounded-3xl p-8 shadow-strong border border-border/50">
              <h3 className="font-display text-xl font-bold text-foreground mb-6">Today's Macro Split</h3>
              
              {/* Visual macro bars */}
              {[
                { label: "Protein", pct: 35, color: "bg-primary" },
                { label: "Carbs", pct: 45, color: "bg-honey" },
                { label: "Fat", pct: 20, color: "bg-sage" },
              ].map((macro) => (
                <div key={macro.label} className="mb-5">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-foreground">{macro.label}</span>
                    <span className="text-muted-foreground">{macro.pct}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${macro.color} rounded-full`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${macro.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-8 p-4 rounded-xl bg-sage/10 border border-sage/20">
                <p className="text-sm text-foreground font-medium">🎯 AI Recommendation</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You're 15g short on protein today. Try our Grilled Chicken Bowl for dinner!
                </p>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
