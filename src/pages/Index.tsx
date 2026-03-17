import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { TrendingRecipes } from "@/components/home/TrendingRecipes";
import { DeepLearningSection } from "@/components/home/DeepLearningSection";
import { NutritionShowcase } from "@/components/home/NutritionShowcase";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <TrendingRecipes />
      <DeepLearningSection />
      <NutritionShowcase />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;

