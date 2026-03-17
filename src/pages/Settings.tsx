import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  Heart,
  Bell,
  Shield,
  Palette,
  HelpCircle,
  LogOut,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dietPreferences, healthGoals } from "@/data/mockData";
import { Link } from "react-router-dom";

const Settings = () => {
  const [selectedDiets, setSelectedDiets] = useState<string[]>(["vegetarian"]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["weightLoss"]);
  const [notifications, setNotifications] = useState({
    newRecipes: true,
    weeklyDigest: true,
    cookingReminders: false,
    achievements: true,
  });

  const toggleDiet = (id: string) => {
    setSelectedDiets((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <SettingsIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your preferences and account
              </p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="diet" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 h-14 rounded-xl bg-muted p-1">
            <TabsTrigger value="diet" className="rounded-lg data-[state=active]:bg-background">
              <Heart className="w-4 h-4 mr-2" />
              Diet
            </TabsTrigger>
            <TabsTrigger value="health" className="rounded-lg data-[state=active]:bg-background">
              <Shield className="w-4 h-4 mr-2" />
              Health
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-background">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="admin" className="rounded-lg data-[state=active]:bg-background">
              <User className="w-4 h-4 mr-2" />
              Admin
            </TabsTrigger>
          </TabsList>

          {/* Diet Preferences */}
          <TabsContent value="diet">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="font-display text-2xl">
                    Diet Preferences
                  </CardTitle>
                  <CardDescription>
                    Select your dietary preferences to get personalized recipe recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dietPreferences.map((diet) => (
                      <button
                        key={diet.id}
                        onClick={() => toggleDiet(diet.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          selectedDiets.includes(diet.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-semibold text-foreground">
                            {diet.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {diet.description}
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            selectedDiets.includes(diet.id)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {selectedDiets.includes(diet.id) && (
                            <Check className="w-4 h-4" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <Button className="mt-6 bg-gradient-hero hover:opacity-90">
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Health Goals */}
          <TabsContent value="health">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="font-display text-2xl">
                    Health Goals
                  </CardTitle>
                  <CardDescription>
                    Set your health goals to receive recipes that support your journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {healthGoals.map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                          selectedGoals.includes(goal.id)
                            ? "border-sage bg-sage/5"
                            : "border-border hover:border-sage/50"
                        }`}
                      >
                        <span className="text-3xl">{goal.icon}</span>
                        <span className="font-semibold text-foreground">
                          {goal.name}
                        </span>
                        {selectedGoals.includes(goal.id) && (
                          <Check className="w-5 h-5 text-sage ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-muted rounded-xl">
                    <h3 className="font-semibold text-foreground mb-4">
                      Daily Nutrition Targets
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Calories", value: "2000", unit: "kcal" },
                        { label: "Protein", value: "50", unit: "g" },
                        { label: "Carbs", value: "250", unit: "g" },
                        { label: "Fat", value: "65", unit: "g" },
                      ].map((target) => (
                        <div
                          key={target.label}
                          className="bg-background p-4 rounded-xl text-center"
                        >
                          <div className="text-2xl font-bold text-primary">
                            {target.value}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {target.unit}
                          </div>
                          <div className="text-sm font-medium text-foreground mt-1">
                            {target.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="mt-6 bg-gradient-hero hover:opacity-90">
                    Update Goals
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="font-display text-2xl">
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    {
                      key: "newRecipes",
                      title: "New Recipe Recommendations",
                      description: "Get notified when we find recipes you might like",
                    },
                    {
                      key: "weeklyDigest",
                      title: "Weekly Digest",
                      description: "Receive a weekly summary of trending recipes",
                    },
                    {
                      key: "cookingReminders",
                      title: "Cooking Reminders",
                      description: "Remind you to cook saved recipes",
                    },
                    {
                      key: "achievements",
                      title: "Achievements",
                      description: "Celebrate your cooking milestones",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 bg-muted rounded-xl"
                    >
                      <div>
                        <div className="font-semibold text-foreground">
                          {item.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            [item.key]: checked,
                          }))
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Admin Panel */}
          <TabsContent value="admin">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="font-display text-2xl">
                    Admin Panel
                  </CardTitle>
                  <CardDescription>
                    Manage your account and app settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { icon: User, label: "Profile Settings", action: "Edit" },
                    { icon: Shield, label: "Privacy & Security", action: "Manage" },
                    { icon: Palette, label: "Appearance", action: "Customize" },
                    { icon: HelpCircle, label: "Help & Support", action: "View" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-sm">{item.action}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-soft border-destructive/20">
                <CardHeader>
                  <CardTitle className="font-display text-xl text-destructive">
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive/10">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive/10">
                    <X className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
