import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          setProfile(data);
          setFullName(data?.full_name || "");
        });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
    });
    if (error) {
      alert("Failed to update name: " + error.message);
      setSaving(false);
      return;
    }
    setProfile((p: any) => ({ ...p, full_name: fullName }));
    setEditMode(false);
    setSaving(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="font-display text-3xl font-bold mb-6">Profile</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="block font-semibold mb-1">Email</label>
              <div className="bg-gray-100 rounded px-3 py-2">{user.email}</div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Full Name</label>
              {editMode ? (
                <Input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full"
                />
              ) : (
                <div className="bg-gray-100 rounded px-3 py-2">{profile?.full_name || "-"}</div>
              )}
            </div>
            <div className="flex gap-2 mb-4">
              <Button variant="outline" onClick={() => window.location.href = '/settings'}>
                Go to Settings
              </Button>
              <Button variant="destructive" onClick={async () => { await supabase.auth.signOut(); window.location.href = '/auth'; }}>
                Logout
              </Button>
            </div>
            <div className="flex gap-2">
              {editMode ? (
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              ) : (
                <Button onClick={() => setEditMode(true)}>Edit</Button>
              )}
              {editMode && (
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
