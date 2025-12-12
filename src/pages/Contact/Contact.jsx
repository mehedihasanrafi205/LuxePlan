import React from "react";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaPinterestP, FaLinkedinIn } from "react-icons/fa";
import Map from "../../components/Map";

const Contact = () => {
  // Simple handler to prevent default form submission in this static example
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted!");
    // In a real app, you would handle form validation and API submission here
  };

  return (
    // Use standard DaisyUI bg/text classes for dark theme consistency
    <main className="bg-base-200 text-base-content flex flex-col items-center w-full px-4 py-16 md:py-24 space-y-24">
      <div className="max-w-6xl w-full flex flex-col gap-16 mt-18">
        
        {/* === 1. Hero Section === */}
        <section className="flex flex-col items-center text-center gap-6">
          <div className="p-3 rounded-full bg-primary/20 text-primary">
            {/* Using a simple envelope icon from Feather for cleaner visual */}
            <FiMail size={36} />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-serif  leading-tight">
            Begin Your LuxePlan Experience
          </h1>
          <p className="max-w-4xl text-base-content/70 text-lg">
            Have questions, ideas, or complex project requests? We’re dedicated to crafting bespoke solutions. Reach out to our specialized team directly.
          </p>
        </section>

        {/* === 2. Contact Form & Info Grid === */}
        <section className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Contact Form - Enhanced DaisyUI Card */}
          <div className="card bg-base-100 p-8 shadow-2xl border border-base-300/50 transition-shadow duration-300 hover:shadow-primary/30">
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
          </div>

          {/* Contact Info & Socials - Structured for Visual Impact */}
          <div className="flex flex-col gap-8 p-4">
            
            <h2 className="text-3xl font-bold text-primary mb-4">Direct Information</h2>
            
            {/* Contact Details Grid */}
            <div className="space-y-6">
              
              {/* Email Card */}
              <div className="flex items-start gap-4 p-4 bg-base-100 rounded-xl shadow-lg border border-base-300/50 hover:border-primary/50 transition-all duration-300">
                <FiMail size={24} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-xl text-accent">Email</p>
                  <a href="mailto:info@luxeplan.com" className="text-base-content/80 hover:text-primary transition-colors">
                    info@luxeplan.com
                  </a>
                </div>
              </div>
              
              {/* Phone Card */}
              <div className="flex items-start gap-4 p-4 bg-base-100 rounded-xl shadow-lg border border-base-300/50 hover:border-primary/50 transition-all duration-300">
                <FiPhone size={24} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-xl text-accent">Phone</p>
                  <a href="tel:+880123456789" className="text-base-content/80 hover:text-primary transition-colors">
                    +880 123 456 789 (Bangladesh)
                  </a>
                </div>
              </div>
              
              {/* Address Card */}
              <div className="flex items-start gap-4 p-4 bg-base-100 rounded-xl shadow-lg border border-base-300/50 hover:border-primary/50 transition-all duration-300">
                <FiMapPin size={24} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-xl text-accent">Visit Us</p>
                  <p className="text-base-content/80">
                    Banani DOHS, Dhaka, Bangladesh <br/>
                    (Appointment Required)
                  </p>
                </div>
              </div>

            </div>

            {/* Social Media Links */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-primary mb-4">Connect with Our Community</h3>
              <div className="flex items-center gap-3">
                {/* Social Icon Styling: Larger, more prominent, and consistent hover */}
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
          </div>
        </section>

        {/* === 3. Map Section (Placeholder) === */}
        <section className="w-full pt-16">
          <h2 className="text-4xl font-bold text-primary text-center mb-8">Our Location</h2>
            <Map></Map>
        </section>
        
      </div>
    </main>
  );
};

export default Contact;