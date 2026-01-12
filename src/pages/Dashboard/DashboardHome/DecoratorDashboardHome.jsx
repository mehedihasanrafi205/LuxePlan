import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FiCalendar, FiCheckCircle, FiClock, FiDollarSign, FiTrendingUp } from "react-icons/fi"; 
import { 
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";
import moment from "moment";
import { motion } from "framer-motion";
import { Link } from 'react-router'; 

const useDecoratorDashboardData = (userEmail) => {
  const axiosSecure = useAxiosSecure();

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["decoratorProjects", userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/decorator/projects");
      return res.data;
    },
    enabled: !!userEmail,
  });

  const { data: todaySchedule = [], isLoading: isLoadingSchedule } = useQuery({
    queryKey: ["decoratorTodaySchedule", userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/decorator/today");
      return res.data;
    },
    enabled: !!userEmail,
  });

  const {
    data: earningsData = { totalEarnings: 0 },
    isLoading: isLoadingEarnings,
  } = useQuery({
    queryKey: ["decoratorEarnings", userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/decorator/earnings");
      return res.data; 
    },
    enabled: !!userEmail,
  });

  const { data: earningsHistory = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ["decoratorEarningsHistory", userEmail],
    queryFn: async () => {
        const res = await axiosSecure.get("/dashboard/decorator/monthly-earnings");
        return res.data;
    },
    enabled: !!userEmail
  });

  const completedProjects = projects.filter(
    (p) => p.status === "completed"
  ).length;

  const activeProjects = projects.length - completedProjects;

  return {
    projects,
    todaySchedule,
    totalEarnings: earningsData.totalEarnings,
    earningsHistory,
    totalProjects: projects.length,
    completedProjects,
    activeProjects,
    isLoading: isLoadingProjects || isLoadingSchedule || isLoadingEarnings || isLoadingHistory,
  };
};

/* COMPONENT */

const colorMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info",
    error: "bg-error/10 text-error",
    purple: "bg-purple-500/10 text-purple-500",
};

