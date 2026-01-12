import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiLoader, FiChevronLeft, FiChevronRight, FiDollarSign, FiCalendar, FiActivity } from "react-icons/fi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";

const EarningsPage = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // 1. Fetch Paginated Data for Table
  const {
    data: earningsData = {},
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["completed", user?.email, currentPage, itemsPerPage],
    queryFn: async () => {
      const res = await axiosSecure.get(`/booking/completed`, {
        params: {
          decoratorEmail: user?.email,
          page: currentPage,
          size: itemsPerPage,
        },
      });
      return res.data;
    },
    enabled: !!user?.email,
    keepPreviousData: true,
  });

  // 2. Fetch All Data for Chart (Limit to 100 for performance)
  const { data: chartDataRaw = {} } = useQuery({
    queryKey: ["completedAll", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/booking/completed`, {
        params: {
          decoratorEmail: user?.email,
          page: 1,
          size: 100, // Fetch recent 100 for chart
        },
      });
      return res.data;
    },
    enabled: !!user?.email,
  });

  const projects = earningsData.projects || [];
  const totalCount = earningsData.count || 0;
  const totalEarnings = earningsData.totalEarnings || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const calculatePayout = (project) => project.cost * 0.8;

  // Process Chart Data
  const chartData = useMemo(() => {
    const rawProjects = chartDataRaw.projects || [];
    if (!rawProjects.length) return [];

    // Group by Date (YYYY-MM-DD)
    const grouped = rawProjects.reduce((acc, curr) => {
      const date = moment(curr.date).format("MMM DD");
      const payout = calculatePayout(curr);
      if (!acc[date]) acc[date] = 0;
      acc[date] += payout;
      return acc;
    }, {});

    // Convert to Array and Sort by Date (simplified, assuming data comes somewhat sorted or we trust moment parsing)
    // For specific sorting we'd need full date objects.
    
    return Object.entries(grouped).map(([date, amount]) => ({
      date,
      amount
    })).reverse(); // Assuming API returns newest first, we want oldest first for chart? 
    // Actually typically charts go Left->Right (Old->New). 
    // If API returns Newest First, we reverse.
  }, [chartDataRaw]);


  // PAGINATION HANDLERS
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = [...Array(totalPages).keys()].map((i) => i + 1);
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-300/90 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-xl">
          <p className="font-bold text-xs text-base-content/70 mb-1">{label}</p>
          <p className="text-success font-bold text-lg">
            ৳ {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 bg-base-100/50">
      
      <motion.div
         initial={{ opacity: 0, x: -20 }}
         animate={{ opacity: 1, x: 0 }}
         className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4"
      >
        <div>
            <h1 className="text-3xl font-extrabold text-primary mb-2 flex items-center gap-2">
                <FiDollarSign className="bg-primary/10 p-1 rounded-lg text-4xl" /> My Earnings
            </h1>
            <p className="text-base-content/70">Track your income and financial growth.</p>
        </div>
        
        <div className="bg-base-100 p-4 rounded-2xl border border-base-200 shadow-lg flex items-center gap-4">
             <div className="bg-green-500/10 p-3 rounded-full text-green-500">
                <FiActivity className="text-2xl" />
             </div>
             <div>
                 <p className="text-xs font-bold uppercase text-base-content/50">Total Earned</p>
                 <p className="text-2xl font-bold text-success">৳ {totalEarnings.toLocaleString()}</p>
             </div>
        </div>
      </motion.div>

      {/* CHART SECTION */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.1 }}
         className="bg-base-100 border border-base-200 p-6 rounded-3xl shadow-xl mb-12 relative overflow-hidden"
      >
          <h3 className="text-lg font-bold mb-6 text-base-content/80 flex items-center gap-2">
            <FiActivity /> Earnings Trend (Recent)
          </h3>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
              </AreaChart>
             </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-base-content/30 italic">
                    Not enough data for chart
                </div>
            )}
          </div>
      </motion.div>

      {/* RECENT EARNINGS LIST */}
      <div>
        <h3 className="text-xl font-bold mb-6 text-base-content flex items-center gap-2">
             <FiCalendar /> Recent Transactions
        </h3>

        {projects.length === 0 && !isLoading ? (
            <div className="text-center py-12 bg-base-100 rounded-2xl border border-dashed border-base-300">
                <FiDollarSign className="mx-auto text-4xl text-base-content/20 mb-2" />
                <p className="text-base-content/50">No earnings records found.</p>
            </div>
        ) : (
            <>
            {/* MOBILE CARDS VIEW */}
            <div className={`space-y-4 md:hidden`}>
                {isLoading ? (
                    <LoadingSpinner type="card" count={3} />
                ) : (
                    projects.map((project, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={project._id}
                        className="bg-base-100 border border-base-200 rounded-2xl p-5 shadow-sm relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-lg">{project.service_name}</h3>
                                <p className="text-xs text-base-content/50">{moment(project.date).format("MMM DD, YYYY")}</p>
                            </div>
                            <span className={`badge ${project.status === "completed" ? "badge-success badge-outline" : "badge-warning"}`}>
                                {project.status.replace(/_/g, " ")}
                            </span>
                        </div>

                        <div className="flex items-center justify-between mt-4 bg-base-200/50 p-3 rounded-xl">
                            <div>
                                <p className="text-xs font-bold uppercase text-base-content/50">Project Cost</p>
                                <p className="font-mono text-base-content">৳ {project.cost.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold uppercase text-success/70">Your Payout</p>
                                <p className="font-mono text-xl font-bold text-success">৳ {calculatePayout(project).toLocaleString()}</p>
                            </div>
                        </div>
                    </motion.div>
                    ))
                )}
            </div>

            {/* DESKTOP TABLE VIEW */}
            <div className={`hidden md:block bg-base-100 rounded-2xl overflow-hidden shadow-xl border border-base-200`}>
                {isLoading ? (
                    <LoadingSpinner type="table" count={5} className="border-none" />
                ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-base-200/50">
                            <tr>
                                <th className="py-4 pl-6 text-xs font-bold uppercase text-base-content/50">#</th>
                                <th className="py-4 text-xs font-bold uppercase text-base-content/50">Project</th>
                                <th className="py-4 text-xs font-bold uppercase text-base-content/50">Client</th>
                                <th className="py-4 text-xs font-bold uppercase text-base-content/50">Date</th>
                                <th className="py-4 text-xs font-bold uppercase text-base-content/50">Cost (BDT)</th>
                                <th className="py-4 text-xs font-bold uppercase text-success">Payout (BDT)</th>
                                <th className="py-4 text-xs font-bold uppercase text-base-content/50">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project, index) => (
                            <tr key={project._id} className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none">
                                <td className="pl-6 font-mono text-base-content/50">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td className="font-bold">{project.service_name}</td>
                                <td className="text-sm text-base-content/70">{project.userEmail}</td>
                                <td><span className="badge badge-ghost badge-sm">{moment(project.date).format("MMM DD, YYYY")}</span></td>
                                <td className="font-mono opacity-70">{project.cost.toLocaleString()}</td>
                                <td className="font-mono font-bold text-success text-lg">{calculatePayout(project).toLocaleString()}</td>
                                <td>
                                    <span className={`badge ${project.status === "completed" ? "badge-success badge-outline" : "badge-warning badge-outline"} font-bold text-xs uppercase`}>
                                        {project.status.replace(/_/g, " ")}
                                    </span>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
            </div>
            </>
        )}

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && !isLoading && (
            <div className="flex justify-center mt-8">
            <div className="join shadow-sm">
                <button
                className="join-item btn btn-sm btn-ghost"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                >
                <FiChevronLeft />
                </button>
                {pageNumbers.map((page) => (
                <button
                    key={page}
                    className={`join-item btn btn-sm ${currentPage === page ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </button>
                ))}
                <button
                className="join-item btn btn-sm btn-ghost"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                >
                <FiChevronRight />
                </button>
            </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default EarningsPage;
