import React from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaPinterestP, FaLinkedinIn } from "react-icons/fa";

const ContactPage = () => {
  return (
    <main className="bg-background-dark text-white font-display flex flex-col items-center w-full px-4 pb-15 pt-35 space-y-24">

      <div className="max-w-6xl w-full flex flex-col gap-16">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center gap-6">
          <div className="w-12 h-12 text-primary">
            <svg fill="none" viewBox="0 0 48 48" className="w-full h-full">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white">
            Get in Touch with LuxePlan
          </h1>
          <p className="max-w-3xl text-gray-300 text-lg">
            Have questions, ideas, or requests? We’d love to hear from you. Fill out the form below or use the contact info to reach us directly.
          </p>
        </section>

        {/* Contact Form & Info */}
        <section className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white/5 p-8 rounded-xl border border-primary/30 backdrop-blur-lg flex flex-col gap-6 shadow-lg hover:shadow-primary/50 transition-shadow">
            <h2 className="text-2xl font-bold font-serif text-primary">Send Us a Message</h2>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="p-3 rounded-lg bg-background-dark/50 text-white border border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="p-3 rounded-lg bg-background-dark/50 text-white border border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
              <input
                type="text"
                placeholder="Subject"
                className="p-3 rounded-lg bg-background-dark/50 text-white border border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
              <textarea
                placeholder="Your Message"
                rows="5"
                className="p-3 rounded-lg bg-background-dark/50 text-white border border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
              ></textarea>
              <button
                type="submit"
                className="mt-2 px-6 py-3 bg-primary text-background-dark rounded-full font-bold hover:scale-105 transition-transform"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold font-serif text-primary">Contact Info</h2>
            <div className="flex flex-col gap-4 text-gray-300">
              <div className="flex items-center gap-3">
                <FiMail className="text-primary text-xl" />
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <p>info@luxeplan.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="text-primary text-xl" />
                <div>
                  <p className="font-semibold text-white">Phone</p>
                  <p>+880 123 456 789</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiMapPin className="text-primary text-xl" />
                <div>
                  <p className="font-semibold text-white">Address</p>
                  <p>Banani, Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="p-3 rounded-full bg-white/10 hover:bg-primary transition-colors">
                <FaFacebookF className="text-white hover:text-background-dark transition-colors" />
              </a>
              <a href="#" className="p-3 rounded-full bg-white/10 hover:bg-primary transition-colors">
                <FaInstagram className="text-white hover:text-background-dark transition-colors" />
              </a>
              <a href="#" className="p-3 rounded-full bg-white/10 hover:bg-primary transition-colors">
                <FaPinterestP className="text-white hover:text-background-dark transition-colors" />
              </a>
              <a href="#" className="p-3 rounded-full bg-white/10 hover:bg-primary transition-colors">
                <FaLinkedinIn className="text-white hover:text-background-dark transition-colors" />
              </a>
            </div>
          </div>
        </section>

        {/* Optional: Map */}
        <section className="w-full h-64 rounded-xl overflow-hidden border border-primary/30">
          <iframe
            title="LuxePlan Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902904032096!2d90.4014212154318!3d23.7928863924702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7fbd92d8e45%3A0x9c56d1bbdc3e0e7e!2sBanani%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            className="border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>
      </div>
    </main>
  );
};

export default ContactPage;
