import React, { useState } from "react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiUserPlus,
  FiEye,
  FiEyeOff,
  FiCamera,
} from "react-icons/fi";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import logo from "/logo.png";
import { Link, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import axios from "axios";
import { imageUpload } from "../../utils";

const Signup = () => {
  const { createUser, updateUserProfile, signInWithGoogle, loading } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || "/";
  const [showPassword, setShowPassword] = useState(false);

  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //   console.log(errors);

  const handleSignup = async (data) => {
    const { name, email, password, image } = data;

    const imageFile = image[0];

    const imageURL = await imageUpload(imageFile);


    try {
      const result = await createUser(email, password);
      await updateUserProfile(
        name,
        imageURL || "https://www.w3schools.com/howto/img_avatar.png"
      );
      console.log(result);
      navigate(from, { replace: true });
      toast.success("Signup Successful");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      //User Registration using google
      await signInWithGoogle();

      navigate(from, { replace: true });
      toast.success("Signup Successful");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full p-10 bg-base-100 rounded-3xl shadow-2xl border border-base-300">
        {/* Header */}
        <div className="text-center mb-6">
          <Link to={"/"}>
            <img className="w-16 mx-auto" src={logo} alt="" />
          </Link>
          <h2 className="text-3xl font-serif font-extrabold text-primary">
            Create Your LuxePlan Account
          </h2>
          <p className="mt-2 text-sm text-base-content/70">
            Start your decoration concierge experience.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit(handleSignup)}>
          {/* Photo Upload */}
          <label className="block cursor-pointer group">
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-base-200/60 backdrop-blur-sm border border-base-300/70 shadow-md hover:shadow-xl transition-all duration-300 group-hover:border-primary/60 group-hover:bg-base-200/80">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-primary/40 bg-base-100 flex items-center justify-center shadow-inner relative">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiCamera className="text-primary/80" size={24} />
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-semibold text-base-content group-hover:text-primary transition-colors">
                  Upload Profile Photo
                </span>
                <span className="text-xs text-base-content/60">
                  JPG · PNG · Max 2MB
                </span>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              {...register("image", {
                required: "Profile photo is required",
                validate: (files) => {
                  const file = files[0];
                  if (!file) return "Profile photo is required";
                  if (file.size > 2 * 1024 * 1024)
                    return "Image must be less than 2MB";
                  return true;
                },
                onChange: (e) => {
                  const file = e.target.files[0];
                  if (file) setPreview(URL.createObjectURL(file));
                },
              })}
            />
          </label>
          {errors.image && (
            <p className="text-xs text-error mt-1">{errors.image.message}</p>
          )}

          {/* Full Name */}
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70" />
            <input
              type="text"
              placeholder="Full Name"
              className="luxe-input"
              {...register("name", {
                required: "Name is required",
                maxLength: {
                  value: 20,
                  message: "Please enter a shorter name (max 20 characters)",
                },
              })}
            />
            {errors.name && (
              <p className="text-xs text-error mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70" />
            <input
              type="email"
              placeholder="Email Address"
              className="luxe-input"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter ballet email address",
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
              placeholder="Password (min 6 characters)"
              className="luxe-input pr-12"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/,
                  message:
                    "Password must include uppercase, lowercase, number, and special character",
                },
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
            className="w-full flex justify-center items-center gap-2 py-3 rounded-2xl btn-gold text-black font-semibold shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {loading && <span className="loading loading-spinner"></span>}
            <FiUserPlus size={18} /> Sign Up
          </button>
        </form>

        {/* Social Login */}
        <div className="mt-6 text-center text-base-content/70">
          OR SIGN UP WITH
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="flex-1 btn btn-outline btn-primary flex items-center justify-center gap-2 rounded-xl hover:bg-base-200 hover:text-primary transition-all duration-300"
          >
            <FaGoogle size={18} /> Google
          </button>

          <button
            // onClick={() => handleSocialLogin("Facebook")}
            className="flex-1 btn btn-outline btn-primary flex items-center justify-center gap-2 rounded-xl hover:bg-base-200 hover:text-primary transition-all duration-300"
          >
            <FaFacebook size={18} /> Facebook
          </button>
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-base-content/70">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:text-primary-focus transition-colors"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
