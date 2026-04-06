import { Toaster } from "@/components/ui/toaster";
import RecipeDetails from "./pages/RecipeDetails";
import { AINotification } from "@/components/AINotification";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Categories from "./pages/Categories";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

import { AISuggestionPopup } from "@/components/gamification/AISuggestionPopup";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />

        <BrowserRouter>
          <Routes>

            {/* 🏠 Home */}
            <Route path="/" element={<Index />} />

            {/* 📂 Categories */}
            <Route path="/categories" element={<Categories />} />

            {/* 🍽️ Recipe Details (✅ FIXED ROUTE) */}
            <Route path="/recipe-details" element={<RecipeDetails />} />

            {/* ⭐ Other Pages */}
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />

            {/* ❌ 404 Page */}
            <Route path="*" element={<NotFound />} />

          </Routes>

          {/* 🤖 Global Components */}
          <AISuggestionPopup />
          <AINotification />

        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;