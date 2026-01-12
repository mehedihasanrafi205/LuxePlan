import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

const Newsletter = () => {
  return (
    <section className="bg-gradient-to-b from-base-100 via-base-200 to-base-100 py-24 md:py-32 relative overflow-hidden">
        {/* Deep Glow for Theme Integration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Background Texture - Adapted for Theme */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] text-base-content/5 pointer-events-none" />
            
        <div className="container mx-auto px-4 relative z-10">
            <div className="border-t border-b border-primary/20 py-16 md:py-24 relative">
                {/* Vertical Divider (Desktop) */}
                <div className="hidden md:block absolute top-0 bottom-0 left-[40%] w-px bg-primary/20"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                    {/* Left: Brand / Title */}
                    <div className="md:col-span-5 text-right md:pr-12">
                        <motion.h2 
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl md:text-5xl font-extrabold font-serif text-primary mb-4 leading-tight will-change-transform"
                        >
                            Subscribe to <br className="hidden md:block"/> Our Newsletter
                        </motion.h2>
                        <p className="text-base-content/70 text-lg mt-4">
                            Join our exclusive community for the latest updates and premium offers.
                        </p>
                    </div>

                    {/* Right: Interaction */}
                    <div className="md:col-span-7 md:pl-12">
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <p className="text-base-content/70 text-lg md:text-xl mb-10 font-light max-w-lg">
                                Be the first to know about secret venues, designer collaborations, and private galas.
                            </p>

                            <form className="max-w-md relative group mt-8" onSubmit={(e) => e.preventDefault()}>
                                <div className="flex flex-col md:flex-row items-stretch md:items-end gap-6">
                                    <div className="flex-1">
                                        <input 
                                            type="email" 
                                            placeholder="Your email address" 
                                            className="w-full bg-transparent border-b border-base-content/20 py-4 text-base-content placeholder:text-base-content/30 outline-none focus:border-primary transition-colors text-lg"
                                        />
                                    </div>
                                    <button className="px-8 py-4 bg-primary text-black font-bold rounded-full hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider text-sm whitespace-nowrap cursor-pointer">
                                        Subscribe <FiArrowRight />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Newsletter;
