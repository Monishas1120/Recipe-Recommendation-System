import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Suggestion {
  message: string;
  subtext: string;
  emoji: string;
  mood: string;
}

export function AINotification() {
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [show, setShow] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const alreadyShown = localStorage.getItem("ai-notification-shown");

    if (alreadyShown) return;

    const fetchAI = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("ai-suggest", {
          body: {
            userId: user?.id || null,
            context: { timeOfDay: new Date().getHours() },
          },
        });

        if (error) throw error;

        if (data?.message) {
          setSuggestion(data);
          setShow(true);

          // auto hide after 6s
          setTimeout(() => setShow(false), 6000);

          // prevent spam
          localStorage.setItem("ai-notification-shown", "true");
        }
      } catch (err) {
        console.warn("AI suggestion unavailable:", err);
      }
    };

    const timer = setTimeout(fetchAI, 2000);
    return () => clearTimeout(timer);
  }, [user]);

  if (!show || !suggestion) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 max-w-xs animate-in fade-in slide-in-from-bottom-5">
      <p className="text-lg font-semibold">
        {suggestion.emoji} {suggestion.message}
      </p>
      <p className="text-sm opacity-80 mt-1">
        {suggestion.subtext}
      </p>

      <button
        onClick={() => setShow(false)}
        aria-label="Dismiss notification"
        className="text-xs underline mt-2 opacity-70 block hover:opacity-100"
      >
        Dismiss
      </button>
    </div>
  );
}