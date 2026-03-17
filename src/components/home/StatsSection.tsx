import { motion } from "framer-motion";
import { Brain, Utensils, Users, Globe } from "lucide-react";

const stats = [
  { value: "94.2%", label: "AI Accuracy", icon: Brain },
  { value: "10K+", label: "Recipes", icon: Utensils },
  { value: "50K+", label: "Active Users", icon: Users },
  { value: "100+", label: "Countries", icon: Globe },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-8 h-8 text-primary-foreground/80 mx-auto mb-3" />
              <div className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-primary-foreground/70 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
