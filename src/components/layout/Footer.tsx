import { Link } from "react-router-dom";
import { ChefHat, Instagram, Twitter, Facebook, Youtube, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  explore: [
    { name: "All Recipes", path: "/categories" },
    { name: "Popular", path: "/categories" },
    { name: "Quick Meals", path: "/categories" },
    { name: "Healthy", path: "/categories" },
  ],
  categories: [
    { name: "Breakfast", path: "/categories" },
    { name: "Lunch", path: "/categories" },
    { name: "Dinner", path: "/categories" },
    { name: "Desserts", path: "/categories" },
  ],
  company: [
    { name: "About Us", path: "/" },
    { name: "Contact", path: "/" },
    { name: "Privacy Policy", path: "/" },
    { name: "Terms of Service", path: "/" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-espresso text-cream mt-auto">
      <div className="container mx-auto px-4 py-16">
        {/* Newsletter Section */}
        <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 mb-16 shadow-strong">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Get Fresh Recipes Weekly
            </h3>
            <p className="text-primary-foreground/90 mb-6">
              Subscribe to our newsletter and discover new delicious recipes every week.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold">Refi</span>
            </Link>
            <p className="text-cream/70 mb-6 max-w-xs">
              Discover, cook, and share amazing recipes powered by AI. Your personal culinary companion.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="icon"
                  className="text-cream/60 hover:text-coral hover:bg-cream/10 rounded-full"
                >
                  <Icon className="w-5 h-5" />
                </Button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-cream mb-4">Explore</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-cream/60 hover:text-coral transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-cream mb-4">Categories</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-cream/60 hover:text-coral transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-cream mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-cream/60 hover:text-coral transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/50 text-sm">
            © 2024 Refi. All rights reserved.
          </p>
          <p className="text-cream/50 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-coral fill-coral" /> for food lovers
          </p>
        </div>
      </div>
    </footer>
  );
};
