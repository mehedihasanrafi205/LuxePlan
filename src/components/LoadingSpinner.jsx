import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center flex-col gap-5 items-center min-h-screen">
      <div className="relative w-16 h-16">
        {/* Main spinning circle */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/50"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            filter: "drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))",
          }}
        />
        
        {/* Secondary spinning circle - slower */}
        <motion.div
          className="absolute inset-1 rounded-full border-3 border-transparent border-b-primary/70"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-2 h-2 rounded-full bg-primary"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
      
      {/* Loading text */}
      <motion.div
        className="ml-4 text-primary font-medium"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Loading...
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;