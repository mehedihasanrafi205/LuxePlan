import { useQuery } from "@tanstack/react-query";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from "recharts";
import {
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiClock,
  FiTrendingUp
} from "react-icons/fi";
import moment from "moment";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { motion } from "framer-motion";

// Data Hook
const useUserDashboard = (userEmail) => {
  const axiosSecure = useAxiosSecure();

  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ["userBookings", userEmail],
    queryFn: async () =>
      (await axiosSecure.get("/dashboard/user/bookings")).data,
    enabled: !!userEmail,
  });

  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ["userPayments", userEmail],
    queryFn: async () =>
      (await axiosSecure.get("/dashboard/user/payments")).data,
    enabled: !!userEmail,
  });

  const { data: spendingData = [], isLoading: isLoadingSpending } = useQuery({
    queryKey: ["userMonthlySpending", userEmail],
    queryFn: async () =>
        (await axiosSecure.get("/dashboard/user/monthly-spending")).data,
    enabled: !!userEmail,
  });

  const completedBookings = bookings.filter(
    (b) => b.status === "completed"
  ).length;
  const activeBookings = bookings.filter(
    (b) => b.status !== "completed" && b.status !== "cancelled"
  ).length;

  return {
    bookings,
    payments,
    spendingData,
    totalBookings: bookings.length,
    completedBookings,
    activeBookings,
    isLoading: isLoadingBookings || isLoadingPayments || isLoadingSpending,
  };
};

/* COMPONENT */

const colorMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info",
    error: "bg-error/10 text-error",
};

const MetricCard = ({ icon, title, value, color, gradient, borderColor }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
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

const UserDashboardHome = () => {
  const { user } = useAuth();
  const userEmail = user?.email;
  const userName = user?.displayName || "Client";

  const {
    totalBookings,
    completedBookings,
    activeBookings,
    payments,
    spendingData,
    isLoading,
  } = useUserDashboard(userEmail);

  if (!userEmail) {
    return (
      <div className="p-8 text-center text-error">
        Please log in to view your dashboard.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-base-100/50">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2 className="text-3xl font-extrabold text-primary mb-2">
            Welcome Back, {userName.split(" ")[0]} 👋
        </h2>
        <p className="text-base-content/70 mb-8">
            Review your bookings and payment history.
        </p>
      </motion.div>
      
      {isLoading ? (
           <LoadingSpinner type="stats" count={3} />
      ) : (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <MetricCard
                icon={<FiCalendar />}
                title="Total Bookings"
                value={totalBookings}
                color="primary"
                gradient="from-blue-500/10 to-blue-500/5"
                borderColor="border-blue-500/30"
                />
                <MetricCard
                icon={<FiCheckCircle />}
                title="Completed Projects"
                value={completedBookings}
                color="success"
                gradient="from-green-500/10 to-green-500/5"
                borderColor="border-green-500/30"
                />
                <MetricCard
                icon={<FiXCircle />}
                title="Active Projects"
                value={activeBookings}
                color="warning"
                gradient="from-yellow-500/10 to-yellow-500/5"
                borderColor="border-yellow-500/30"
                />
            </div>

            {/* Spending Chart Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-base-100 p-6 rounded-2xl shadow-xl border border-base-200 mb-8"
            >
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <FiTrendingUp className="text-primary" /> Monthly Spending Trends
                </h3>
                <div className="h-72 w-full flex items-center justify-center">
                    {spendingData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={spendingData}>
                                <defs>
                                    <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => `${value/1000}k`} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value) => [`${value} BDT`, "Spending"]}
                                />
                                <Area type="monotone" dataKey="spending" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorSpending)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center text-base-content/40">
                             <FiDollarSign className="text-4xl mx-auto mb-2 opacity-50" />
                             <p>No enough data to show spending trends.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
      )}

      <hr className="my-8 border-base-300/50" />

      {/*  Recent Payments  */}
      <motion.div 
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.2 }}
         className="bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden"
      >
        <div className="p-6 border-b border-base-200/50 bg-base-200/30">
            <h3 className="text-xl font-bold text-base-content/90 flex items-center gap-2">
                <FiDollarSign className="text-success" /> Recent Payment History
            </h3>
        </div>

        {isLoading ? (
             <LoadingSpinner type="table" count={5} className="border-none" />
        ) : payments.length === 0 ? (
             <div className="text-center py-12 text-base-content/50">
                 <p>No payment records found.</p>
             </div>
        ) : (
            <>
                <div className="grid grid-cols-1 gap-4 md:hidden p-4">
                    {payments.slice(0, 5).map((p) => (
                    <div key={p._id} className="bg-base-100 p-5 shadow-sm rounded-xl border border-base-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-success/5 rounded-bl-full -mr-8 -mt-8"></div>
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-lg">{p.serviceName}</p>
                            <span className="text-success font-bold font-mono text-lg bg-success/10 px-2 py-1 rounded">
                                {p.amount.toLocaleString()} ৳
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-base-content/50">
                            Ref: <span className="font-mono bg-base-200 px-1 rounded">{p.transactionId.substring(0, 8)}...</span>
                            </p>
                            <p className="text-xs text-base-content/50">
                            Date: {moment(p.paidAt).format("MMM DD, YYYY")}
                            </p>
                        </div>
                    </div>
                    ))}
                </div>

                <div className="hidden md:block overflow-x-auto">
                    <table className="table w-full text-sm">
                        <thead className="bg-base-200/50">
                        <tr>
                            <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 pl-6">Service Name</th>
                            <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Amount</th>
                            <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Transaction ID</th>
                            <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Payment Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {payments.slice(0, 5).map((payment) => (
                            <tr key={payment._id} className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none">
                            <td className="pl-6 font-bold">{payment.serviceName}</td>
                            <td>
                                <span className="badge badge-success badge-outline font-bold font-mono text-xs">
                                {payment.amount.toLocaleString()} BDT
                                </span>
                            </td>
                            <td className="font-mono text-base-content/70 text-xs bg-base-200/50 px-2 py-1 rounded w-fit">{payment.transactionId}</td>
                            <td className="text-base-content/70">{moment(payment.paidAt).format("MMMM DD, YYYY")}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}
      </motion.div>
    </div>
  );
};

export default UserDashboardHome;
