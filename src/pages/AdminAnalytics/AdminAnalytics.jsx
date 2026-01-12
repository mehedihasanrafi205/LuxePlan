import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
    BarChart, Bar, Cell, PieChart, Pie, Legend, ComposedChart, Line 
} from 'recharts';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiDollarSign, FiActivity, FiPieChart, FiBarChart2, FiLayers } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';

const ActivityOverviewChart = ({ axiosSecure }) => {
    const [timeRange, setTimeRange] = useState('12w'); // 7d, 12w, 12m
    const [chartType, setChartType] = useState('line'); // line, bar

    // Fetch Activity Stats
    const { data, isLoading } = useQuery({
        queryKey: ['admin-activity-stats', timeRange],
        queryFn: async () => {
            const res = await axiosSecure.get(`/dashboard/admin/activity-stats?range=${timeRange}`);
            return res.data;
        }
    });

    const timelineData = data?.timeline || [];
    const totals = data?.totals || { bookings: 0, assigned: 0, completed: 0 };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="w-full bg-base-100 rounded-3xl p-6 shadow-xl border border-base-200"
        >
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 text-base-content">
                        <FiLayers className="text-primary" /> Activity Overview
                    </h2>
                    <p className="text-sm text-base-content/60 mt-1">Activity trends over time</p>
                </div>
                
                <div className="flex items-center gap-4 bg-base-200/50 p-1.5 rounded-xl border border-base-200">
                    <div className="flex gap-1">
                        {['7d', '12w', '12m'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                    timeRange === range 
                                        ? 'bg-white text-primary shadow-sm' 
                                        : 'text-base-content/60 hover:text-base-content hover:bg-base-200'
                                }`}
                            >
                                {range.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <div className="w-px h-6 bg-base-300 mx-1"></div>
                    <div className="flex gap-1">
                         <button
                            onClick={() => setChartType('line')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                chartType === 'line' 
                                    ? 'bg-white text-primary shadow-sm' 
                                    : 'text-base-content/60 hover:text-base-content hover:bg-base-200'
                            }`}
                        >
                            Line
                        </button>
                        <button
                            onClick={() => setChartType('bar')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                chartType === 'bar' 
                                    ? 'bg-white text-primary shadow-sm' 
                                    : 'text-base-content/60 hover:text-base-content hover:bg-base-200'
                            }`}
                        >
                            Bar
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                 <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all">
                     <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                     <h3 className="text-4xl font-extrabold text-primary mb-1">{totals.bookings}</h3>
                     <p className="text-xs font-bold text-primary/60 tracking-wider uppercase">Jobs Posted</p>
                 </div>
                 
                 <div className="bg-secondary/5 border border-secondary/10 p-5 rounded-2xl relative overflow-hidden group hover:border-secondary/30 transition-all">
                     <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
                     <h3 className="text-4xl font-extrabold text-secondary mb-1">{totals.assigned}</h3>
                     <p className="text-xs font-bold text-secondary/60 tracking-wider uppercase">Tasks Accepted</p>
                 </div>

                 <div className="bg-accent/5 border border-accent/10 p-5 rounded-2xl relative overflow-hidden group hover:border-accent/30 transition-all">
                     <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
                      <h3 className="text-4xl font-extrabold text-accent mb-1">{totals.completed}</h3>
                     <p className="text-xs font-bold text-accent/60 tracking-wider uppercase">Activity Completed</p>
                 </div>
            </div>

            {/* Chart Area */}
            <div className="h-[400px] w-full">
                {isLoading ? (
                     <div className="h-full w-full flex items-center justify-center">
                         <span className="loading loading-spinner text-primary"></span>
                     </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-base-content/10" />
                             <XAxis 
                                dataKey="_id" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#9ca3af', fontSize: 11}} 
                                dy={10}
                             />
                             <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#9ca3af', fontSize: 11}} 
                             />
                             <RechartsTooltip 
                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                itemStyle={{ color: '#1f2937' }}
                                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                             />
                             
                             {/* Chart Graphics */}
                             {chartType === 'line' ? (
                                <>
                                    <Line type="monotone" dataKey="bookings" name="Jobs" stroke="#D4AF37" strokeWidth={3} dot={{r: 0}} activeDot={{r: 6}} />
                                    <Line type="monotone" dataKey="assigned" name="Tasks" stroke="#00C49F" strokeWidth={3} dot={{r: 0}} activeDot={{r: 6}} />
                                    <Line type="monotone" dataKey="completed" name="Activity" stroke="#FF8042" strokeWidth={3} dot={{r: 0}} activeDot={{r: 6}} strokeDasharray="5 5" />
                                </>
                             ) : (
                                <>
                                    <Bar dataKey="bookings" name="Jobs" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={12} />
                                    <Bar dataKey="assigned" name="Tasks" fill="#00C49F" radius={[4, 4, 0, 0]} barSize={12} />
                                    <Bar dataKey="completed" name="Activity" fill="#FF8042" radius={[4, 4, 0, 0]} barSize={12} />
                                </>
                             )}

                             <Legend 
                                verticalAlign="bottom" 
                                height={36} 
                                iconType="plainline"
                                formatter={(value) => <span className="text-base-content/60 font-medium">{value}</span>}
                             />
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
};

const AdminAnalytics = () => {
    const axiosSecure = useAxiosSecure();

    // 1. Fetch Monthly Stats (Revenue & Bookings Trend)
    const { data: monthlyStats = [], isLoading: loadingMonthly } = useQuery({
        queryKey: ['admin-monthly-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/dashboard/admin/monthly-stats');
            return res.data;
        }
    });

    // 2. Fetch Booking Status Distribution
    const { data: bookingStatusStats = [], isLoading: loadingStatus } = useQuery({
        queryKey: ['admin-booking-status'],
        queryFn: async () => {
            const res = await axiosSecure.get('/dashboard/admin/bookings-status');
            return res.data;
        }
    });

    // 3. Fetch Service Demand
    const { data: serviceDemand = [], isLoading: loadingDemand } = useQuery({
        queryKey: ['admin-service-demand'],
        queryFn: async () => {
            const res = await axiosSecure.get('/dashboard/admin/services-demand');
            return res.data;
        }
    });

    // 4. Fetch Revenue by Service
    const { data: revenueByService = [], isLoading: loadingRevService } = useQuery({
        queryKey: ['admin-revenue-service'],
        queryFn: async () => {
            const res = await axiosSecure.get('/dashboard/admin/revenue-by-service');
            return res.data;
        }
    });

    const isLoading = loadingMonthly || loadingStatus || loadingDemand || loadingRevService;

    // Derived Stats
    const totalRevenue = monthlyStats.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalBookings = monthlyStats.reduce((acc, curr) => acc + curr.bookings, 0);
    
    // Chart Colors
    const COLORS = ['#D4AF37', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-100/50 px-4 md:px-8 py-10">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header Skeleton */}
                    <div className="space-y-3 animate-pulse">
                         <div className="h-10 w-64 bg-base-300 rounded-lg"></div>
                         <div className="h-4 w-96 bg-base-300 rounded"></div>
                    </div>

                    {/* KPI Cards Skeleton */}
                    <LoadingSpinner type="stats" count={3} className="grid-cols-1 md:grid-cols-3" />

                    {/* Charts Section 1 Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <LoadingSpinner type="chart" />
                        <LoadingSpinner type="chart" />
                    </div>

                    {/* Charts Section 2 Skeleton */}
                     <LoadingSpinner type="chart" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100/50 px-4 md:px-8 py-10">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
                        Analytics Overview
                    </h1>
                    <p className="text-base-content/60">Monitor performance, revenue trends, and service popularity.</p>
                </motion.div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-base-100 p-6 rounded-3xl shadow-xl border border-base-200 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FiDollarSign className="text-8xl text-primary" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                <FiDollarSign className="text-2xl" />
                            </div>
                            <span className="font-bold text-base-content/60 uppercase tracking-wider text-xs">Total Revenue</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-base-content">
                            ${totalRevenue.toLocaleString()}
                        </h2>
                        <p className="text-xs text-success mt-2 font-medium flex items-center gap-1">
                            <FiTrendingUp /> +12.5% vs last month
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-base-100 p-6 rounded-3xl shadow-xl border border-base-200 relative overflow-hidden group"
                    >
                         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FiActivity className="text-8xl text-secondary" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                                <FiActivity className="text-2xl" />
                            </div>
                            <span className="font-bold text-base-content/60 uppercase tracking-wider text-xs">Total Bookings</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-base-content">
                            {totalBookings}
                        </h2>
                         <p className="text-xs text-base-content/50 mt-2">
                            Across all services
                        </p>
                    </motion.div>

                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-base-100 p-6 rounded-3xl shadow-xl border border-base-200 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FiPieChart className="text-8xl text-accent" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-accent/10 rounded-2xl text-accent">
                                <FiPieChart className="text-2xl" />
                            </div>
                            <span className="font-bold text-base-content/60 uppercase tracking-wider text-xs">Completion Rate</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-base-content">
                            94%
                        </h2>
                         <p className="text-xs text-success mt-2 font-medium">
                           High engagement
                        </p>
                    </motion.div>
                </div>

                {/* Activity Overview Widget (New Feature) */}
                <ActivityOverviewChart axiosSecure={axiosSecure} />

                {/* Charts Section 1: Revenue & Service Demand */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Revenue Trend Area Chart */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-base-100 p-6 rounded-3xl shadow-xl border border-base-200"
                    >
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <FiTrendingUp className="text-primary" /> Revenue Trend
                        </h3>
                        <div className="h-72 w-full flex items-center justify-center">
                            {monthlyStats.some(s => s.revenue > 0) ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyStats}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />
                                        <RechartsTooltip 
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            formatter={(value) => [`$${value}`, "Revenue"]}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-center text-base-content/40">
                                    <FiDollarSign className="text-4xl mx-auto mb-2 opacity-50" />
                                    <p>No revenue data yet</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Booking Status Pie Chart */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-base-100 p-6 rounded-3xl shadow-xl border border-base-200"
                    >
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                             <FiPieChart className="text-secondary" /> Booking Status
                        </h3>
                        <div className="h-72 w-full flex items-center justify-center">
                            {bookingStatusStats.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={bookingStatusStats}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="count"
                                            nameKey="status"
                                        >
                                            {bookingStatusStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-center text-base-content/40">
                                    <FiActivity className="text-4xl mx-auto mb-2 opacity-50" />
                                    <p>No bookings found</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Charts Section 2: Service Performance */}
                <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.6 }}
                     className="bg-base-100 p-6 rounded-3xl shadow-xl border border-base-200"
                >
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                         <FiBarChart2 className="text-accent" /> Top Services Comparison
                    </h3>
                    <div className="h-80 w-full flex items-center justify-center">
                        {revenueByService.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueByService} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.2} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="service" type="category" width={150} tick={{fill: '#4b5563', fontSize: 13, fontWeight: 500}} axisLine={false} tickLine={false} />
                                    <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px' }} formatter={(value) => [`$${value}`, "Revenue"]} />
                                    <Bar dataKey="totalRevenue" fill="#D4AF37" name="Revenue" radius={[0, 4, 4, 0]} barSize={20}> 
                                    {revenueByService.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#D4AF37' : '#E5C453'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                             <div className="text-center text-base-content/40">
                                <FiBarChart2 className="text-4xl mx-auto mb-2 opacity-50" />
                                <p>No service performance data available</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
