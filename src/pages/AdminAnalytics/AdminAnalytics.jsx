import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FiPieChart, FiBarChart2, FiDollarSign } from "react-icons/fi";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMemo } from "react"; // Import useMemo for performance optimization
import LoadingSpinner from "../../components/LoadingSpinner";

// Utility function to format status names
const formatStatus = (status) => {
  const statusMap = {
    assigned: "Assigned",
    planning: "Planning",
    "materials-prepared": "Materials Ready",
    "on-the-way": "En Route",
    "setup-in-progress": "Setup",
    completed: "Completed",
    pending: "Pending",
  };
  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
};

// Utility function for large number formatting (for Y-axis)
const formatLargeNumber = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value;
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28CFF",
  "#00A8A8",
  "#FF6666",
];

// --- Data Fetching Hooks (Enhanced) ---
const useAdminCharts = () => {
  const axiosSecure = useAxiosSecure();

  // 1. Fetch Bookings Status
  const { data: statusStats = [], isLoading: isLoadingStatus } = useQuery({
    queryKey: ["adminBookingsStatus"],
    queryFn: async () =>
      (await axiosSecure.get("/dashboard/admin/bookings-status")).data,
  });

  // 2. Fetch Services Demand (Count)
  const { data: demandData = [], isLoading: isLoadingDemand } = useQuery({
    queryKey: ["adminServiceDemand"],
    queryFn: async () =>
      (await axiosSecure.get("/dashboard/admin/services-demand")).data,
  });

  // 3. Fetch Revenue by Service (Financial Data)
  const { data: revenueByServiceData = [], isLoading: isLoadingRevenue } =
    useQuery({
      queryKey: ["adminRevenueByService"],
      queryFn: async () =>
        (await axiosSecure.get("/dashboard/admin/revenue-by-service")).data,
    });

  // --- Data processing ---
  const statusChartData = useMemo(
    () =>
      statusStats.map((item) => ({
        name: formatStatus(item.status),
        count: item.count,
      })),
    [statusStats]
  );

  // Service Demand data for Chart (Top 10 by count)
  const demandChartData = useMemo(
    () => demandData.sort((a, b) => b.count - a.count).slice(0, 10),
    [demandData]
  );

  // Revenue data for Chart (Top 10 by revenue)
  const revenueChartData = useMemo(
    () =>
      revenueByServiceData
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 10)
        .map((item) => ({
          service: item.service,
          revenue: item.totalRevenue,
        })),
    [revenueByServiceData]
  );

  return {
    statusChartData,
    demandChartData,
    revenueChartData,
    isLoading: isLoadingStatus || isLoadingDemand || isLoadingRevenue,
  };
};

// --- New Chart Component: Revenue by Service ---
const RevenueBarChart = ({ data }) => (
  <div className="bg-base-200 p-6 rounded-xl shadow-xl">
    <h3 className="text-xl font-semibold mb-4 text-accent flex items-center gap-2">
      <FiDollarSign className="text-success" /> Top Revenue Generating Services
    </h3>
    {data && data.length > 0 ? (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          // Adjusted margin for better mobile fit
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="service"
            angle={-20}
            textAnchor="end"
            height={60}
            stroke="#a0a0a0"
            // Hide X-Axis labels on very small screens if necessary, though angle helps a lot
            // interval={0}
          />
          <YAxis
            stroke="#a0a0a0"
            allowDecimals={false}
            // Use the new utility function for better large number formatting
            tickFormatter={formatLargeNumber}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2a323c",
              border: "none",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#ffffff" }}
            // Format tooltip value as currency
            formatter={(value) => [`${value.toLocaleString()} BDT`, "Revenue"]}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#4ade80" name="Total Revenue (BDT)" />
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <p className="text-center text-base-content/70">
        No revenue data available to display.
      </p>
    )}
  </div>
);

// --- Main Analytics Component ---
const AdminAnalytics = () => {
  const { statusChartData, demandChartData, revenueChartData, isLoading } =
    useAdminCharts();

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  // Function to check if we should display the complex pie chart label
  const shouldDisplayLabel = () => window.innerWidth > 600; // Example breakpoint

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }) => {
    if (!shouldDisplayLabel()) return null; // Hide labels on small screens

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-extrabold text-primary mb-6 md:mb-10 border-b pb-3 flex items-center gap-3">
        <FiBarChart2 className="text-primary" /> Comprehensive Analytics
      </h2>

      <p className="text-base md:text-lg text-base-content/70 mb-6 md:mb-8">
        Analyze key metrics including booking workflow status, service demand by
        count, and revenue generation to inform business strategy and resource
        allocation.
      </p>

      {/* --- Charts Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Bookings Status Chart (Pie Chart) */}
        <div className="bg-base-200 p-4 md:p-6 rounded-xl shadow-xl">
          <h3 className="text-lg md:text-xl font-semibold mb-4 text-accent flex items-center gap-2">
            <FiPieChart /> Bookings Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={statusChartData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={shouldDisplayLabel() ? 140 : 100} // Smaller radius on mobile
                fill="#8884d8"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {statusChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} bookings`, name]}
                contentStyle={{
                  backgroundColor: "#2a323c",
                  border: "none",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#ffffff" }}
              />
              {/* Force legend below chart on smaller screens by using a wrapper style */}
              <Legend
                layout={shouldDisplayLabel() ? "vertical" : "horizontal"}
                align={shouldDisplayLabel() ? "right" : "center"}
                verticalAlign={shouldDisplayLabel() ? "middle" : "bottom"}
                wrapperStyle={{
                  paddingLeft: shouldDisplayLabel() ? "20px" : "0",
                  paddingTop: "10px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Services Demand Chart (Bar Chart / Histogram) */}
        <div className="bg-base-200 p-4 md:p-6 rounded-xl shadow-xl">
          <h3 className="text-lg md:text-xl font-semibold mb-4 text-accent flex items-center gap-2">
            <FiBarChart2 /> Top Service Demand (Bookings Count)
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={demandChartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="service"
                angle={-20}
                textAnchor="end"
                height={60}
                stroke="#a0a0a0"
              />
              <YAxis stroke="#a0a0a0" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#2a323c",
                  border: "none",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#ffffff" }}
                formatter={(value) => [`${value} Bookings`, "Count"]}
              />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Total Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <hr className="my-6 md:my-8 border-base-300" />

      {/* --- Revenue Chart Section --- */}
      <h3 className="text-xl md:text-2xl font-bold text-primary/90 mb-4 md:mb-6 flex items-center gap-2">
        <FiDollarSign /> Financial Performance
      </h3>

      <RevenueBarChart data={revenueChartData} />
    </div>
  );
};

export default AdminAnalytics;
