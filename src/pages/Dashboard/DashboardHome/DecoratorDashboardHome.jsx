import { useQuery } from "@tanstack/react-query";
import { FiCalendar, FiCheckCircle, FiXCircle } from "react-icons/fi";
import moment from "moment";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";

//  Data Hook -
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

  const completedBookings = bookings.filter(
    (b) => b.status === "completed"
  ).length;
  const activeBookings = bookings.filter(
    (b) => b.status !== "completed" && b.status !== "cancelled"
  ).length;

  return {
    bookings,
    payments,
    totalBookings: bookings.length,
    completedBookings,
    activeBookings,
    isLoading: isLoadingBookings || isLoadingPayments,
  };
};

//  Main Component 
const UserDashboardHome = () => {
  const { user } = useAuth();
  const userEmail = user?.email;
  const userName = user?.displayName || "Client";

  const {
    totalBookings,
    completedBookings,
    activeBookings,
    payments,
    isLoading,
  } = useUserDashboard(userEmail);

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (!userEmail) {
    return (
      <div className="p-8 text-center text-error">
        Please log in to view your dashboard.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-extrabold text-primary mb-2">
        Welcome Back, {userName.split(" ")[0]} 👋
      </h2>
      <p className="text-base-content/70 mb-8">
        Review your bookings and payment history.
      </p>

      <hr className="my-8 border-base-300" />

      {/*Booking Status Summary  */}
      <h3 className="text-2xl font-semibold mb-6 text-primary/90">
        Your Activity Summary
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        <MetricCard
          icon={<FiCalendar />}
          title="Total Bookings"
          value={totalBookings}
          color="primary"
        />
        <MetricCard
          icon={<FiCheckCircle />}
          title="Completed Projects"
          value={completedBookings}
          color="success"
        />
        <MetricCard
          icon={<FiXCircle />}
          title="Active Projects"
          value={activeBookings}
          color="warning"
        />
      </div>

      <hr className="my-8 border-base-300" />

      {/* Recent Payments */}
      <h3 className="text-2xl font-semibold mb-4 text-primary/90">
        Recent Payment History
      </h3>

      {/* Mobile view: cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden mb-6">
        {payments.length === 0 && (
          <p className="text-base-content/70">No payment records found.</p>
        )}
        {payments.slice(0, 5).map((p) => (
          <div key={p._id} className="card bg-base-200 p-4 shadow rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">{p.serviceName}</p>
              <span className="text-success font-bold">
                {p.amount.toLocaleString()} BDT
              </span>
            </div>
            <p className="text-xs text-base-content/70 truncate">
              Transaction: {p.transactionId.substring(0, 15)}...
            </p>
            <p className="text-xs text-base-content/70">
              Date: {moment(p.paidAt).format("MMM DD, YYYY")}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop/tablet view: table */}
      <div className="hidden md:block bg-base-200 rounded-xl shadow-xl overflow-x-auto">
        {payments.length === 0 ? (
          <p className="p-6 text-base-content/70">No payment records found.</p>
        ) : (
          <table className="table w-full text-sm">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Amount</th>
                <th>Transaction ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 5).map((payment) => (
                <tr key={payment._id}>
                  <td className="font-semibold">{payment.serviceName}</td>
                  <td>
                    <span className="text-success font-bold">
                      {payment.amount.toLocaleString()} BDT
                    </span>
                  </td>
                  <td>{payment.transactionId.substring(0, 15)}...</td>
                  <td>{moment(payment.paidAt).format("MMMM DD, YYYY")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

//  Metric Card Component 
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

export default UserDashboardHome;
