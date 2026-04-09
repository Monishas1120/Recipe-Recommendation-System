// src/data/mockData.ts
import { Coffee, Utensils, Pizza, Cake, Salad, Leaf, Fish, Soup } from "lucide-react";

// ✅ Recipe type
export interface Recipe {
  id: string;
  title: string;
  image?: string;
  time: string;
  servings: number;
  calories: number;
  category: string;
  difficulty: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cuisine?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  isFavorite: boolean; // added for Favorites page
}

// ✅ Sample user recipes
export const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Creamy Tuscan Garlic Chicken",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",
    time: "35 min",
    servings: 4,
    calories: 420,
    category: "Dinner",
    difficulty: "Medium",
    description: "Creamy garlicky chicken with sun-dried tomatoes.",
    ingredients: ["Chicken", "Garlic", "Sun-dried tomatoes", "Cream"],
    instructions: ["Cook chicken", "Prepare sauce", "Combine & serve"],
    cuisine: "Italian",
    tags: ["chicken", "dinner"],
    created_at: "",
    updated_at: "",
    isFavorite: true,
  },
  {
    id: "2",
    title: "Fresh Avocado Toast with Poached Eggs",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",
    time: "15 min",
    servings: 2,
    calories: 280,
    category: "Breakfast",
    difficulty: "Easy",
    description: "Healthy avocado toast with eggs",
    ingredients: ["Bread", "Avocado", "Eggs", "Lemon", "Salt", "Pepper"],
    instructions: ["Toast bread", "Mash avocado", "Poach eggs", "Assemble"],
    cuisine: "American",
    tags: ["breakfast", "quick"],
    created_at: "",
    updated_at: "",
    isFavorite: false,
  },
  {
    id: "3",
    title: "Spaghetti Bolognese",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",
    time: "40 min",
    servings: 4,
    calories: 500,
    category: "Dinner",
    difficulty: "Medium",
    description: "Classic Italian pasta with rich meat sauce.",
    ingredients: ["Spaghetti", "Beef", "Tomato", "Onion", "Garlic"],
    instructions: ["Cook pasta", "Prepare sauce", "Combine & serve"],
    cuisine: "Italian",
    tags: ["pasta", "dinner"],
    created_at: "",
    updated_at: "",
    isFavorite: true,
  },
  {
    id: "4",
    title: "Chocolate Lava Cake",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",
    time: "25 min",
    servings: 2,
    calories: 450,
    category: "Dessert",
    difficulty: "Medium",
    description: "Molten chocolate cake with a gooey center.",
    ingredients: ["Chocolate", "Butter", "Eggs", "Sugar", "Flour"],
    instructions: ["Preheat oven", "Mix ingredients", "Bake", "Serve warm"],
    cuisine: "French",
    tags: ["dessert", "chocolate"],
    created_at: "",
    updated_at: "",
    isFavorite: true,
  },
  {
    id: "5",
    title: "Greek Salad",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",
    time: "15 min",
    servings: 2,
    calories: 200,
    category: "Vegetarian",
    difficulty: "Easy",
    description: "Fresh salad with feta, olives, and vegetables.",
    ingredients: ["Tomato", "Cucumber", "Feta", "Olives", "Olive oil"],
    instructions: ["Chop veggies", "Mix ingredients", "Serve chilled"],
    cuisine: "Greek",
    tags: ["salad", "vegetarian"],
    created_at: "",
    updated_at: "",
    isFavorite: false,
  },
];

// ✅ Categories with icons
export const categories = [
  { name: "Breakfast", count: 4, color: "#FF9F43", icon: Coffee },
  { name: "Lunch", count: 8, color: "#54A0FF", icon: Utensils },
  { name: "Dinner", count: 9, color: "#FF6B6B", icon: Pizza },
  { name: "Dessert", count: 3, color: "#FF6B9E", icon: Cake },
  { name: "Vegetarian", count: 6, color: "#2ECC71", icon: Salad },
  { name: "Vegan", count: 2, color: "#1ABC9C", icon: Leaf },
  { name: "Seafood", count: 3, color: "#9B59B6", icon: Fish },
  { name: "Quick Meals", count: 5, color: "#F39C12", icon: Soup },
];

// ✅ Diet preferences
export const dietPreferences = [
  { id: "vegetarian", name: "Vegetarian", description: "No meat or fish" },
  { id: "vegan", name: "Vegan", description: "No animal products" },
  { id: "keto", name: "Keto", description: "Low carb, high fat" },
  { id: "paleo", name: "Paleo", description: "Whole foods only" },
  { id: "glutenFree", name: "Gluten-Free", description: "No gluten products" },
  { id: "dairyFree", name: "Dairy-Free", description: "No dairy products" },
  { id: "lowSodium", name: "Low Sodium", description: "Reduced salt" },
  { id: "lowSugar", name: "Low Sugar", description: "Reduced sugar" },
];

// ✅ Health goals
export const healthGoals = [
  { id: "weightLoss", name: "Weight Loss", icon: "🎯" },
  { id: "muscleGain", name: "Muscle Gain", icon: "💪" },
  { id: "heartHealth", name: "Heart Health", icon: "❤️" },
  { id: "energyBoost", name: "Energy Boost", icon: "⚡" },
  { id: "digestiveHealth", name: "Digestive Health", icon: "🌱" },
  { id: "immuneSupport", name: "Immune Support", icon: "🛡️" },
];