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
  FiTag,
  FiSettings, // Added FiSettings
} from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { useTheme } from "../providers/ThemeContext";
import useRole from "../hooks/useRole";
import { VscRequestChanges } from "react-icons/vsc";
import { MdOutlineDashboard, MdOutlineManageAccounts } from "react-icons/md";
import logo from "/logo.png";
import LoadingSpinner from "../components/LoadingSpinner";

const DashboardLayout = () => {
  const { user, logOut, loading } = useAuth();
  const { role, isRoleLoading } = useRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Role-based menu
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
        {
          label: "Manage Coupons",
          icon: FiTag,
          path: `${base}/manage-coupons`,
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
      {/* Sidebar Overlay for Mobile/Tablet */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-[100dvh] w-72 bg-base-100/95 backdrop-blur-xl border-r border-base-200
          flex flex-col transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-sm
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:h-[100dvh]
        `}
      >
        <div className="flex-none">
          <div className="h-20 flex items-center gap-3 px-6 border-b border-base-200/50">
            <Link to={"/"} className="flex items-center gap-2  transition-transform">
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
              <h1 className="text-2xl font-bold text-primary font-serif tracking-tight">
                LuxePlan
              </h1>
            </Link>
            <button
              className="btn btn-ghost btn-sm btn-circle lg:hidden ml-auto"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto flex-1 custom-scrollbar">
            <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest px-4 mb-2 mt-2">Menu</p>
            <NavLink
              to={"/dashboard"}
              end
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium
                ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/30 translate-x-1"
                    : "text-base-content/70 hover:bg-base-200 hover:text-primary hover:translate-x-1"
                }`
              }
            >
              <MdOutlineDashboard size={22} /> Dashboard
            </NavLink>

            {menu.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium
                  ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/30 translate-x-1"
                      : "text-base-content/70 hover:bg-base-200 hover:text-primary hover:translate-x-1"
                  }`
                }
              >
                <item.icon size={22} /> {item.label}
              </NavLink>
            ))}

            <div className="divider opacity-50 my-6" />

            <NavLink
              to="/"
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base-content/70 hover:bg-base-200 hover:text-primary transition-all font-medium"
            >
              <FiHome size={22} />
              Back to Website
            </NavLink>
        </nav>

        {/* Logout & Theme Switch at bottom */}
        <div className="p-4 border-t border-base-200/50 bg-base-100/50 flex-none pb- safe-area-bottom">
          <div className="flex flex-col gap-3">
            <button
                className="btn btn-outline w-full justify-start gap-3 text-base-content/70 hover:text-primary transition-all group"
                onClick={toggleTheme}
            >
                {theme === "light" ? <FiMoon size={20} className="group-hover:rotate-12 transition-transform" /> : <FiSun size={20} className="group-hover:rotate-90 transition-transform" />}
                <span className="font-medium">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </button>
            <button
                className="btn btn-error btn-outline w-full justify-start gap-3"
                onClick={() =>
                toast.promise(logOut(), {
                    loading: "Logging out...",
                    success: "Logged out!",
                    error: "Logout failed",
                })
                }
            >
                <FiLogOut size={20} /> <span className="font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative w-full h-screen overflow-hidden bg-base-200/20">
        {/* Blur Overlay When Sidebar Open */}
        {sidebarOpen && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-40 lg:hidden" onClick={closeSidebar}></div>
        )}

        <header className="flex items-center justify-between px-6 py-4 bg-base-100/80 backdrop-blur-md border-b border-base-200/50 sticky top-0 z-30 shadow-sm h-20 transition-all">
          <div className="flex items-center gap-4">
            <button
                className="btn btn-ghost btn-square lg:hidden"
                onClick={() => setSidebarOpen(true)}
            >
                <FiMenu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
                {role === 'admin' ? 'Admin Control' : role === 'decorator' ? 'Decorator Portal' : 'User Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <button className="btn btn-ghost btn-circle btn-sm relative hover:bg-base-200 transaction-colors">
              <FiBell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-base-100 animate-pulse"></span>
            </button>
            
            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-base-200 cursor-pointer group">
                    <div className="text-right hidden md:block leading-tight group-hover:opacity-80 transition-opacity">
                        <p className="font-bold text-sm truncate max-w-[150px]">{user?.displayName || "User"}</p>
                        <p className="text-xs text-base-content/60 uppercase font-mono tracking-wider">{role}</p>
                    </div>
                    <div className="avatar ring-2 ring-primary ring-offset-2 ring-offset-base-100 rounded-full transition-shadow duration-300 group-hover:ring-offset-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                            src={
                            user?.photoURL ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${
                                user?.displayName || user?.email
                            }`
                            }
                            alt="User"
                            className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                        />
                        </div>
                    </div>
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-2xl bg-base-100 rounded-box w-60 mt-4 border border-base-200 animate-in fade-in slide-in-from-top-2 duration-200">
                    <li className="px-4 py-2 pointer-events-none opacity-60 text-xs uppercase font-bold tracking-wider border-b border-base-200/50 mb-2 pb-2">
                        Account Info
                    </li>
                    <li>
                        <Link to="/dashboard/profile" className="py-3 font-medium">
                            <FiUser size={16} /> My Profile
                        </Link>
                    </li>
                    <li>
                         <Link to="/dashboard/profile" className="py-3 font-medium">
                            <FiSettings size={16} /> Settings
                        </Link>
                    </li>
                    <div className="divider my-0"></div>
                    <li>
                        <button 
                            onClick={() => {
                                toast.dismiss(); // Dismiss any existing toasts
                                logOut();
                            }}
                            className="py-3 text-error font-medium hover:bg-error/10 hover:text-error"
                        >
                            <FiLogOut size={16} /> Logout
                        </button>
                    </li>
                </ul>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
