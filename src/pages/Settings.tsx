import { useState, useEffect } from "react";
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
import { Layout } from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dietPreferences, healthGoals } from "@/data/mockData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [notifications, setNotifications] = useState({
    newRecipes: true,
    weeklyDigest: true,
    cookingReminders: false,
    achievements: true,
  });
  const [saving, setSaving] = useState(false);

  // ✅ LOAD USER DATA FROM SUPABASE
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("diet, goals")
        .eq("id", user.id)
        .single();

      if (data) {
        setSelectedDiets(data.diet || []);
        setSelectedGoals(data.goals || []);
      }
    };

    fetchProfile();
  }, [user]);

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

  // ✅ SAVE TO SUPABASE
  const savePreferences = async () => {
    if (!user) return;
    setSaving(true);
    const { data, error } = await supabase.from("profiles").upsert({
      id: user.id,
      diet: selectedDiets,
      goals: selectedGoals,
    }, { onConflict: 'id' });

    console.log('Upsert response:', { data, error });

    if (error) {
      toast.error("Failed to save: " + error.message);
    } else if (!data) {
      toast.error("No data returned. Preferences may not have been saved.");
    } else {
      toast.success("Preferences saved ✅");
    }
    setSaving(false);
  };

  // ✅ SIGN OUT FIX
  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
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
            <TabsTrigger value="diet">Diet</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="notifications">Alerts</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          {/* DIET */}
          <TabsContent value="diet">
            <Card>
              <CardHeader>
                <CardTitle>Diet Preferences</CardTitle>
                <CardDescription>Select your diet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {dietPreferences.map((diet) => (
                    <button
                      key={diet.id}
                      onClick={() => toggleDiet(diet.id)}
                      className={`p-4 rounded-xl border-2 ${
                        selectedDiets.includes(diet.id)
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      {diet.name}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={savePreferences}
                  className="mt-6 bg-gradient-hero"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Preferences"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HEALTH */}
          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle>Health Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {healthGoals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`p-4 rounded-xl border-2 ${
                        selectedGoals.includes(goal.id)
                          ? "border-sage bg-sage/5"
                          : "border-border"
                      }`}
                    >
                      {goal.name}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={savePreferences}
                  className="mt-6 bg-gradient-hero"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Goals"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NOTIFICATIONS */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.keys(notifications).map((key) => (
                  <div
                    key={key}
                    className="flex justify-between p-4 bg-muted rounded-xl"
                  >
                    <span>{key}</span>
                    <Switch
                      checked={
                        notifications[key as keyof typeof notifications]
                      }
                      onCheckedChange={(val) =>
                        setNotifications((prev) => ({
                          ...prev,
                          [key]: val,
                        }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ADMIN */}
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleSignOut}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
