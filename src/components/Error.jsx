import React from "react";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiHome, FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router";

const Error = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden b">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl w-full bg-base-200 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-yellow-400/20">
        
        {/* Animated Icon with Pulsing Effect */}
        <motion.div
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl"
            />
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <FiAlertTriangle 
                className="text-yellow-400 relative z-10 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]" 
                size={80} 
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-4"
        >
          <span className="inline-block bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-bold">
            ERROR 404
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold  text-center mb-4"
        >
          Oops! Something Went Wrong
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className=" text-center text-lg mb-8 leading-relaxed"
        >
          We couldn't find the page you're looking for. It might have been moved, deleted, or the link might be broken.
        </motion.p>

        {/* Helpful Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-gray-700/50 border border-yellow-400/30 rounded-xl p-4 mb-8"
        >
          <h3 className="font-semibold  mb-2 text-center">Here's what you can try:</h3>
          <ul className=" text-sm space-y-1 text-center">
            <li>• Check the URL for typos</li>
            <li>• Go back to the homepage</li>
            <li>• Try refreshing the page</li>
          </ul>
        </motion.div>

        {/* Buttons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {/* Back to Home Button */}
          <Link
            to="/"
            className="group flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <FiHome className="group-hover:rotate-12 transition-transform" size={20} />
            <span>Back to Home</span>
          </Link>

          {/* Retry Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="group flex items-center justify-center gap-2 bg-gray-900 text-yellow-400 px-8 py-3 rounded-xl font-semibold border-2 border-yellow-400 hover:bg-yellow-400 hover:text-gray-900 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <FiRefreshCw size={20} />
            </motion.div>
            <span>Try Again</span>
          </motion.button>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center = text-sm mt-8"
        >
          Still having trouble? <Link to="/contact" className="text-yellow-400 hover:text-yellow-500 font-semibold underline">Contact Support</Link>
        </motion.p>
      </div>


      

      {/* Decorative Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-8 = text-sm"
      >
        <p>LuxePlan - Making every space beautiful</p>
      </motion.div>
    </div>
  );
};

export default Error;
