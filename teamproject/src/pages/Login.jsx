import React, { useState } from "react";



const Login = () => {
  const [login, setLogin] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);

 
  const handleData = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setMessage({ type: "", text: "" });
  };

  const validate = () => {
    const newErrors = {};
    const email = login.email.trim();

    if (!email) {
      newErrors.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!login.password) {
      newErrors.password = "Enter your password.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

   
    let users = [];
    try {
      const stored = JSON.parse(localStorage.getItem("Register"));
      if (Array.isArray(stored)) users = stored;
      else if (stored && typeof stored === "object") users = [stored]; // single registered user
    } catch {
      users = [];
    }

    if (users.length === 0) {
      setMessage({
        type: "error",
        text: "No account found. Please register first.",
      });
      return;
    }

    const email = login.email.trim().toLowerCase();
    const user = users.find((u) => (u.email || "").toLowerCase() === email);

    if (!user) {
      setMessage({ type: "error", text: "No account found with this email." });
      return;
    }

    if (user.password !== login.password) {
      setMessage({ type: "error", text: "Incorrect password. Try again." });
      return;
    }

   
    const { password, ...safeUser } = user;
    localStorage.setItem("LoggedInUser", JSON.stringify(safeUser));
    setMessage({ type: "success", text: "Login successful. Redirecting…" });
    setLogin({ email: "", password: "" });

   
  };

  const inputBase =
    "w-full rounded-lg border bg-white px-4 py-3 text-[#142B45] placeholder-slate-400 outline-none transition focus:ring-2";
  const inputOk =
    "border-slate-300 focus:border-[#2563EB] focus:ring-[#2563EB]/30";
  const inputErr = "border-red-500 focus:border-red-500 focus:ring-red-500/30";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-[#FFFFFF] p-8 shadow-lg ring-1 ring-slate-200">
          {/* Accent bar */}
          <div className="mb-6 h-1 w-12 rounded-full bg-[#14B8A6]" />

          <h1 className="text-2xl font-bold text-[#142B45]">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">
            Log in to continue to your account.
          </p>

          {message.text && (
            <div
              role="alert"
              className={`mt-5 rounded-lg border px-4 py-3 text-sm ${
                message.type === "success"
                  ? "border-[#14B8A6] bg-[#14B8A6]/10 text-[#0f766e]"
                  : "border-red-300 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#142B45]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={login.email}
                onChange={handleData}
                aria-invalid={!!errors.email}
                className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[#142B45]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={login.password}
                  onChange={handleData}
                  aria-invalid={!!errors.password}
                  className={`${inputBase} pr-16 ${
                    errors.password ? inputErr : inputOk
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-3 my-auto h-fit rounded px-1 text-sm font-medium text-[#2563EB] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#2563EB] px-4 py-3 font-semibold text-white transition hover:bg-[#1d4ed8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/50 focus-visible:ring-offset-2 active:scale-[0.99]"
            >
              Log in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-medium text-[#2563EB] hover:underline"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;