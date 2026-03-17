import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  count: number;
  color: string;
  onClick?: () => void;
}

export const CategoryCard = ({ name, icon: Icon, count, color, onClick }: CategoryCardProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group flex flex-col items-center p-6 bg-card rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 w-full"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-6"
        style={{ backgroundColor: color + "20" }}
      >
        <Icon className="w-8 h-8" style={{ color }} />
      </div>
      <h3 className="font-semibold text-card-foreground mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground">{count} recipes</p>
    </motion.button>
  );
};
