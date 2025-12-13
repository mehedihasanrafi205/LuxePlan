import { useQuery } from "@tanstack/react-query";
import {
  FiUsers,
  FiDollarSign,
  FiBarChart2,
  FiPlus,
  FiList,
  FiCheckCircle,
} from "react-icons/fi";
import { Link } from "react-router";
import moment from "moment";

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
    queryFn: async () => (await axiosSecure.get("/bookings")).data,
  });

  const { data: allDecorators = [], isLoading: isLoadingDecorators } =
    useQuery({
      queryKey: ["allDecorators"],
      queryFn: async () => (await axiosSecure.get("/decorators")).data,
    });

  const totalUsers = 45;
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
    isLoading:
      isLoadingStatus ||
      isLoadingRevenue ||
      isLoadingBookings ||
      isLoadingDecorators,
  };
};

/* ===================== COMPONENT ===================== */
const AdminDashboardHome = () => {
  const {
    totalRevenue,
    totalUsers,
    totalBookings,
    pendingDecoratorCount,
    pendingBookings,
    allBookings,
    isLoading,
  } = useAdminOverview();

  if (isLoading) return <LoadingSpinner />;

  const fullPendingCount = allBookings.filter(
    (b) => b.paymentStatus === "paid" && b.status === "pending"
  ).length;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-6">
        Admin Dashboard Overview 👑
      </h2>

      {/*  METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <MetricCard
          icon={<FiDollarSign />}
          title="Total Revenue"
          value={`${totalRevenue.toLocaleString()} BDT`}
          color="success"
        />
        <MetricCard
          icon={<FiCheckCircle />}
          title="Pending Assignments"
          value={pendingBookings.length}
          color="warning"
        />
        <MetricCard
          icon={<FiUsers />}
          title="Total Users"
          value={totalUsers}
          color="info"
        />
        <MetricCard
          icon={<FiBarChart2 />}
          title="Total Bookings"
          value={totalBookings}
          color="error"
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <QuickLink
          to="/dashboard/manage-services"
          icon={<FiPlus />}
          title="Create New Service"
          desc="Add a new decoration package."
        />

        <Link
          to="/dashboard/manage-decorators"
          className="card bg-base-200 hover:bg-base-300 transition shadow-lg p-18 text-center relative"
        >
          {pendingDecoratorCount > 0 && (
            <span className="badge badge-error absolute top-3 right-3">
              {pendingDecoratorCount}
            </span>
          )}
          <FiList className="mx-auto text-accent text-4xl mb-2" />
          <h3 className="font-bold text-2xl text-accent">Manage Decorators</h3>
          <p className=" text-base-content/70">
            Approve accounts or update roles.
          </p>
        </Link>

        <Link
          to="/dashboard/analytics"
          className="card bg-primary hover:bg-primary-focus transition shadow-lg p-18 text-center text-white"
        >
          <FiBarChart2 className="mx-auto text-4xl mb-2" />
          <h3 className="font-bold text-2xl">View Full Analytics</h3>
          <p className="">Service demand, status & revenue charts.</p>
        </Link>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden mb-6">
        {pendingBookings.length === 0 ? (
          <p className="text-success bg-success/10 p-4 rounded">
            All bookings are assigned 🎉
          </p>
        ) : (
          pendingBookings.map((b) => (
            <div key={b._id} className="card bg-base-200 p-4 shadow rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">{b.service_name}</p>
                <span className="text-warning font-bold">{b.cost.toLocaleString()} BDT</span>
              </div>
              <p className="text-xs text-base-content/70 truncate">{b.userEmail}</p>
              <p className="text-xs text-base-content/70">{moment(b.date).format("MMM DD")}</p>
              <Link
                to="/dashboard/manage-bookings"
                className="btn btn-xs btn-warning mt-2 w-full"
              >
                Assign
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Desktop/tablet table */}
      <div className="hidden md:block bg-base-200 p-4 sm:p-6 rounded-xl shadow-xl">
        <h3 className="text-lg font-semibold text-primary/90 mb-4 flex items-center gap-2">
          <FiCheckCircle className="text-warning" />
          New Paid Bookings Needing Assignment
        </h3>

        {pendingBookings.length === 0 ? (
          <p className="text-success bg-success/10 p-4 rounded">
            All bookings are assigned 🎉
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-sm">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingBookings.map((b) => (
                  <tr key={b._id}>
                    <td className="font-semibold">{b.service_name}</td>
                    <td className="truncate max-w-40">{b.userEmail}</td>
                    <td>{moment(b.date).format("MMM DD")}</td>
                    <td>{b.cost.toLocaleString()} BDT</td>
                    <td>
                      <Link
                        to="/dashboard/manage-bookings"
                        className="btn btn-xs btn-warning"
                      >
                        Assign
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {fullPendingCount > 5 && (
              <div className="text-right mt-3">
                <Link
                  to="/dashboard/manage-bookings"
                  className="text-primary text-sm hover:underline"
                >
                  View all {fullPendingCount} →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/*  SMALL COMPONENTS  */
const MetricCard = ({ icon, title, value, color }) => (
  <div
    className={`min-w-[200px] card bg-base-200 shadow-xl p-5 border-l-4 border-${color}`}
  >
    <div className="flex items-center">
      <span className={`text-${color} text-2xl mr-4`}>{icon}</span>
      <div>
        <p className="text-base-content/70">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const QuickLink = ({ to, icon, title, desc }) => (
  <Link
    to={to}
    className="card bg-base-200 hover:bg-base-300 transition shadow-lg p-18 text-center"
  >
    <span className="text-primary text-4xl mx-auto mb-2 block">{icon}</span>
    <h3 className="font-bold text-2xl text-primary">{title}</h3>
    <p className=" text-base-content/70">{desc}</p>
  </Link>
);

export default AdminDashboardHome;
