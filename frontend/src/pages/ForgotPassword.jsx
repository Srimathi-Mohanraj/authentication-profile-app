import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMsg("Password reset link sent to your email.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Forgot Password
        </h2>
        {msg && <p className="text-sm text-green-600 mb-2 text-center">{msg}</p>}
        {error && (
          <p className="text-sm text-red-500 mb-2 text-center">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
