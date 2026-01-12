import React from "react";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaPinterestP, FaLinkedinIn } from "react-icons/fa";
import Map from "../../components/Map";
import { motion } from "framer-motion";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted!");
  };

  return (
    // Use standard DaisyUI bg/text classes for dark theme consistency
    <main className=" text-base-content flex flex-col items-center w-full px-4 pt-32 pb-24 space-y-24">
      <div className="max-w-6xl w-full flex flex-col gap-16">
        
        {/* === 1. Hero Section === */}
        <section className="flex flex-col items-center text-center gap-6">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="p-3 rounded-full bg-primary/20 text-primary"
          >
            {/* Using a simple envelope icon from Feather for cleaner visual */}
            <FiMail size={36} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-primary font-serif  leading-tight"
          >
            Begin Your LuxePlan Experience
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl text-base-content/70 text-lg"
          >
            Have questions, ideas, or complex project requests? We’re dedicated to crafting bespoke solutions. Reach out to our specialized team directly.
          </motion.p>
        </section>

        {/* === 2. Contact Form & Info Grid === */}
        <section className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Contact Form - Enhanced DaisyUI Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card bg-base-100 p-8 shadow-2xl border border-base-300/50 transition-shadow duration-300 hover:shadow-primary/30 will-change-transform"
          >
            <h2 className="text-3xl font-bold text-primary mb-6">Send Us a Message</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              
              {/* Name Input */}
              <input
                type="text"
                placeholder="Your Name"
                className="input input-bordered input-lg bg-base-300 text-base-content border-primary/20 focus:border-primary transition-colors"
                required
              />
              
              {/* Email Input */}
              <input
                type="email"
                placeholder="Your Email"
                className="input input-bordered input-lg bg-base-300 text-base-content border-primary/20 focus:border-primary transition-colors"
                required
              />
              
              {/* Subject Input */}
              <input
                type="text"
                placeholder="Subject"
                className="input input-bordered input-lg bg-base-300 text-base-content border-primary/20 focus:border-primary transition-colors"
                required
              />
              
              {/* Message Textarea */}
              <textarea
                placeholder="Your Message (Project details, questions, etc.)"
                rows="5"
                className="textarea textarea-bordered textarea-lg bg-base-300 text-base-content border-primary/20 focus:border-primary resize-none transition-colors"
                required
              ></textarea>
              
              {/* Submit Button */}
              <button
                type="submit"
                className="mt-4 btn btn-primary btn-lg shadow-xl shadow-primary/40 hover:scale-[1.02] transition-transform duration-300 flex items-center gap-2"
              >
                <FiSend size={20} />
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Info & Socials - Structured for Visual Impact */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-8 p-4 will-change-transform"
          >
            
            <h2 className="text-3xl font-bold text-primary mb-4">Direct Information</h2>
            
            {/* Contact Details Grid */}
            <div className="space-y-6">
              
              {/* Email Card */}
              <a href="mailto:info@luxeplan.com" className="flex items-start gap-4 p-4 bg-base-100 rounded-xl shadow-lg border border-base-300/50 hover:border-primary/50 transition-all duration-300 cursor-pointer group hover:shadow-primary/10">
                <FiMail size={24} className="text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-xl text-accent">Email</p>
                  <span className="text-base-content/80 group-hover:text-primary transition-colors">
                    info@luxeplan.com
                  </span>
                </div>
              </a>
              
              {/* Phone Card */}
              <a href="tel:+880123456789" className="flex items-start gap-4 p-4 bg-base-100 rounded-xl shadow-lg border border-base-300/50 hover:border-primary/50 transition-all duration-300 cursor-pointer group hover:shadow-primary/10">
                <FiPhone size={24} className="text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-xl text-accent">Phone</p>
                  <span className="text-base-content/80 group-hover:text-primary transition-colors">
                    +880 123 456 789 (BD)
                  </span>
                </div>
              </a>
              
              {/* Address Card - Links to Map */}
              <a href="#location-map" className="flex items-start gap-4 p-4 bg-base-100 rounded-xl shadow-lg border border-base-300/50 hover:border-primary/50 transition-all duration-300 cursor-pointer group hover:shadow-primary/10">
                <FiMapPin size={24} className="text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-xl text-accent">Visit Us</p>
                  <p className="text-base-content/80 group-hover:text-primary transition-colors">
                    Banani DOHS, Dhaka <br/>
                    (Appointment Required)
                  </p>
                </div>
              </a>

            </div>

            {/* Social Media Links */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-primary mb-4">Connect with Our Community</h3>
              <div className="flex items-center gap-3">
                <a href="#" aria-label="Facebook" className="btn btn-circle btn-lg bg-base-200  hover:bg-primary hover:text-base-100 transition-all duration-300 shadow-md">
                  <FaFacebookF size={20} />
                </a>
                <a href="#" aria-label="Instagram" className="btn btn-circle btn-lg bg-base-200  hover:bg-primary hover:text-base-100 transition-all duration-300 shadow-md">
                  <FaInstagram size={20} />
                </a>
                <a href="#" aria-label="Pinterest" className="btn btn-circle btn-lg bg-base-200  hover:bg-primary hover:text-base-100 transition-all duration-300 shadow-md">
                  <FaPinterestP size={20} />
                </a>
                <a href="#" aria-label="LinkedIn" className="btn btn-circle btn-lg bg-base-200  hover:bg-primary hover:text-base-100 transition-all duration-300 shadow-md">
                  <FaLinkedinIn size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* === 3. Map Section (Placeholder) === */}
        <section id="location-map" className="w-full pt-16">
          <h2 className="text-4xl font-bold text-primary text-center mb-8">Our Location</h2>
            <Map></Map>
        </section>
        
      </div>
    </main>
  );
};

export default Contact;