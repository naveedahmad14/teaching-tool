import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import GameButton from "@/components/ui/GameButton";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: formData.username,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <div className="game-card p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-3 text-[#FFD700]">
                Sign in
              </h1>
              <p className="text-sm text-[#C0C0C0] leading-relaxed">
                Sign in to continue your progress
              </p>
            </div>

            {error && (
              <div 
                className="game-card bg-[#1A1A2E] border-[#F44336] p-4 mb-6"
                role="alert"
                aria-live="assertive"
              >
                <p className="text-sm text-[#F44336]">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" aria-label="Sign in form">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-[#E8E8E8] mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  className="game-input w-full"
                  placeholder="Enter your username"
                  aria-required="true"
                  aria-describedby={error ? "error-message" : undefined}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#E8E8E8] mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="game-input w-full"
                  placeholder="Enter your password"
                  aria-required="true"
                />
              </div>

              <GameButton
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full"
                aria-label={loading ? "Signing in..." : "Sign in"}
              >
                {loading ? "Signing in..." : "Enter Quest"}
              </GameButton>
            </form>

            <p className="mt-6 text-center text-sm text-[#C0C0C0]">
              New to AlgoQuest?{" "}
              <Link
                href="/signup"
                className="text-[#FFD700] hover:text-[#FFE55C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                aria-label="Sign up for a new account"
              >
                Begin Your Journey →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}


