import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FiLoader, FiEdit } from "react-icons/fi";
import { IoMdEye } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router";
import DeleteConfirmationModal from "../../../components/Shared/Modal/DeleteConfirmationModal";
import EditBookingModal from "../../../components/Shared/Modal/EditBookingModal";

const MyBookings = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [editBooking, setEditBooking] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteBooking, setDeleteBooking] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch user bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["myBookings", user?.email],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/bookings?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });
  // Delete booking mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => axios.delete(`${API_URL}/bookings/${id}`),
    onSuccess: () => {
      toast.success("Booking deleted");
      queryClient.invalidateQueries(["myBookings", user.email]);
      setIsDeleteOpen(false);
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
        userEmail: b.userEmail,
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
    pending: "bg-yellow-500/20 text-yellow-400",
    assigned: "bg-blue-500/20 text-blue-400",
    planning: "bg-purple-500/20 text-purple-400",
    materials_prepared: "bg-amber-500/20 text-amber-400",
    on_the_way: "bg-sky-500/20 text-sky-400",
    setup_in_progress: "bg-orange-500/20 text-orange-400",
    completed: "bg-green-500/20 text-green-400",
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-4 md:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-2">My Bookings</h1>
        <p className="text-white/60 mb-8">
          Track bookings, payments, and project progress.
        </p>

        {isLoading && (
          <div className="flex justify-center py-20">
            <FiLoader className="animate-spin text-4xl text-[#d4af37]" />
          </div>
        )}

        {/* Mobile Cards */}
        {!isLoading && (
          <div className="space-y-4 md:hidden">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white/5 border border-[#d4af37]/20 rounded-xl p-4 backdrop-blur-sm"
              >
                <h2 className="text-lg font-semibold">{b.service_name}</h2>
                <p className="text-white/60 text-sm mt-1">Date: {b.date}</p>
                <span
                  className={`inline-block mt-3 rounded-full px-3 py-1 text-xs font-semibold ${
                    statusColors[b.status]
                  }`}
                >
                  {b.status.replace(/_/g, " ")}
                </span>

                <div className="mt-4">
                  {b.paymentStatus === "paid" ? (
                    <span className="inline-block bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs">
                      Paid
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePayment(b)}
                      className="bg-[#d4af37] text-black px-3 py-2 rounded-lg font-semibold text-sm w-full mt-2"
                    >
                      Pay Now
                    </button>
                  )}
                </div>

                <div className="flex justify-between mt-4">
                  <IoMdEye
                    onClick={() => handleView(b.serviceId)}
                    className="text-white/80 hover:text-white text-xl cursor-pointer"
                  />
                  <FiEdit
                    onClick={() => handleEdit(b)}
                    className="text-blue-400 hover:text-blue-300 text-lg cursor-pointer"
                  />
                  <FaTrashAlt
                    onClick={() => handleDelete(b)}
                    className="text-red-400 hover:text-red-300 text-lg cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop Table */}
        {!isLoading && (
          <div className="hidden md:block bg-white/5 border border-[#d4af37]/20 rounded-xl backdrop-blur-sm overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-b-white/10">
                  <th className="px-6 py-4 text-left text-white/70 text-sm uppercase">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-white/70 text-sm uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-white/70 text-sm uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-white/70 text-sm uppercase">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-white/70 text-sm uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td className="px-6 py-4 text-white">{b.service_name}</td>
                    <td className="px-6 py-4 text-white/70">{b.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full h-7 px-3 text-xs font-semibold ${
                          statusColors[b.status]
                        }`}
                      >
                        {b.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {b.paymentStatus === "paid" ? (
                        <span className="inline-flex items-center rounded-full h-7 px-3 text-xs font-semibold bg-green-600/20 text-green-400">
                          Paid
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePayment(b)}
                          className="bg-[#d4af37] text-black font-semibold px-3 py-1.5 rounded-full hover:shadow-[0_0_10px_#d4af37] transition-all"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-3">
                      <IoMdEye
                        onClick={() => handleView(b.serviceId)}
                        className="text-white/80 hover:text-white text-xl cursor-pointer"
                      />
                      <FiEdit
                        onClick={() => handleEdit(b)}
                        className="text-blue-400 hover:text-blue-300 text-lg cursor-pointer"
                      />
                      <FaTrashAlt
                        onClick={() => handleDelete(b)}
                        className="text-red-400 hover:text-red-300 text-lg cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
