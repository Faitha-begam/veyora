import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

const validate = (values) => {
  const errors = {};

  if (!values.name.trim()) errors.name = "Enter your full name.";
  else if (values.name.trim().length < 3)
    errors.name = "Name must be at least 3 characters.";

  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!emailPattern.test(values.email))
    errors.email = "Enter a valid email, like name@example.com.";

  if (!values.password) errors.password = "Create a password.";
  else if (!passwordPattern.test(values.password))
    errors.password = "Use at least 6 characters with a letter and a number.";

  if (!values.confirmPassword) errors.confirmPassword = "Re-enter your password.";
  else if (values.confirmPassword !== values.password)
    errors.confirmPassword = "Passwords do not match.";

  return errors;
};

// Reusable input (kept in this file so no extra imports are needed)
const Field = ({ label, name, error, ...props }) => (
  <div className="mb-4">
    <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-[#142B45]">
      {label}
    </label>
    <input
      id={name}
      name={name}
      className={`w-full rounded-md border bg-white px-3 py-2.5 text-slate-700 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/20 ${
        error ? "border-red-500" : "border-slate-300"
      }`}
      {...props}
    />
    {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleData = (e) => {
    const { name, value } = e.target;
    setRegister({ ...register, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate(register);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const users = JSON.parse(localStorage.getItem("Register")) || [];

    const emailExists = users.some(
      (user) => user.email === register.email.trim().toLowerCase()
    );
    if (emailExists) {
      setMessage({
        type: "error",
        text: "This email is already registered. Log in instead.",
      });
      return;
    }

    const newUser = {
      id: Date.now(),
      name: register.name.trim(),
      email: register.email.trim().toLowerCase(),
      password: register.password,
    };

    localStorage.setItem("Register", JSON.stringify([...users, newUser]));

    setMessage({ type: "success", text: "Account created. Taking you to login..." });
    setRegister({ name: "", email: "", password: "", confirmPassword: "" });
    setTimeout(() => navigate("/Login"), 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <header className="flex items-center justify-between bg-[#142B45] px-6 py-4">
        <Link to="/" className="text-lg font-bold text-white">
          My<span className="text-[#14B8A6]">App</span>
        </Link>
        <nav className="flex gap-5 text-sm font-medium">
          <Link to="/login" className="text-slate-300 hover:text-white">Login</Link>
          <Link to="/register" className="text-white">Register</Link>
        </nav>
      </header>

      {/* Card */}
      <main className="grid place-items-center px-4 py-10">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-full max-w-md rounded-xl border border-slate-200 border-t-4 border-t-[#14B8A6] bg-white p-8 shadow-lg shadow-[#142B45]/10"
        >
          <h2 className="text-2xl font-bold text-[#142B45]">Create your account</h2>
          <p className="mb-6 mt-1 text-sm text-slate-500">It takes less than a minute.</p>

          {message.text && (
            <div
              className={`mb-4 rounded-md border px-3 py-2.5 text-sm ${
                message.type === "success"
                  ? "border-[#14B8A6] bg-[#14B8A6]/10 text-teal-800"
                  : "border-red-300 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <Field label="Full name" name="name" type="text" placeholder="Enter your full name"
            value={register.name} onChange={handleData} error={errors.name} />
          <Field label="Email" name="email" type="email" placeholder="Enter your email"
            value={register.email} onChange={handleData} error={errors.email} />
          <Field label="Password" name="password" type="password" placeholder="Create a password"
            value={register.password} onChange={handleData} error={errors.password} />
          <Field label="Confirm password" name="confirmPassword" type="password"
            placeholder="Re-enter your password" value={register.confirmPassword}
            onChange={handleData} error={errors.confirmPassword} />

          <button
            type="submit"
            className="mt-1 w-full rounded-md bg-[#2563EB] py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Create account
          </button>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#2563EB] hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Register;
