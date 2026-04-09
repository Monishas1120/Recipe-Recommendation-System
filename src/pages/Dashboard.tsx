import { Layout } from "@/components/layout/Layout";
import { TokenDashboard } from "@/components/gamification/TokenDashboard";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Your Cooking Journey
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your progress, earn tokens, and unlock badges
            </p>
          </div>
          <TokenDashboard />
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;