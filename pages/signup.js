import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Layout from "../components/Layout";
import GameButton from "../components/GameButton";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    setLoading(true);

    try {
      // Register user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto sign in after registration
      const result = await signIn("credentials", {
        redirect: false,
        username: formData.username,
        password: formData.password,
      });

      if (result?.error) {
        setError("Registration successful but login failed. Please try logging in.");
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
                Create account
              </h1>
              <p className="text-sm text-[#C0C0C0] leading-relaxed">
                Create your account to save progress and track your learning
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

            <form onSubmit={handleSubmit} className="space-y-6" aria-label="Sign up form">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-[#E8E8E8] mb-2"
                >
                  Username (min 3 characters)
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  minLength={3}
                  className="game-input w-full"
                  placeholder="Choose your adventurer name"
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#E8E8E8] mb-2"
                >
                  Password (min 6 characters)
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  minLength={6}
                  className="game-input w-full"
                  placeholder="Create a strong password"
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[#E8E8E8] mb-2"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                  minLength={6}
                  className="game-input w-full"
                  placeholder="Confirm your password"
                  aria-required="true"
                />
              </div>

              <GameButton
                type="submit"
                disabled={loading}
                variant="gold"
                className="w-full"
                aria-label={loading ? "Creating account..." : "Create account"}
              >
                {loading ? "Creating..." : "Start Quest"}
              </GameButton>
            </form>

            <p className="mt-6 text-center text-sm text-[#C0C0C0]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#FFD700] hover:text-[#FFE55C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                aria-label="Sign in to existing account"
              >
                Sign In →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}


