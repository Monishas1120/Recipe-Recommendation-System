import { useEffect, useState } from "react";

export function AINotification() {
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchAI = async () => {
      try {
        const res = await fetch("http://localhost:8000/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: "suggest something tasty" }),
        });

        const data = await res.json();

        if (data.recommendations?.length > 0) {
          setMessage(`🍽️ Try ${data.recommendations[0]} today!`);
          setShow(true);

          // Auto hide after 5 sec
          setTimeout(() => setShow(false), 5000);
        }
      } catch (err) {
        console.error("AI error", err);
      }
    };

    fetchAI();
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-gradient-hero text-white px-6 py-4 rounded-xl shadow-strong z-50 animate-slide-in">
      <p className="font-medium">{message}</p>
      <button
        onClick={() => setShow(false)}
        className="text-sm underline mt-1"
      >
        Dismiss
      </button>
    </div>
  );
}