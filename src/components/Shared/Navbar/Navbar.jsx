import React, { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiUser,
  FiGrid,
  FiLogOut,
  FiMoon,
  FiSun,
  FiArrowRight,
} from "react-icons/fi";
import { Link, NavLink } from "react-router";

import logo from "/logo.png";
import useAuth from "../../../hooks/useAuth";
import { useTheme } from "../../../providers/ThemeContext";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  // NAV LINKS
  const navItems = [
    ["Home", "/"],
    ["Services", "/services"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ];

  if (user) {
    navItems.splice(2, 0, ["Dashboard", "/dashboard"]);
  }

  const navLinks = (
    <>
      {navItems.map(([name, path]) => (
        <li key={path} className="group">
          <NavLink
            to={path}
            className={({ isActive }) =>
              `relative px-3 py-2 text-[15px] font-light tracking-wide 
             transition-all duration-300
             ${
               isActive
                 ? "text-primary"
                 : "text-base-content/70 hover:text-primary"
             }`
            }
          >
            {name}

            <span
              className="
              absolute left-1/2 -translate-x-1/2 bottom-1 
              w-0 h-[1.5px] bg-primary rounded-full
              transition-all duration-300 group-hover:w-4/5
            "
            />
          </NavLink>
        </li>
      ))}
    </>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4 ">
      <nav
        className="
          navbar container w-full 
          bg-base-200/80 backdrop-blur-xl 
          border 
          shadow-[0_8px_30px_rgba(0,0,0,0.2)] 
          rounded-2xl transition-all duration-300
          px-4 py-3 border-secondary/10
        "
      >
        {/* LEFT SIDE */}
        <div className="navbar-start flex items-center gap-3">
          {/* Mobile Menu */}
          <div className="dropdown lg:hidden">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </label>

            <ul
              tabIndex={0}
              className="
                menu menu-sm dropdown-content mt-3 w-64 p-4 space-y-2 
                bg-base-100/95 backdrop-blur-xl 
                rounded-xl shadow-2xl border border-base-300/40
                animate-fadeIn
              "
            >
              {navLinks}

              {/* Sign Out */}
              <li className="pt-3 mt-2 border-t border-base-300/50">
                <a className="text-error font-medium">Sign Out</a>
              </li>
            </ul>
          </div>

          {/* LOGO */}
          <a href="/" className="flex items-center gap-3">
            <div
              className="
              w-13 h-13   
              flex items-center justify-center hover:rounded-full
              hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]
              transition-all duration-300
            "
            >
              <img src={logo} alt="" />
            </div>

            <div className="leading-tight hidden sm:block">
              <span className="text-4xl font-serif text-gold-gradient">
                LuxePlan
              </span>
              <p className="text-[10px] uppercase tracking-[0.25em] text-primary/70 ">
                Decoration Concierge
              </p>
            </div>
          </a>
        </div>

        {/* CENTER NAV (Desktop) */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-2">{navLinks}</ul>
        </div>

        {/* RIGHT SIDE */}
        <div className="navbar-end flex items-center gap-3 sm:gap-4">
          {/* Theme Toggle */}
          <label className="swap swap-rotate btn btn-ghost btn-circle text-primary">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <FiSun className="swap-on w-5 h-5" />
            <FiMoon className="swap-off w-5 h-5" />
          </label>

          {/* User Auth */}
          {user ? (
            <div className="dropdown dropdown-end relative">
              <label
                tabIndex={0}
                className="
                btn btn-ghost btn-circle avatar 
                 border border-primary/40 hover:border-primary/70
                   transition-all duration-300 p-0.5
                    "
              >
                <div className="w-10 rounded-full overflow-hidden">
                  <img
                    referrerPolicy="no-referrer"
                    src={user.photoURL}
                    alt="avatar"
                  />
                </div>
              </label>

              <ul
                tabIndex={0}
                className="
        dropdown-content mt-3 p-4 w-56 rounded-2xl
        bg-base-100/95 backdrop-blur-xl
        shadow-[0_8px_35px_rgba(212,175,55,0.35)]
        border border-primary/30
        space-y-2 animate-fadeIn
      "
              >
                <li className="menu-title text-sm mb-1 text-primary font-semibold">
                  {user.displayName}
                </li>

                <li>
                  <Link
                    to={"/dashboard/profile"}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-primary/10 transition-all duration-300"
                  >
                    <FiUser size={16} className="text-primary" /> Profile
                  </Link>
                </li>

                <li>
                  <Link
                    to={"/dashboard"}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-primary/10 transition-all duration-300"
                  >
                    <FiGrid size={16} className="text-primary" /> Dashboard
                  </Link>
                </li>

                <li onClick={logOut}>
                  <Link className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-all duration-300 text-error">
                    <FiLogOut size={16} /> Logout
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              to="/login"
              className="
    relative px-6 py-2.5 rounded-full overflow-hidden
    bg-linear-to-r from-[#d4af37] to-[#f0c75e]
    text-black font-semibold
    border-2 border-[#d4af37]
    shadow-[0_0_25px_rgba(212,175,55,0.35)]
    hover:shadow-[0_0_35px_rgba(212,175,55,0.5)]
    transition-all duration-300
  "
            >
              <span className="relative z-10 flex items-center gap-2">
                Book Now{" "}
                <FiArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
