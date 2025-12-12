import React from "react";
import { Link } from "react-router";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
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
      Icon: FiFacebook,
      href: "#",
      label: "Facebook",
      color: "from-yellow-400 to-yellow-500", // gold gradient
    },
    {
      Icon: FiInstagram,
      href: "#",
      label: "Instagram",
      color: "from-yellow-400 to-orange-400", // warm gold-orange
    },
    {
      Icon: FiTwitter,
      href: "#",
      label: "Twitter",
      color: "from-yellow-300 to-yellow-500", // subtle gold gradient
    },
    {
      Icon: FiMail,
      href: "mailto:info@luxeplan.com",
      label: "Email",
      color: "from-yellow-400 to-yellow-500", // same gold gradient as Facebook
    },
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Decorators", path: "/decorators" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "FAQ", path: "/faq" },
  ];

  const services = [
    { name: "Home Decoration", path: "/services" },
    { name: "Wedding Events", path: "/services" },
    { name: "Office Setup", path: "/services" },
    { name: "Birthday Parties", path: "/services" },
  ];

  return (
    <footer className="relative bg-base-200/80 border-t border-secondary/10 shadow-2xl overflow-hidden rounded-2xl ">
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

      {/* Footer Main Content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 "></div>
                <img
                  src={logo}
                  alt="LuxePlan"
                  className="w-10 h-10 relative z-10"
                />
              </div>
              <div>
                <div>
                  <span className="text-2xl font-serif text-gold-gradient">
                    LuxePlan
                  </span>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-primary/70 ">
                    Decoration Concierge
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">
              Bringing elegance and luxury to every space. Our expert decorators
              create unforgettable experiences tailored to you.
            </p>

            {/* Social Links */}
            <div className="flex gap-3 mt-5">
              {socialLinks.map(({ Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative group bg-gradient-to-br ${color} p-3 rounded-xl shadow-lg hover:shadow-xl transition-all`}
                  aria-label={label}
                >
                  <Icon size={20} className="text-white" />
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {label}
                  </span>
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
              <span className="w-1 h-6 bg-linear-to-b from-yellow-400 to-yellow-300 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(({ name, path }) => (
                <li key={path}>
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
              {services.map(({ name, path }) => (
                <li key={path}>
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
              <span className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-yellow-300 rounded-full"></span>
              Get In Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 hover:text-yellow-400 transition-colors group">
                <FiMail
                  className="mt-1 flex-shrink-0 group-hover:scale-110 transition-transform"
                  size={18}
                />
                <a href="mailto:info@luxeplan.com" className="text-sm">
                  info@luxeplan.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 hover:text-yellow-400 transition-colors group">
                <FiPhone
                  className="mt-1 flex-shrink-0 group-hover:scale-110 transition-transform"
                  size={18}
                />
                <a href="tel:+8801234567890" className="text-sm">
                  +880 123 456 7890
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <FiMapPin className="mt-1 flex-shrink-0" size={18} />
                <span className="text-sm">
                  123 Luxe Street, Gulshan, Dhaka 1212, Bangladesh
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <FiClock className="mt-1 flex-shrink-0" size={18} />
                <span className="text-sm">
                  Mon - Sat: 9:00 AM - 8:00 PM
                  <br />
                  Sunday: Closed
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {currentYear} LuxePlan. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              Made with{" "}
              <FiHeart className="text-red-500 animate-pulse" size={16} /> in
              Bangladesh
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
