"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("picremove_auth");
    if (isLoggedIn === "true") {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simple password check - you can change this
    const correctPassword = "ab-666606";

    // Simulate network delay for security
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (password === correctPassword) {
      sessionStorage.setItem("picremove_auth", "true");
      router.push("/");
    } else {
      setError("密码错误，请重试");
      setPassword("");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white text-3xl">✂️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Pic<span className="text-indigo-500">Remove</span>
          </h1>
          <p className="text-gray-500 mt-2">图片背景移除工具</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            请输入访问密码
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focusoutline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-center text-lg tracking-widest"
                autoFocus
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={!password || isLoading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              {isLoading ? "验证中..." : "进入工具"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          © 2024 PicRemove
        </p>
      </div>
    </div>
  );
}
