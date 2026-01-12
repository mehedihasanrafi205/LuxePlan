import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  FiLoader,
  FiEdit,
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiClock
} from "react-icons/fi";
import { IoMdAdd, IoMdEye } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import DeleteConfirmationModal from "../../../components/Shared/Modal/DeleteConfirmationModal";
import EditBookingModal from "../../../components/Shared/Modal/EditBookingModal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";

const MyBookings = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [editBooking, setEditBooking] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteBooking, setDeleteBooking] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ADD PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const {
    data: bookingData = {},
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["myBookings", user?.email, currentPage, itemsPerPage],
    queryFn: async () => {
      const res = await axiosSecure(`/bookings`, {
        params: {
          email: user.email,
          page: currentPage,
          size: itemsPerPage,
        },
      });
      return res.data;
    },
    enabled: !!user?.email,
    keepPreviousData: true,
  });

  const bookings = bookingData.bookings || [];
  const totalCount = bookingData.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/bookings/${id}`),
    onSuccess: () => {
      toast.success("Booking deleted");
      queryClient.invalidateQueries(["myBookings", user.email]);
      setIsDeleteOpen(false);

      if (bookings.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    },
    onError: () => toast.error("Failed to delete booking"),
  });

  const handleDelete = (booking) => {
    setDeleteBooking(booking);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deleteBooking) {
      deleteMutation.mutate(deleteBooking._id);
    }
  };

  // Payment handler
  const handlePayment = async (b) => {
    try {
      const { data } = await axios.post(`${API_URL}/create-checkout-session`, {
        bookingId: b._id,
        serviceId: b.serviceId,
        service_name: b.service_name,
        userEmail: user.email,
        userName: b.userName,
        date: b.date,
        time: b.time,
        location: b.location,
        cost: b.cost,
        service_category: b.service_category,
      });

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to start payment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed!");
    }
  };

  const handleView = (id) => navigate(`/service/${id}`);

  const handleEdit = (booking) => {
    setEditBooking(booking);
    setIsEditOpen(true);
  };

  const statusColors = {
    pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    assigned: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    planning: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    materials_prepared: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    on_the_way: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    setup_in_progress: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    completed: "text-green-400 bg-green-400/10 border-green-400/20",
  };
  
  const getStatusBorder = (status) => {
     const styles = {
        pending: "border-l-yellow-400",
        assigned: "border-l-blue-400",
        planning: "border-l-purple-400",
        materials_prepared: "border-l-amber-400",
        on_the_way: "border-l-sky-400",
        setup_in_progress: "border-l-orange-400",
        completed: "border-l-green-400"
     };
     return styles[status] || "border-l-base-300";
  };

  //  PAGINATION HANDLERS
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = [...Array(totalPages).keys()].map((i) => i + 1);

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 bg-base-100/50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
             className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
              <h1 className="text-3xl md:text-4xl text-primary font-bold mb-2">My Bookings</h1>
              <p className="text-base-content/70">
                Track your requested services and payment status. <span className="badge badge-neutral ml-2">{totalCount} Total</span>
              </p>
          </div>
          <Link to={"/services"} className="btn btn-primary rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold gap-2">
            <IoMdAdd size={20} /> New Booking
          </Link>
        </motion.div>

        {isFetching && !isLoading && (
          <div className="fixed top-4 right-4 z-50">
              <span className="loading loading-spinner text-primary"></span>
          </div>
        )}

        {bookings.length === 0 && !isFetching && !isLoading ? (
          <div className="p-12 bg-base-100 rounded-2xl shadow-sm text-center border border-dashed border-base-300">
            <h3 className="text-xl font-bold text-base-content mb-2">No active bookings</h3>
            <p className="text-base-content/60 mb-6 font-medium">Browse our services and make your first booking today!</p>
             <Link to="/services" className="btn btn-outline btn-primary">Browse Services</Link>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
            {isLoading ? (
                <LoadingSpinner type="card" count={itemsPerPage} />
            ) : (
             <AnimatePresence>
              {bookings.map((b, index) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  key={b._id}
                  className={`bg-base-100 border border-base-200 rounded-2xl p-5 shadow-lg relative overflow-hidden text-left border-l-[6px] ${getStatusBorder(b.status)}`}
                >
                  <div className="flex justify-between items-start mb-3">
                     <div>
                        <h2 className="text-xl font-bold text-base-content">{b.service_name}</h2>
                        <span className="text-xs font-mono text-base-content/50 uppercase">{b.service_category}</span>
                     </div>
                     <span
                        className={`badge badge-sm font-bold uppercase tracking-wider py-2.5 ${
                        statusColors[b.status]
                        }`}
                    >
                        {b.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-base-content/70 mb-4">
                     <div className="flex items-center gap-2">
                         <FiCalendar className="text-primary" /> {b.date}
                     </div>
                     <div className="flex items-center gap-2">
                        <FiClock className="text-primary" /> {b.time}
                     </div>
                     <div className="flex items-center gap-2">
                        <FiMapPin className="text-primary" /> <span className="truncate">{b.location}</span>
                     </div>
                     <div className="flex items-center gap-2 font-bold text-base-content">
                        <FiDollarSign className="text-primary" /> {b.cost} BDT
                     </div>
                  </div>

                  <div className="divider my-0"></div>

                  <div className="flex justify-between items-center pt-3">
                     <div className="flex gap-2">
                        {/* Actions */}
                        <button onClick={() => handleView(b.serviceId)} className="btn btn-sm btn-ghost btn-circle text-base-content/60 hover:text-primary hover:bg-transparent">
                            <IoMdEye size={18} />
                        </button>
                        <button onClick={() => handleEdit(b)} className="btn btn-sm btn-ghost btn-circle text-info hover:bg-info/10">
                            <FiEdit size={16} />
                        </button>
                        <button onClick={() => handleDelete(b)} className="btn btn-sm btn-ghost btn-circle text-error hover:bg-error/10">
                            <FiTrash2 size={16} />
                        </button>
                     </div>

                    {b.paymentStatus === "paid" ? (
                      <span className="badge badge-success gap-1 bg-success/10 text-success border-none font-bold py-3 px-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-success"></span> Paid
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePayment(b)}
                        className="btn btn-sm btn-primary rounded-full px-5"
                        disabled={isFetching}
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
             </AnimatePresence>
            )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
            {isLoading ? (
                 <LoadingSpinner type="table" count={itemsPerPage} className="border-none" />
             ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden"
                >
              <table className="w-full table min-w-[1050px]">
                <thead className="bg-base-200/50">
                  <tr className="border-b border-b-white/10">
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-base-content/50 pl-6">#</th>
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-base-content/50">
                      Service Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-base-content/50">
                      Schedule
                    </th>
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-base-content/50">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-base-content/50">
                      Cost
                    </th>
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-base-content/50">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-base-content/50 text-center">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-base-content/50 text-right pr-6">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((b, index) => (
                    <tr key={b._id} className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none">
                      {/* Calculate index based on current page */}
                      <td className="pl-6 font-mono text-base-content/40">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td>
                          <div className="font-bold text-base-content">{b.service_name}</div>
                          <div className="text-xs text-base-content/50 uppercase">{b.service_category}</div>
                      </td>
                      <td>
                          <div className="font-medium">{b.date}</div>
                          <div className="text-xs text-base-content/50">{b.time}</div>
                      </td>
                      <td><div className="truncate max-w-[200px]" title={b.location}>{b.location}</div></td>
                      <td className="font-mono font-medium">{b.cost} BDT</td>
                      <td>
                        <span
                          className={`badge border badge-sm font-bold uppercase tracking-wider py-2.5 ${
                            statusColors[b.status]
                          }`}
                        >
                          {b.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="text-center">
                        {b.paymentStatus === "paid" ? (
                          <span className="badge badge-ghost text-xs bg-green-500/10 text-green-500 font-bold border-none py-3">
                            Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => handlePayment(b)}
                            className="btn btn-xs btn-primary rounded-full px-4"
                            disabled={isFetching}
                          >
                            Pay Now
                          </button>
                        )}
                      </td>
                      <td className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                            <button
                                onClick={() => handleView(b.serviceId)}
                                className="btn btn-sm btn-ghost btn-circle text-base-content/60 hover:text-primary tooltip tooltip-bottom"
                                data-tip="View Service"
                            >
                                <IoMdEye size={18} />
                            </button>
                            <button
                                onClick={() => handleEdit(b)}
                                className="btn btn-sm btn-ghost btn-circle text-info hover:bg-info/10 tooltip tooltip-bottom"
                                data-tip="Edit Booking"
                            >
                                <FiEdit size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(b)}
                                className="btn btn-sm btn-ghost btn-circle text-error hover:bg-error/10 tooltip tooltip-bottom"
                                data-tip="Cancel Booking"
                            >
                                <FiTrash2 size={16} />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </motion.div>
            )}
            </div>

            {/*  PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 mb-6">
                <div className="join shadow-sm border border-base-300 bg-base-100 rounded-lg p-1">
                  {/* Previous Button */}
                  <button
                    className="join-item btn btn-sm btn-ghost hover:bg-base-200"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isFetching}
                  >
                    <FiChevronLeft />
                  </button>

                  {/* Page Buttons */}
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      className={`join-item btn btn-sm ${
                        currentPage === page
                          ? "btn-primary text-primary-content shadow-md"
                          : "btn-ghost hover:bg-base-200"
                      }`}
                      onClick={() => handlePageChange(page)}
                      disabled={isFetching}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    className="join-item btn btn-sm btn-ghost hover:bg-base-200"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isFetching}
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Booking Modal */}
      {isEditOpen && editBooking && (
        <EditBookingModal
          booking={editBooking}
          onClose={() => setIsEditOpen(false)}
        />
      )}
      {isDeleteOpen && deleteBooking && (
        <DeleteConfirmationModal
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
          message={`Are you sure you want to delete the booking for "${deleteBooking.service_name}" on ${deleteBooking.date}?`}
        />
      )}
    </div>
  );
};

export default MyBookings;
