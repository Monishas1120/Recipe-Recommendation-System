// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { supabase } from "@/lib/supabase";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";

// const Auth = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (isLogin) {
//         const { data, error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         });
//         if (error) throw error;

//         toast.success("Welcome back! 🎉");
//         navigate("/dashboard");

//       } else {
//         const { data, error } = await supabase.auth.signUp({
//           email,
//           password,
//           options: { data: { full_name: name } },
//         });
//         if (error) throw error;

//         // ✅ Manually insert profile row after signup
//         if (data.user) {
//           const { error: profileError } = await supabase
//             .from("profiles")
//             .upsert({
//               id: data.user.id,
//               full_name: name,
//               email: email,
//               diet: [],
//               goals: [],
//             });

//           if (profileError) {
//             console.error("Profile insert error:", profileError.message);
//           }
//         }

//         toast.success("Account created! 🎉");
//         navigate("/dashboard");
//       }
//     } catch (err: any) {
//       toast.error(err.message || "Authentication failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
//       >
//         <h1 className="text-3xl font-bold text-center mb-6">
//           {isLogin ? "Login" : "Sign Up"}
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {!isLogin && (
//             <Input
//               placeholder="Full Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           )}
//           <Input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <Input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <Button type="submit" className="w-full" disabled={loading}>
//             {loading ? <Loader2 className="animate-spin" /> : "Submit"}
//           </Button>
//         </form>

//         <p
//           className="text-center mt-4 cursor-pointer text-blue-600 font-semibold"
//           onClick={() => setIsLogin(!isLogin)}
//         >
//           {isLogin ? "Create account" : "Already have an account?"}
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default Auth;

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      // ================= LOGIN =================
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error("LOGIN ERROR:", error.message);
          toast.error(error.message);
          return;
        }

        toast.success("Welcome back! 🎉");
        navigate("/dashboard");
      }

      // ================= SIGNUP =================
      else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });

        if (error) {
          console.error("SIGNUP ERROR:", error.message);
          toast.error(error.message);
          return;
        }

        // ⚠️ If email confirmation is ON
        if (!data.session) {
          toast.success("Check your email to confirm your account 📩");
          return;
        }

        // ✅ Insert profile after successful signup
        if (data.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert({
              id: data.user.id,
              full_name: name,
              email: email,
              diet: [],
              goals: [],
            });

          if (profileError) {
            console.error("PROFILE ERROR:", profileError.message);
          }
        }

        toast.success("Account created! 🎉");
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("AUTH ERROR:", err.message);
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <Input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>

        <p
          className="text-center mt-4 cursor-pointer text-blue-600 font-semibold"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create account" : "Already have an account?"}
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;