import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import logo from "/logo.png";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const Login = () => {
  const { signIn, signInWithGoogle, loading, setLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    const { email, password } = data;
    try {
      await signIn(email, password);
      toast.success("Login Successful");
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success("Login Successful");
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full p-10 bg-base-100 rounded-3xl shadow-2xl border border-base-300">
        {/* Header */}
        <div className="text-center mb-6">
          <Link to={"/"}>
            <img className="w-15 mx-auto" src={logo} alt="" />
          </Link>
          <h2 className="text-3xl font-serif font-extrabold text-primary">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-base-content/70">
            Login to your LuxePlan account.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-base-300 bg-base-200 text-base-content focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-error mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-base-300 bg-base-200 text-base-content focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
              {...register("password", {
                required: "Password is required",
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/70"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
            {errors.password && (
              <p className="text-xs text-error mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 rounded-2xl btn-gold text-black font-semibold shadow-xl hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] transition-all duration-300 disabled:opacity-50"
          >
            {loading && <span className="loading loading-spinner"></span>}
            <FiLogIn size={18} />
            Log In
          </button>
        </form>

        {/* Social login */}
        <div className="mt-6 text-center text-base-content/70">
          OR LOGIN WITH
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="flex-1 btn btn-outline btn-primary flex items-center justify-center gap-2 rounded-xl hover:bg-base-200 hover:text-primary transition-all duration-300"
          >
            <FaGoogle size={18} /> Google
          </button>
          <button className="flex-1 btn btn-outline btn-primary flex items-center justify-center gap-2 rounded-xl hover:bg-base-200 hover:text-primary transition-all duration-300">
            <FaFacebook size={18} /> Facebook
          </button>
        </div>

        {/* Signup Link */}
        <p className="mt-6 text-center text-sm text-base-content/70">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-primary font-medium hover:text-primary-focus transition-colors duration-200"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
