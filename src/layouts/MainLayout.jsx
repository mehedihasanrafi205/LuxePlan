import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Shared/Navbar/Navbar";
import Footer from "../components/Shared/Footer/Footer";
import { motion } from "framer-motion";

const MainLayout = () => {
  return (
    <div className="flex flex-col bg-base-200 min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main large gold blob */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"
        />

        {/* Floating gold blob */}
        <motion.div
          animate={{ y: [0, -25, 0], x: [0, 25, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/4 w-72 h-72 bg-yellow-300/20 rounded-full blur-2xl"
        />

        {/* Secondary smaller gold accent */}
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, -15, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-1/3 w-60 h-60 bg-yellow-400/20 rounded-full blur-2xl"
        />
      </div>

      <Navbar />
      <main className="flex-1 relative z-10 bg-base-200">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
