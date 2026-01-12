import { useQuery } from "@tanstack/react-query";
import {
  FiUsers,
  FiDollarSign,
  FiBarChart2,
  FiPlus,
  FiList,
  FiCheckCircle,
  FiPieChart,
} from "react-icons/fi";
import { 
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from "recharts";
import { Link } from "react-router";
import moment from "moment";
import { motion } from "framer-motion";

import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";

/* DATA HOOK */
const useAdminOverview = () => {
  const axiosSecure = useAxiosSecure();

  const { data: statusStats = [], isLoading: isLoadingStatus } = useQuery({
    queryKey: ["adminBookingsStatus"],
    queryFn: async () =>
      (await axiosSecure.get("/dashboard/admin/bookings-status")).data,
  });

  const {
    data: revenueData = { totalRevenue: 0 },
    isLoading: isLoadingRevenue,
  } = useQuery({
    queryKey: ["adminRevenue"],
    queryFn: async () =>
      (await axiosSecure.get("/dashboard/admin/revenue")).data,
  });

  const { totalRevenue } = revenueData;

  const { data: allBookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ["allBookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings");
      return res?.data?.bookings;
    },
  });

  const { data: allDecorators = [], isLoading: isLoadingDecorators } = useQuery(
    {
      queryKey: ["allDecorators"],
      queryFn: async () => {
        const res = await axiosSecure.get("/decorators");
        return res.data?.decorators;
      },
    }
  );
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data?.users;
    },
  });
  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ["services-count"],
    queryFn: async () => {
      const res = await axiosSecure.get("/services");
      return res.data.services;
    },
  });

  const totalUsers = users.length;
  // Calculate Role Distribution
  const roleStats = [
      { name: 'Clients', value: users.filter(u => u.role === 'user').length },
      { name: 'Decorators', value: users.filter(u => u.role === 'decorator').length },
      { name: 'Admins', value: users.filter(u => u.role === 'admin').length },
  ].filter(i => i.value > 0);

  const totalServices = 12;

  const totalBookings = statusStats.reduce((s, i) => s + i.count, 0);

  const pendingDecoratorCount = allDecorators.filter(
    (d) => d.status === "pending"
  ).length;

  const pendingBookings = allBookings
    .filter((b) => b.paymentStatus === "paid" && b.status === "pending")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return {
    totalRevenue,
    totalUsers,
    totalServices,
    totalBookings,
    pendingDecoratorCount,
    pendingBookings,
    allBookings,
    roleStats,
    isLoading:
      isLoadingStatus ||
      isLoadingRevenue ||
      isLoadingBookings ||
      isLoadingDecorators ||
      isLoadingUsers ||
      isLoadingServices,
  };
};

/* COMPONENT  */

const colorMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info",
    error: "bg-error/10 text-error",
};

