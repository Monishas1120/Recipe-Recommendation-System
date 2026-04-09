import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Loader2, Sparkles, ChefHat, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useFoodRecognition } from "@/hooks/useFoodRecognition";
import { RecipeCard } from "./RecipeCard";

export function FoodRecognition() {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loading, error, result, recognizeFoodFromFile, clearResult } = useFoodRecognition();

  const handleFileSelect = useCallback(async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    await recognizeFoodFromFile(file);
  }, [recognizeFoodFromFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const reset = useCallback(() => {
    setPreviewUrl(null);
    clearResult();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [clearResult]);

  const analysis = {
    dishName: result?.analysis?.dishName ?? "Unknown Dish",
    cuisine: result?.analysis?.cuisine ?? "",
    category: result?.analysis?.category ?? "",
    ingredients: result?.analysis?.ingredients ?? [],
  };
  const recipe = {
    steps: result?.recipe?.steps ?? [],
    prepTime: result?.recipe?.prepTime ?? "",
    cookTime: result?.recipe?.cookTime ?? "",
    servings: result?.recipe?.servings ?? "",
  };
  const recipes = result?.recipes ?? [];

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setTimeout(reset, 300); }}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-hero hover:opacity-90 gap-2">
          <Camera className="w-4 h-4" /> Scan Food
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> AI Food Recognition
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {!previewUrl ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-muted-foreground/30 rounded-2xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Upload a food photo</h3>
              <p className="text-muted-foreground text-sm mb-2">Drag and drop or click to select</p>
              <p className="text-xs text-muted-foreground">Any cuisine — Indian, Italian, Mexican, Continental, anything</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img src={previewUrl} alt="Uploaded food" className="w-full h-64 object-cover rounded-2xl" />
                <Button variant="secondary" size="icon" className="absolute top-2 right-2" onClick={reset}>
                  <X className="w-4 h-4" />
                </Button>
                {loading && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                      <p className="text-sm font-medium">Identifying your food...</p>
                      <p className="text-xs text-muted-foreground">AI is analyzing the image</p>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive rounded-xl p-4 text-sm">
                  <p className="font-medium mb-1">Recognition failed</p>
                  <p>{error}</p>
                </div>
              )}

              <AnimatePresence>
                {result && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-primary/5 rounded-2xl p-6 space-y-4">
                      <div className="flex gap-3 items-start">
                        <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center shrink-0">
                          <ChefHat className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{analysis.dishName}</h4>
                          <p className="text-sm text-muted-foreground">{analysis.cuisine} · {analysis.category}</p>
                        </div>
                      </div>
                      {(recipe.prepTime || recipe.cookTime || recipe.servings) && (
                        <div className="flex flex-wrap gap-4 text-sm">
                          {recipe.prepTime && <div className="flex items-center gap-1.5 text-muted-foreground"><Clock className="w-4 h-4" /><span>Prep: {recipe.prepTime}</span></div>}
                          {recipe.cookTime && <div className="flex items-center gap-1.5 text-muted-foreground"><Clock className="w-4 h-4" /><span>Cook: {recipe.cookTime}</span></div>}
                          {recipe.servings && <div className="flex items-center gap-1.5 text-muted-foreground"><Users className="w-4 h-4" /><span>{recipe.servings}</span></div>}
                        </div>
                      )}
                      {analysis.ingredients.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold mb-2">Ingredients</h5>
                          <div className="flex flex-wrap gap-2">
                            {analysis.ingredients.map((ing, i) => (
                              <span key={i} className="px-3 py-1 bg-background rounded-full text-xs border">{ing}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {recipe.steps.length > 0 && (
                      <div className="rounded-2xl border p-6 space-y-3">
                        <h4 className="font-semibold text-base">How to make it</h4>
                        <ol className="space-y-3">
                          {recipe.steps.map((step, i) => (
                            <li key={i} className="flex gap-3 text-sm">
                              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-medium text-xs mt-0.5">{i + 1}</span>
                              <span className="text-muted-foreground leading-relaxed">{step.replace(/^Step \d+:\s*/i, "")}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {recipes.length > 0 && (
                      <div>
                        <h4 className="text-base font-semibold mb-4">Similar Recipes Online</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {recipes.slice(0, 4).map((recipe: any, index: number) => (
                            <RecipeCard key={recipe.uri || `r-${index}`} recipe={{ ...recipe, uri: recipe.uri || `temp-${index}` }} compact />
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}