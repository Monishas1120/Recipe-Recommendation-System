import { motion } from "framer-motion";
import { Brain, Camera, Sparkles, ChefHat, ArrowRight, Zap, Eye, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const pipeline = [
  {
    icon: Camera,
    title: "Image Capture",
    desc: "Upload or snap a food photo",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Eye,
    title: "Feature Extraction",
    desc: "InceptionV3 CNN analyzes pixels",
    color: "bg-sage/10 text-sage",
  },
  {
    icon: Cpu,
    title: "Classification",
    desc: "1000+ food categories identified",
    color: "bg-honey/10 text-honey",
  },
  {
    icon: Sparkles,
    title: "AI Matching",
    desc: "Gemini finds perfect recipes",
    color: "bg-coral/10 text-coral",
  },
];

export function DeepLearningSection() {
  return (
    <section className="py-24 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/10 text-sage text-sm font-semibold mb-6"
          >
            <Brain className="w-4 h-4" />
            InceptionV3 Deep Learning Module
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            How Our AI Works
          </motion.h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From photo to plate in seconds — powered by deep convolutional neural networks
          </p>
        </div>

        {/* Pipeline */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {pipeline.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              {i < 3 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%]">
                  <ArrowRight className="w-6 h-6 text-border" />
                </div>
              )}
              <div className="bg-card rounded-2xl p-8 text-center shadow-soft hover:shadow-medium transition-shadow border border-border/50">
                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-5`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Architecture diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-card rounded-3xl p-8 md:p-12 shadow-medium border border-border/50 max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">Model Architecture</h3>
              <p className="text-sm text-muted-foreground">InceptionV3 + Transfer Learning + Edamam Nutrition API</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Vision Layer
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>• 48 inception modules</li>
                <li>• 299×299 input resolution</li>
                <li>• Batch normalization</li>
                <li>• Global avg pooling</li>
              </ul>
            </div>
            <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sage" />
                Classification Head
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>• 1000+ food categories</li>
                <li>• Softmax activation</li>
                <li>• Top-5 accuracy: 96.8%</li>
                <li>• Fine-tuned on Food-101</li>
              </ul>
            </div>
            <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-honey" />
                Nutrition Engine
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>• Edamam API integration</li>
                <li>• 200+ nutrient tracking</li>
                <li>• Diet label classification</li>
                <li>• Real-time calorie estimation</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/categories">
              <Button className="bg-gradient-hero hover:opacity-90 gap-2">
                <Camera className="w-4 h-4" />
                Try AI Food Scanner
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
