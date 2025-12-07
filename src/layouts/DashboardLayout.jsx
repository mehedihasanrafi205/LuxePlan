import React, { useState, useMemo } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiCreditCard,
  FiMenu,
  FiBell,
  FiLogOut,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import useAuth from "../hooks/useAuth";
import { IoMdAddCircleOutline } from "react-icons/io";

const DashboardLayout = () => {
  // ----------------------------------------------------
  // Auth & State Management
  // ----------------------------------------------------
  const { user, logOut, role = "admin", loading } = useAuth(); // Assume role is provided by useAuth
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // ----------------------------------------------------
  // Role-Based Menu Generation (LuxePlan Requirements)
  // ----------------------------------------------------
  const getDashboardLinks = (userRole) => {
    const baseRoute = `/dashboard`;

    if (userRole === "admin") {
      return [
        { label: "My Profile", icon: FiUser, path: `${baseRoute}/profile` },
        {
          label: "Manage Services & Packages",
          icon: FiBriefcase,
          path: `${baseRoute}/manage-services`,
        },
        {
          label: "Add Service",
          icon: IoMdAddCircleOutline,
          path: `${baseRoute}/add-service`,
        },

        {
          label: "Manage Decorators",
          icon: FiCheckCircle,
          path: `${baseRoute}/manage-decorators`,
        },
        {
          label: "Manage Bookings",
          icon: FiCalendar,
          path: `${baseRoute}/manage-bookings`,
        },
        {
          label: "Revenue Monitoring & Analytics",
          icon: FiBarChart2,
          path: `${baseRoute}/analytics`,
        },
      ];
    } else if (userRole === "decorator") {
      return [
        { label: "My Profile", icon: FiUser, path: `${baseRoute}/profile` },
        {
          label: "My Assigned Projects",
          icon: FiBriefcase,
          path: `${baseRoute}/assigned-projects`,
        },
        {
          label: "Today's Schedule",
          icon: FiClock,
          path: `${baseRoute}/schedule`,
        },
        {
          label: "Earnings Summary",
          icon: FiDollarSign,
          path: `${baseRoute}/earnings`,
        },
      ];
    } else {
      // 'user' role
      return [
        { label: "My Profile", icon: FiUser, path: `${baseRoute}/profile` },
        {
          label: "My Bookings",
          icon: FiCalendar,
          path: `${baseRoute}/my-bookings`,
        },
        {
          label: "Payment History",
          icon: FiCreditCard,
          path: `${baseRoute}/payment-history`,
        },
      ];
    }
  };

  const dashboardLinks = useMemo(() => getDashboardLinks(role), [role]);

  // Determine current active page for the Header title
  const currentPath = location.pathname;
  const activeLink = dashboardLinks.find((link) =>
    currentPath.startsWith(link.path)
  );
  const headerTitle = activeLink ? activeLink.label : "Dashboard Overview";

  // ----------------------------------------------------
  // Loading and Error Handling
  // ----------------------------------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }
  // Optional: Redirect to login if user is not authenticated, handled in main router setup usually
  // if (!user) return <Navigate to="/login" replace />;

  // ----------------------------------------------------
  // Component Render
  // ----------------------------------------------------
  return (
    <div className="flex h-screen bg-base-200">
      {/* Sidebar */}
      <div
        className={`bg-base-100 border-r border-base-300 transition-all duration-300 z-30 ${
          sidebarOpen ? "w-64" : "w-16"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <span
            className={`text-xl font-bold text-primary transition-opacity duration-150 ${
              sidebarOpen ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            {role?.toUpperCase()} Dashboard
          </span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto mt-4 px-2">
          {/* Dynamic Dashboard Links */}
          <h2
            className={`text-sm font-semibold text-gray-500 mb-2 ${
              sidebarOpen ? "px-3" : "px-0 text-center"
            }`}
          >
            {sidebarOpen ? "Menu" : "•••"}
          </h2>
          {dashboardLinks.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors duration-150 ${
                  isActive
                    ? "bg-primary text-white font-semibold shadow-md"
                    : "hover:bg-base-300 hover:text-primary"
                } ${!sidebarOpen && "justify-center"}`
              }
            >
              <item.icon size={20} />
              <span className={`${sidebarOpen ? "inline" : "hidden"}`}>
                {item.label}
              </span>
            </NavLink>
          ))}

          {/* General Navigation Links */}
          <div className="divider my-4"></div>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors duration-150 hover:bg-base-300 hover:text-primary ${
                !sidebarOpen && "justify-center"
              }`
            }
          >
            <FiHome size={20} />
            <span className={`${sidebarOpen ? "inline" : "hidden"}`}>
              Back to Site
            </span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-base-300">
          <button
            className="flex items-center gap-2 btn btn-error w-full"
            onClick={() =>
              toast.promise(logOut(), {
                loading: "Logging out...",
                success: "Logged out successfully!",
                error: "Logout failed!",
              })
            }
          >
            <FiLogOut size={20} />
            <span className={`${sidebarOpen ? "inline" : "hidden"}`}>
              Log Out
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between p-4 bg-base-100 border-b border-base-300 shadow-sm z-20">
          <h1 className="text-2xl font-bold text-primary capitalize">
            {headerTitle}
          </h1>
          <div className="flex items-center gap-4">
            <button className="btn btn-ghost btn-circle relative">
              <FiBell size={20} />
              <span className="badge badge-xs badge-primary absolute -top-1 -right-1"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                  <img
                    src={
                      user?.photoURL ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${
                        user?.displayName || user?.email
                      }`
                    }
                    alt="Avatar"
                  />
                </div>
              </div>
              <span className="hidden md:block font-semibold">
                {user?.displayName || user?.email}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
