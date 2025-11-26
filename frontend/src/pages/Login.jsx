// src/pages/Login.jsx
import React, { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  // GOOGLE SIGN-IN FLOW (popup)
  const handleGoogleLogin = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (!user || !user.uid) throw new Error("Google sign-in failed (no user).");

      // Try to get existing profile from backend
      const getRes = await fetch(`${API_BASE_URL}/api/profile/${user.uid}`);
      if (getRes.status === 404 || getRes.status === 500) {
        // if profile not found, create one
        const profileBody = {
          firebaseUid: user.uid,
          name: user.displayName || "",
          mobile: "",
          gender: "",
          avatarUrl: user.photoURL || "",
        };

        const createRes = await fetch(`${API_BASE_URL}/api/profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileBody),
        });

        if (!createRes.ok) {
          const errText = await createRes.text();
          console.error("Profile create failed:", errText);
        }
      }

      // Redirect (or let AuthContext update UI)
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Google login error:", err);
      setError(err?.message || "Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        {error && <p className="text-sm text-red-500 mb-2 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Sign In
          </button>
        </form>

        {/* Google Button - centered, minimally styled so your style stays intact */}
        <div className="mt-4 flex items-center justify-center">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center gap-3 border rounded-lg px-4 py-2 bg-white hover:shadow transition w-64 justify-center"
            aria-label="Sign in with Google"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-6 h-6"
            />
            <span className="text-sm">Continue with Google</span>
          </button>
        </div>

        <div className="mt-4 flex justify-between text-sm">
          <Link className="text-blue-600" to="/register">
            Create account
          </Link>
          <Link className="text-blue-600" to="/forgot-password">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
