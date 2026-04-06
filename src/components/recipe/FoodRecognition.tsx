import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Loader2, Sparkles, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFoodRecognition } from "@/hooks/useFoodRecognition";
import { RecipeCard } from "./RecipeCard";

export function FoodRecognition() {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { loading, error, result, recognizeFood, clearResult } =
    useFoodRecognition();

  const handleFileSelect = useCallback(
    async (file: File) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        setPreviewUrl(base64);
        await recognizeFood(base64);
      };
      reader.readAsDataURL(file);
    },
    [recognizeFood]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const reset = useCallback(() => {
    setPreviewUrl(null);
    clearResult();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [clearResult]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(reset, 300);
  }, [reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-hero hover:opacity-90 gap-2">
          <Camera className="w-4 h-4" />
          Scan Food
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Food Recognition
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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>

              <h3 className="font-display text-lg font-semibold mb-2">
                Upload a food image
              </h3>

              <p className="text-muted-foreground text-sm mb-4">
                Drag and drop or click to select
              </p>

              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, WEBP
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Uploaded food"
                  className="w-full h-64 object-cover rounded-2xl"
                />

                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={reset}
                >
                  <X className="w-4 h-4" />
                </Button>

                {loading && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Analyzing your food...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="bg-destructive/10 text-destructive rounded-xl p-4 text-sm">
                  {error}
                </div>
              )}

              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Analysis */}
                    <div className="bg-primary/5 rounded-2xl p-6">
                      <div className="flex gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                          <ChefHat className="w-5 h-5 text-white" />
                        </div>

                        <div>
                          <h4 className="font-semibold">
                            {result.analysis.dishName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {result.analysis.cuisine} •{" "}
                            {result.analysis.category}
                          </p>
                        </div>
                      </div>

                      {/* Ingredients */}
                      {result.analysis.ingredients.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">
                            Detected Ingredients:
                          </h5>

                          <div className="flex flex-wrap gap-2">
                            {result.analysis.ingredients.map((ing, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-background rounded-full text-xs"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Recipes */}
                    {result.recipes.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-4">
                          Similar Recipes
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {result.recipes
                            .slice(0, 4)
                            .map((recipe: any, index: number) => {
                              // ✅ FIX: ensure uri exists
                              const fixedRecipe = {
                                ...recipe,
                                uri:
                                  recipe.uri ||
                                  recipe.id ||
                                  `temp-${index}`,
                              };

                              return (
                                <RecipeCard
                                  key={fixedRecipe.uri}
                                  recipe={fixedRecipe}
                                  compact
                                />
                              );
                            })}
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