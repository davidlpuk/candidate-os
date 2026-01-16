import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { cn } from "../lib/utils";

export default function Auth() {
  const { user, loading, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/pipeline`,
      },
    });

    if (error) {
      setError(error.message);
    }
  }

  if (user) {
    window.location.href = "/";
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className={cn("card", "max-w-md mx-auto")}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">CandidateOS</h1>
            <p className="text-gray-400">
              {isLogin ? "Sign in to your account" : "Create an account"}
            </p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 mb-4 text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="input-label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
            )}

            <div>
              <label className="input-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="input-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className={cn("btn btn-primary", "w-full")}
              disabled={formLoading}
            >
              {formLoading
                ? "Loading..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <button
              type="button"
              className="text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className={cn(
                "btn",
                "w-full",
                "bg-white text-gray-900 hover:bg-gray-100",
              )}
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