const MetricCard = ({ icon, title, value, color, gradient, borderColor }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 }
    }}
    className={`card bg-gradient-to-br ${gradient} backdrop-blur-md shadow-xl p-6 border ${borderColor} hover:shadow-2xl transition-all duration-300 group`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-base-content/60 font-medium text-xs uppercase tracking-wider mb-2 group-hover:text-base-content/80 transition-colors">{title}</p>
        <h3 className="text-3xl font-bold text-base-content">{value}</h3>
      </div>
      <div className={`p-3 rounded-2xl ${colorMap[color] || colorMap.primary} text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const QuickLink = ({ to, icon, title, desc, bgClass }) => (
  <Link
    to={to}
    className={`card ${bgClass} hover:bg-base-100 transition-all duration-300 shadow-lg hover:shadow-2xl border border-base-200 p-8 text-center group relative overflow-hidden`}
  >
    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
        <span className="text-primary text-3xl">{icon}</span>
    </div>
    <h3 className="font-bold text-xl text-primary mb-2">{title}</h3>
    <p className="text-sm text-base-content/70">{desc}</p>
  </Link>
);

const AdminDashboardHome = () => {
  const {
    totalRevenue,
    totalUsers,
    totalBookings,
    pendingDecoratorCount,
    pendingBookings,
    allBookings,
    roleStats,
    isLoading,
  } = useAdminOverview();

  const fullPendingCount = allBookings.filter(
    (b) => b.paymentStatus === "paid" && b.status === "pending"
  ).length;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE'];

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-base-100/50">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-extrabold text-primary mb-2">
          Admin Dashboard Overview 👑
        </h2>
        <p className="text-base-content/70">
          Welcome back, Administrator. Here is what's happening today.
        </p>
      </motion.div>

      {/*  METRICS */}
      {isLoading ? (
        <LoadingSpinner type="stats" count={4} />
      ) : (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
        >
          <MetricCard
            icon={<FiDollarSign />}
            title="Total Revenue"
            value={`${totalRevenue.toLocaleString()} BDT`}
            color="success"
            gradient="from-green-500/10 to-green-500/5"
            borderColor="border-green-500/30"
          />
          <MetricCard
            icon={<FiCheckCircle />}
            title="Pending Assignments"
            value={pendingBookings.length}
            color="warning"
            gradient="from-yellow-500/10 to-yellow-500/5"
             borderColor="border-yellow-500/30"
          />
          <MetricCard
            icon={<FiUsers />}
            title="Total Users"
            value={totalUsers}
            color="info"
            gradient="from-blue-500/10 to-blue-500/5"
             borderColor="border-blue-500/30"
          />
          <MetricCard
            icon={<FiBarChart2 />}
            title="Total Bookings"
            value={totalBookings}
            color="error"
            gradient="from-red-500/10 to-red-500/5"
             borderColor="border-red-500/30"
          />
        </motion.div>
      )}

      {/* CHARTS SECTION */}
      {!isLoading && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
        >
            {/* User Distribution Chart */}
            <div className="lg:col-span-1 bg-base-100 p-6 rounded-3xl shadow-xl border border-base-200 flex flex-col items-center justify-center">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2 w-full">
                    <FiPieChart className="text-accent" /> User Distribution
                </h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={roleStats}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {roleStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip 
                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                itemStyle={{ color: '#1f2937' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Actions (Moved here for layout balance) */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <QuickLink
                    to="/dashboard/manage-services"
                    icon={<FiPlus />}
                    title="Create Service"
                    desc="Add a new decoration package."
                    bgClass="bg-base-200/50"
                />
                
                <Link
                to="/dashboard/manage-decorators"
                className="card bg-base-200/50 hover:bg-base-100 transition-all duration-300 shadow-lg hover:shadow-2xl border border-base-200 p-8 text-center relative group"
                >
                {pendingDecoratorCount > 0 && (
                    <span className="badge badge-error absolute top-4 right-4 animate-pulse">
                    {pendingDecoratorCount}
                    </span>
                )}
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
                    <FiList className="text-accent text-3xl" />
                </div>
                <h3 className="font-bold text-xl text-accent mb-2">Manage Decorators</h3>
                <p className="text-sm text-base-content/70">Approve accounts or update roles.</p>
                </Link>

                 <div className="md:col-span-2"> 
                    <Link
                        to="/dashboard/analytics"
                        className="card overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 p-6 shadow-xl hover:shadow-2xl transition-all relative border border-primary/20 group"
                    >
                         <div className="flex items-center justify-between relative z-10">
                            <div>
                                <h3 className="text-2xl font-bold mb-1 text-primary">Analytics Hub</h3>
                                <p className="text-base-content/70">View comprehensive reports & charts</p>
                            </div>
                            <FiBarChart2 className="text-4xl text-primary/50 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    </Link>
                 </div>
            </div>
        </motion.div>
      )}



      {/* PENDING BOOKINGS SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden"
      >
        <div className="p-6 border-b border-base-200/50 flex items-center gap-3 bg-base-200/30">
           <div className="p-2 bg-warning/10 rounded-lg">
              <FiCheckCircle className="text-warning text-xl" />
           </div>
           <h3 className="text-lg font-bold text-base-content">
            New Paid Bookings Needing Assignment
           </h3>
        </div>

        {isLoading ? (
             <LoadingSpinner type="table" count={5} className="border-none" />
        ) : pendingBookings.length === 0 ? (
          <div className="text-center py-10 bg-base-100">
             <p className="text-success font-medium">All paid bookings have been assigned! 🎉</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-base-200/50">
                  <tr>
                    <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 pl-6">Service</th>
                    <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Email</th>
                    <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Date</th>
                    <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Amount</th>
                    <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none">
                      <td className="pl-6 font-semibold">{b.service_name}</td>
                      <td className="text-base-content/70">{b.userEmail}</td>
                      <td>
                         <span className="badge badge-ghost badge-sm">{moment(b.date).format("MMM DD")}</span>
                      </td>
                      <td className="font-mono text-primary font-bold">{b.cost.toLocaleString()} BDT</td>
                      <td>
                        <Link
                          to="/dashboard/manage-bookings"
                          className="btn btn-sm btn-warning gap-2"
                        >
                          Assign <FiCheckCircle />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden p-4">
                {pendingBookings.map((b) => (
                  <div key={b._id} className="bg-base-100 p-5 rounded-xl border border-base-200 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-bold text-lg">{b.service_name}</p>
                      <span className="badge badge-primary badge-outline font-mono h-8 font-bold">
                        {b.cost.toLocaleString()} <span>BDT</span>
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-base-content/70 mb-4">
                        <p>User: <span className="text-base-content">{b.userEmail}</span></p>
                        <p>Date: <span className="text-base-content">{moment(b.date).format("MMM DD, YYYY")}</span></p>
                    </div>
                    <Link
                      to="/dashboard/manage-bookings"
                      className="btn btn-warning btn-sm w-full"
                    >
                      Assign Decorator
                    </Link>
                  </div>
                ))}
            </div>

            {fullPendingCount > 5 && (
              <div className="text-center p-4 bg-base-200/30 border-t border-base-200">
                <Link
                  to="/dashboard/manage-bookings"
                  className="btn btn-ghost btn-sm text-primary"
                >
                  View all {fullPendingCount} pending bookings →
                </Link>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboardHome;
