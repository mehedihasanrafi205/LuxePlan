import React, { useState, useMemo } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import {
  FiHome,
  FiUser,
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
  FiSun,
  FiMoon,
  FiUserPlus,
} from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { useTheme } from "../providers/ThemeContext";
import useRole from "../hooks/useRole";
import { VscRequestChanges } from "react-icons/vsc";
import { MdOutlineManageAccounts } from "react-icons/md";
import logo from "/logo.png";
import LoadingSpinner from "../components/LoadingSpinner";

const DashboardLayout = () => {
  const { user, logOut, loading } = useAuth();
  const { role, isRoleLoading } = useRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // ===============================
  // Role-based menu
  // ===============================
  const getMenu = (role) => {
    const base = "/dashboard";

    if (role === "admin") {
      return [
        { label: "My Profile", icon: FiUser, path: `${base}/profile` },
        {
          label: "Manage Users",
          icon: MdOutlineManageAccounts,
          path: `${base}/manage-users`,
        },
        {
          label: "Manage Services",
          icon: FiBriefcase,
          path: `${base}/manage-services`,
        },
        {
          label: "Add Service",
          icon: IoMdAddCircleOutline,
          path: `${base}/add-service`,
        },
        {
          label: "Manage Decorators",
          icon: FiCheckCircle,
          path: `${base}/manage-decorators`,
        },
        {
          label: "Manage Bookings",
          icon: FiCalendar,
          path: `${base}/manage-bookings`,
        },
        { label: "Analytics", icon: FiBarChart2, path: `${base}/analytics` },
      ];
    }

    if (role === "decorator") {
      return [
        { label: "My Profile", icon: FiUser, path: `${base}/profile` },
        {
          label: "Assigned Projects",
          icon: FiBriefcase,
          path: `${base}/assigned-projects`,
        },
        {
          label: "Today's Schedule",
          icon: FiClock,
          path: `${base}/todays-schedule`,
        },
        { label: "Earnings", icon: FiDollarSign, path: `${base}/earnings` },
      ];
    }

    return [
      { label: "My Profile", icon: FiUser, path: `${base}/profile` },
      { label: "My Bookings", icon: FiCalendar, path: `${base}/my-bookings` },
      {
        label: "Payment History",
        icon: FiCreditCard,
        path: `${base}/payment-history`,
      },
      {
        label: "Apply For Decorator",
        icon: FiUserPlus,
        path: `${base}/apply-decorator`,
      },
    ];
  };

  const menu = useMemo(() => getMenu(role), [role]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-20 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-30 top-0 left-0 h-full bg-base-100 border-r border-base-300
          transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-0"} md:w-64
          flex flex-col justify-between
          overflow-hidden
        `}
      >
        <div>
          <div className="p-4 border-b border-base-300 flex items-center justify-between">
            <Link to={"/"} className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
              <h1 className="text-xl md:text-2xl font-bold text-primary font-serif">
                LuxePlan
              </h1>
            </Link>
            <button
              className="btn btn-ghost btn-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className="p-3 space-y-2 overflow-y-auto h-[calc(100%-5rem)]">
            <h2 className="text-sm text-gray-500 font-semibold px-2">Menu</h2>

            {menu.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg 
                  transition-colors duration-150
                  ${
                    isActive
                      ? "bg-primary text-white font-semibold shadow"
                      : "hover:bg-base-300 hover:text-primary"
                  }`
                }
              >
                <item.icon size={20} /> {item.label}
              </NavLink>
            ))}

            <div className="divider" />

            <NavLink
              to="/"
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-base-300 hover:text-primary"
            >
              <FiHome size={20} />
              Back to Site
            </NavLink>
          </nav>
        </div>

        {/* Logout & Theme Switch at bottom */}
        <div className="p-4 border-t border-base-300 space-y-3">
          <button
            className="btn  w-full flex items-center justify-center gap-2 mt-2"
            onClick={toggleTheme}
          >
            {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          <button
            className="btn btn-error w-full flex items-center gap-2"
            onClick={() =>
              toast.promise(logOut(), {
                loading: "Logging out...",
                success: "Logged out!",
                error: "Logout failed",
              })
            }
          >
            <FiLogOut size={20} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Blur Overlay When Sidebar Open */}
        {sidebarOpen && (
          <div className="fixed inset-0  backdrop-blur-sm z-10 md:hidden"></div>
        )}

        <header className="flex items-center justify-between p-4 bg-base-100 border-b border-base-300 shadow-sm relative z-20">
          <button
            className="btn btn-ghost md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu size={22} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-primary ">
            {role?.toUpperCase()} Dashboard
          </h1>

          <div className="flex items-center gap-3">
            <button className="btn btn-ghost btn-circle relative">
              <FiBell size={20} />
              <span className="badge badge-xs badge-primary absolute -top-1 -right-1"></span>
            </button>
            <div className="hidden md:flex items-center gap-2">
              <div className="avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={
                      user?.photoURL ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${
                        user?.displayName || user?.email
                      }`
                    }
                    alt="User"
                  />
                </div>
              </div>
              <span>{user?.displayName || user?.email}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto relative z-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
