import React from "react";
// 🚨 FIX: FiArrowRight must be imported along with the other icons
import {
  FiHeart,
  FiZap,
  FiCompass,
  FiFeather,
  FiArrowRight,
  FiAward,
  FiPenTool,
} from "react-icons/fi";
import { motion } from "framer-motion";

const WhyChooseUs = () => {
  return (
    <section className="bg-base-200 text-base-content py-24 md:py-32">
      <div className="container mx-auto px-4 ">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg font-semibold text-primary uppercase tracking-[0.2em] mb-3"
          >
            LuxePlan Difference
          </motion.h2>
          <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.1 }}
             className="text-4xl md:text-5xl font-extrabold! font-serif text-primary leading-tight"
          >
            The LuxePlan Advantage
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="max-w-3xl mx-auto text-base-content/70 mt-4 text-lg"
          >
            We transcend traditional design, delivering a synthesis of high art,
            seamless technology, and dedicated partnership.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center gap-4 card bg-base-100 p-8 shadow-xl border-t-4 border-primary transition-transform duration-300 hover:scale-[1.03] will-change-transform"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-2">
              <FiPenTool size={28} />
            </div>
            <h4 className="text-xl font-bold text-accent">
              Bespoke Creativity
            </h4>
            <p className="text-base-content/70 text-center text-sm">
              Innovative design solutions tailored for every unique client
              experience, ensuring no two projects are ever the same.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center gap-4 card bg-base-100 p-8 shadow-xl border-t-4 border-info transition-transform duration-300 hover:scale-[1.03] will-change-transform"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-info/10 text-info mb-2">
              <FiZap size={28} />
            </div>
            <h4 className="text-xl font-bold text-accent">Smart Integration</h4>
            <p className="text-base-content/70 text-center text-sm">
              Seamlessly blending sophisticated technology with artistic décor
              for intuitive, luxurious smart spaces.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center gap-4 card bg-base-100 p-8 shadow-xl border-t-4 border-success transition-transform duration-300 hover:scale-[1.03] will-change-transform"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-success/10 text-success mb-2">
              <FiAward size={28} />
            </div>
            <h4 className="text-xl font-bold text-accent">
              Unmatched Excellence
            </h4>
            <p className="text-base-content/70 text-center text-sm">
              Uncompromising quality, meticulous attention to detail, and the
              highest standards of craftsmanship.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
