import React from "react";
import { Link } from "react-router";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiHeart,
} from "react-icons/fi";
import { motion } from "framer-motion";
import logo from "/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      id: "facebook",
      Icon: FiFacebook,
      href: "https://www.facebook.com/mehedihasanrafi205",
      label: "Facebook",
    },
    {
      id: "instagram",
      Icon: FiInstagram,
      href: "#",
      label: "Instagram",
    },
    {
      id: "linkedin",
      Icon: FiLinkedin,
      href: "https://linkedin.com/in/mehedihasanrafi205",
      label: "LinkedIn",
    },
    {
      id: "twitter",
      Icon: FiTwitter,
      href: "#",
      label: "Twitter",
    },
  ];

  const quickLinks = [
    { id: "home", name: "Home", path: "/" },
    { id: "services", name: "Services", path: "/services" },
    { id: "dashboard", name: "Dashboard", path: "/dashboard" },
    { id: "gallery", name: "Gallery", path: "/gallery" },
    { id: "about", name: "About Us", path: "/about" },
    { id: "contact", name: "Contact", path: "/contact" },
  ];

  const services = [
    { id: "home-decor", name: "Home Decoration", path: "/services" },
    { id: "wedding", name: "Wedding Events", path: "/services" },
    { id: "office", name: "Office Setup", path: "/services" },
    { id: "birthday", name: "Birthday Parties", path: "/services" },
  ];

  return (
    <footer className="relative bg-base-200/80 border-t border-secondary/10 shadow-2xl overflow-hidden rounded-2xl">
      {/* Animated Background Gold Blobs */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], rotate: [360, 180, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"
        />
      </div>

      {/* Footer Content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="LuxePlan" className="w-10 h-10" />
              <div>
                <span className="text-2xl font-serif text-gold-gradient">
                  LuxePlan
                </span>
                <p className="text-[10px] uppercase tracking-[0.25em] text-primary/70">
                  Decoration Concierge
                </p>
              </div>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">
              Bringing elegance and luxury to every space. Our expert decorators
              create unforgettable experiences tailored to you.
            </p>

            {/* Social Links */}
            <div className="flex gap-5 mt-6">
              {socialLinks.map(({ id, Icon, href, label }) => (
                <motion.a
                  key={id}
                  href={href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 flex items-center justify-center rounded-full border border-primary/40 text-primary shadow-[0_0_10px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:bg-primary hover:text-white transition-all duration-300"
                  aria-label={label}
                >
                  <Icon size={22} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold mb-6 text-yellow-400 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-yellow-300 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(({ id, name, path }) => (
                <li key={id}>
                  <Link
                    to={path}
                    className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-yellow-400 group-hover:w-4 transition-all"></span>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-6 text-yellow-400 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-yellow-300 rounded-full"></span>
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map(({ id, name, path }) => (
                <li key={id}>
                  <Link
                    to={path}
                    className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-yellow-400 group-hover:w-4 transition-all"></span>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-6 text-yellow-400 flex items-center gap-2">
              <span className="w-1 h-6 bg-linear-to-b from-yellow-400 to-yellow-300 rounded-full"></span>
              Get In Touch
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:mehedihasanrafi205@gmail.com" className="flex items-start gap-3 text-gray-400 hover:text-yellow-400 transition-colors group">
                  <FiMail size={18} className="mt-1" />
                  <span className="group-hover:translate-x-1 transition-transform">mehedihasanrafi205@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+8801234567890" className="flex items-start gap-3 text-gray-400 hover:text-yellow-400 transition-colors group">
                  <FiPhone size={18} className="mt-1" />
                  <span className="group-hover:translate-x-1 transition-transform">+880 123 456 7890</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <FiMapPin size={18} className="mt-1" />
                <span>Gulshan, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <FiClock size={18} className="mt-1" />
                <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} LuxePlan. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            Made with <FiHeart className="text-red-500 animate-pulse" /> in
            Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
