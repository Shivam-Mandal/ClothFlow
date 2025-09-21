// LoginForm.jsx
import React, { useState, useContext } from "react";
import { Lock, User, Factory } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import UserContext  from "../context/UserContext"; 

export const LoginForm = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate(); // optional: remove if not using
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // login should return { success: boolean, message?: string, user?: {...} }
      const res = await login(email.trim(), password);
      if (!res) {
        setError("Unexpected response from server. Try again.");
        return;
      }
      if (!res.success) {
        setError(res.message || "Invalid email or password");
        return;
      }

      // success: optionally redirect / let context consumer handle navigation
      // example redirect:
      navigate("/dashboard");
    } catch (err) {
      // handle thrown errors
      setError(err?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    { role: "Admin", email: "admin@company.com", password: "admin123" },
    { role: "Worker", email: "worker@company.com", password: "worker123" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Factory className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ClothFlow</h1>
            <p className="text-gray-600 mt-2">Manufacturing Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Demo Credentials:</p>
            <div className="space-y-2">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword(cred.password);
                    setError("");
                  }}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{cred.role}</span>
                    <span className="text-xs text-gray-500">Click to use</span>
                  </div>
                  <div className="text-sm text-gray-600">{cred.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
