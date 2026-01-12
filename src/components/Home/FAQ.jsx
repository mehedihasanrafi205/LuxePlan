import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`border border-primary/10 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "bg-base-200/50 shadow-lg border-primary/30" : "bg-base-100 hover:bg-base-200/30"}`}>
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left cursor-pointer transition-colors group"
      >
        <span className={`text-lg md:text-xl font-serif font-medium transition-colors ${isOpen ? "text-primary" : "text-base-content"}`}>
            {question}
        </span>
        <div className={`p-2 rounded-full transition-colors cursor-pointer ${isOpen ? "bg-primary text-black" : "bg-base-200 text-primary "}`}>
            {isOpen ? <FiMinus size={20} /> : <FiPlus size={20} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-base-content/70 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
        q: "Do you offer free consultations?",
        a: "Yes! We offer a complimentary 30-minute initial consultation to discuss your vision, requirements, and how LuxePlan can bring your dream event to life."
    },
    {
        q: "What is the typical timeline for a project?",
        a: "Timelines vary by scope. A single room refresh might take 2 weeks, while a full renovation or large-scale event planning could take 2-3 months."
    },
    {
        q: "Can I choose my own materials?",
        a: "Absolutely. We appreciate your personal taste! We can work with your preferred vendors or source high-quality materials from our exclusive global partners."
    },
    {
        q: "Do you handle commercial projects?",
        a: "Yes, we specialize in both residential and high-end commercial spaces including executive offices, luxury retail stores, and boutique hotel lobbies."
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-base-100 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-2 block">
            Common Queries
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-serif text-primary mb-4 leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base-content/70 max-w-2xl mx-auto text-lg">
            Everything you need to know about our premium services and process.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <FAQItem 
                key={index}
                question={faq.q}
                answer={faq.a}
                isOpen={activeIndex === index}
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
