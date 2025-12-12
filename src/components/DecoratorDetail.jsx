import React from "react";
import { useParams, Link } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiStar,
  FiArrowLeft,
  FiUser,
  FiClock,
} from "react-icons/fi";
import LoadingSpinner from "./LoadingSpinner";

const DecoratorDetail = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const {
    data: decorator,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["decorator", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/decorator/${id}`);
      return res.data;
    },
  });

  // LOADING STATE
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  // ERROR STATE
  if (isError || !decorator) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-xl mb-4">Something went wrong!</p>
        <Link
          to="/"
          className="px-5 py-2 rounded-lg bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-base-200  py-25">
      {/* CONTENT */}
      <div className="relative z-10 container mx-auto px-6 pt-10">
        {/* Back Button */}
        <Link
          to="/dashboard/manage-decorators"
          className="flex items-center gap-2 mb-8 text-gray-300 hover:text-yellow-400 transition"
        >
          <FiArrowLeft /> Back To Manage Decorator
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-10 items-start bg-white/5 border border-yellow-500/20 p-8 rounded-2xl backdrop-blur-md">
          {/* Profile Image */}
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={decorator.profileImage}
            alt={decorator.fullName}
            className="w-40 h-40 rounded-2xl object-cover shadow-xl border border-yellow-500/30"
          />

          {/* INFO */}
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              {decorator.fullName}
            </h1>

            <p className="text-gray-400 mt-2">{decorator.description}</p>

            {/* Status Badges */}
            <div className="flex gap-3 mt-5">
              <span className="px-4 py-1 rounded-full text-sm bg-green-500/20 text-green-400 border border-green-500/30">
                {decorator.status}
              </span>
              <span className="px-4 py-1 rounded-full text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {decorator.workStatus}
              </span>
            </div>

            {/* Contact */}
            <div className="mt-6 space-y-3 text-gray-300">
              <p className="flex items-center gap-2">
                <FiMail className="text-yellow-400" /> {decorator.email}
              </p>
              <p className="flex items-center gap-2">
                <FiPhone className="text-yellow-400" /> {decorator.phoneNumber}
              </p>
              <p className="flex items-center gap-2">
                <FiClock className="text-yellow-400" />
                Joined: {new Date(decorator.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <FiStar className="text-yellow-400" /> Specialties
          </h2>

          <div className="flex flex-wrap gap-3">
            {decorator.specialties.map((item, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.1 }}
                className="px-5 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300"
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecoratorDetail;