const MetricCard = ({ icon, title, value, color, gradient, borderColor }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
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

const DecoratorDashboardHome = () => {
  const { user } = useAuth();
  const userName = user?.displayName || "Decorator";
  const userEmail = user?.email;

  const {
    projects,
    todaySchedule,
    totalEarnings,
    earningsHistory,
    totalProjects,
    completedProjects,
    isLoading,
  } = useDecoratorDashboardData(userEmail);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-success bg-success/10 border border-success/20";
      case "pending":
         return "text-warning bg-warning/10 border border-warning/20";  
      case "assigned":
      case "planning":
        return "text-info bg-info/10 border border-info/20";
      default:
        return "text-base-content/60 bg-base-200";
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-base-100/50">
      <motion.div
         initial={{ opacity: 0, x: -20 }}
         animate={{ opacity: 1, x: 0 }}
         className="mb-8"
      >
        <h2 className="text-3xl font-extrabold text-primary mb-2">
          Welcome Back, {userName.split(" ")[0]} 👋
        </h2>
        <p className="text-base-content/70">
          Manage your schedule and track your career progress.
        </p>
      </motion.div>

      <hr className="my-8 border-base-300/50" />

      <h3 className="text-xl font-bold mb-6 text-base-content/90 flex items-center gap-2">
         <FiDollarSign className="text-green-500" /> Performance Overview
      </h3>
      
      {isLoading ? (
          <LoadingSpinner type="stats" count={3} />
      ) : (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <MetricCard
                icon={<span className="text-success font-bold text-2xl">৳</span>}
                title="Total Lifetime Earnings"
                value={`${totalEarnings.toLocaleString()} BDT`}
                color="success"
                gradient="from-green-500/10 to-green-500/5"
                borderColor="border-green-500/30"
                />
                <MetricCard
                icon={<FiCalendar />}
                title="Total Assigned Projects"
                value={totalProjects}
                color="primary"
                gradient="from-blue-500/10 to-blue-500/5"
                borderColor="border-blue-500/30"
                />
                <MetricCard
                icon={<FiCheckCircle />}
                title="Projects Completed"
                value={completedProjects}
                color="purple"
                gradient="from-purple-500/10 to-purple-500/5"
                borderColor="border-purple-500/30"
                />
            </div>

            {/* Earnings Chart Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-base-100 p-6 rounded-2xl shadow-xl border border-base-200 mb-8"
            >
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <FiTrendingUp className="text-success" /> Monthly Earnings History
                </h3>
                <div className="h-72 w-full flex items-center justify-center">
                    {earningsHistory.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={earningsHistory}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => `${value/1000}k`} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value) => [`${value} BDT`, "Earnings"]}
                                    cursor={{fill: 'transparent'}}
                                />
                                <Bar dataKey="earnings" fill="#36d399" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center text-base-content/40">
                             <FiDollarSign className="text-4xl mx-auto mb-2 opacity-50" />
                             <p>No earnings history available yet.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
      )}

      {/* SCHEDULE & PROJECTS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* TODAY'S SCHEDULE */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-xl font-bold flex items-center gap-2">
                <FiClock className="text-accent" /> Today's Schedule
             </h3>
             <Link to="/dashboard/todays-schedule" className="btn btn-xs btn-ghost text-primary text-xs hover:bg-primary/10">View All</Link>
          </div>

          <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 flex-1 min-h-[300px] overflow-hidden">
            {isLoading ? (
                <LoadingSpinner type="list" count={3} />
            ) : todaySchedule.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-70">
                 <FiCalendar className="text-4xl mb-2 text-base-content/30" />
                 <p className="font-semibold text-lg">No projects scheduled for today.</p>
                 <span className="text-xs text-base-content/60">Enjoy your day off! 🌴</span>
              </div>
            ) : (
              <ul className="divide-y divide-base-200">
                {todaySchedule.map((project, index) => (
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={project._id}
                    className="p-5 hover:bg-base-200/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-lg group-hover:text-primary transition-colors">{project.service_name}</p>
                        <p className="text-sm text-base-content/60 flex items-center gap-1">
                             <span className="w-2 h-2 rounded-full bg-accent"></span>
                             {project.location}
                        </p>
                      </div>
                      <span className="badge badge-lg badge-primary badge-outline font-mono shadow-sm">
                        {project.time}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                       <p className="text-xs font-medium text-base-content/50 uppercase tracking-wide">Client: {project.userName}</p>
                       <span
                        className={`text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider ${getStatusColor(
                            project.status
                        )}`}
                        >
                        {project.status.replace(/_/g, " ")}
                        </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>

        {/* RECENT PROJECTS */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <FiCalendar className="text-secondary" /> Recent Projects
            </h3>
            <Link to="/dashboard/assigned-projects" className="btn btn-xs btn-ghost text-primary text-xs hover:bg-primary/10">View All</Link>
          </div>

          <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 flex-1 min-h-[300px] p-5">
             {isLoading ? (
                <LoadingSpinner type="list" count={3} />
            ) : projects.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-70">
                 <p className="font-medium">No projects assigned yet.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {projects.slice(0, 5).map((project, index) => (
                  <motion.li
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    key={project._id}
                    className="flex items-center gap-4 bg-base-200/50 p-4 rounded-xl border border-base-200 hover:border-primary/20 hover:shadow-md transition-all group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-base-100 flex flex-col items-center justify-center border border-base-200 shadow-sm group-hover:scale-105 transition-transform">
                         <span className="text-[10px] font-bold uppercase text-base-content/40 tracking-wider">{moment(project.date).format("MMM")}</span>
                         <span className="text-xl font-extrabold text-primary leading-none">{moment(project.date).format("DD")}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-base-content truncate group-hover:text-primary transition-colors">{project.service_name}</p>
                        <p className="text-xs text-base-content/50 truncate max-w-[200px]">{project.location}</p>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status.replace(/_/g, " ")}
                    </span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DecoratorDashboardHome;
