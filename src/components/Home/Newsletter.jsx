import React from "react";
import { FiMail } from "react-icons/fi";

const Newsletter = () => {
  return (
    <div className="py-24 bg-primary text-primary-content relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-block p-4 rounded-full bg-white/10 mb-6 backdrop-blur-sm">
            <FiMail size={32} />
        </div>
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
          Join Our Newsletter
        </h2>
        <p className="text-lg opacity-80 mb-8 max-w-lg mx-auto">
          Get the latest trends, design tips, and exclusive offers delivered straight to your inbox.
        </p>

        <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-6 py-4 rounded-full bg-base-100/10 border border-white/20 placeholder:text-white/50 text-white outline-none focus:bg-base-100/20 transition-all"
            />
            <button className="px-8 py-4 rounded-full bg-base-100 text-primary font-bold hover:bg-white hover:scale-105 transition-all shadow-lg">
                Subscribe
            </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
