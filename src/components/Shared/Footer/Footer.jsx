import React from "react";
import { FaTwitter, FaYoutube, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="">
      {/* MAIN LINKS */}
      <footer className="footer sm:footer-horizontal bg-base-200/90 backdrop-blur-xl text-base-content p-10 rounded-2xl border border-base-300/30 shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
        <nav>
          <h6 className="footer-title text-primary font-serif text-lg mb-3">
            Services
          </h6>
          {["Branding", "Design", "Marketing", "Advertisement"].map((item) => (
            <a
              key={item}
              className="link link-hover text-base-content/70 hover:text-primary transition-all duration-300"
            >
              {item}
            </a>
          ))}
        </nav>
        <nav>
          <h6 className="footer-title text-primary font-serif text-lg mb-3">
            Company
          </h6>
          {["About us", "Contact", "Jobs", "Press kit"].map((item) => (
            <a
              key={item}
              className="link link-hover text-base-content/70 hover:text-primary transition-all duration-300"
            >
              {item}
            </a>
          ))}
        </nav>
        <nav>
          <h6 className="footer-title text-primary font-serif text-lg mb-3">
            Legal
          </h6>
          {["Terms of use", "Privacy policy", "Cookie policy"].map((item) => (
            <a
              key={item}
              className="link link-hover text-base-content/70 hover:text-primary transition-all duration-300"
            >
              {item}
            </a>
          ))}
        </nav>
      </footer>

      {/* COPYRIGHT + SOCIALS */}
      <footer className="footer bg-base-200/90 text-base-content border-t border-base-300/40 px-10 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <aside className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-to-tr from-gold-start to-gold-end shadow-[0_0_15px_rgba(212,175,55,0.5)]">
            <span className="text-base-100 font-bold">LP</span>
          </div>
          <p className="text-base-content/70 text-sm">
            ACME Industries Ltd.
            <br />
            Providing reliable tech since 1992
          </p>
        </aside>

        <nav className="md:place-self-center md:justify-self-end">
          <div className="grid grid-flow-col gap-4">
            {[FaTwitter, FaYoutube, FaFacebookF].map((Icon, idx) => (
              <a
                key={idx}
                className="p-3 rounded-full bg-base-100/10 hover:bg-base-100/20 shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300"
              >
                <Icon className="text-primary hover:text-gold-end w-5 h-5 transition-colors duration-300" />
              </a>
            ))}
          </div>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
