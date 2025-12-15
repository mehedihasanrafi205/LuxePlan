import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  FiLoader,
  FiEdit,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { IoMdAdd, IoMdEye } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
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
    pending: "bg-yellow-500/20 text-yellow-400",
    assigned: "bg-blue-500/20 text-blue-400",
    planning: "bg-purple-500/20 text-purple-400",
    materials_prepared: "bg-amber-500/20 text-amber-400",
    on_the_way: "bg-sky-500/20 text-sky-400",
    setup_in_progress: "bg-orange-500/20 text-orange-400",
    completed: "bg-green-500/20 text-green-400",
  };

  //  PAGINATION HANDLERS
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = [...Array(totalPages).keys()].map((i) => i + 1);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen px-4 md:px-6 py-10">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl text-primary font-bold ">
            My Bookings ({totalCount} Total)
          </h1>
          <Link to={"/services"} className="btn btn-primary flex gap-2">
            <IoMdAdd /> Add New Bookings
          </Link>
        </div>

        {isFetching && (
          <div className="text-center text-primary mb-4">
            <FiLoader className="inline animate-spin mr-2" /> Fetching
            bookings...
          </div>
        )}

        {bookings.length === 0 && !isFetching ? (
          <div className="p-10 bg-base-100/50 rounded-xl shadow-xl text-center mt-6">
            <p className="text-xl font-semibold">
              You have no active bookings.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div
              className={`space-y-4 md:hidden ${
                isFetching ? "opacity-50" : ""
              }`}
            >
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-base-200 border border-[#d4af37]/20 rounded-xl p-4 backdrop-blur-sm"
                >
                  <h2 className="text-lg font-semibold">{b.service_name}</h2>
                  <p className="text-sm mt-1">Date: {b.date}</p>
                  <p className="text-sm mt-1">Time: {b.time}</p>
                  <p className="text-sm mt-1">Location: {b.location}</p>
                  <p className="text-sm mt-1">Category: {b.service_category}</p>
                  <p className="text-sm mt-1">Cost: {b.cost} BDT</p>

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
                        disabled={isFetching}
                      >
                        Pay Now
                      </button>
                    )}
                  </div>

                  <div className="flex justify-between mt-4">
                    <IoMdEye
                      onClick={() => handleView(b.serviceId)}
                      className="text-xl cursor-pointer"
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

            {/* Desktop Table */}
            <div
              className={`hidden md:block rounded-xl backdrop-blur-sm overflow-x-auto shadow-xl border border-base-300 ${
                isFetching ? "opacity-50" : ""
              }`}
            >
              <table className="w-full table min-w-[1050px]">
                <thead>
                  <tr className="border-b border-b-white/10">
                    <th className="px-6 py-4 text-left text-sm uppercase">#</th>
                    <th className="px-6 py-4 text-left text-sm uppercase">
                      Service
                    </th>
                    <th className="px-6 py-4 text-left text-sm uppercase">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm uppercase">
                      Time
                    </th>
                    <th className="px-6 py-4 text-left text-sm uppercase">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-sm uppercase">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm uppercase">
                      Cost
                    </th>
                    <th className="px-6 py-4 text-left text-sm uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm uppercase">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-sm uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((b, index) => (
                    <tr key={b._id}>
                      {/* Calculate index based on current page */}
                      <td className="px-6 py-4">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4">{b.service_name}</td>
                      <td className="px-6 py-4">{b.date}</td>
                      <td className="px-6 py-4">{b.time}</td>
                      <td className="px-6 py-4">{b.location}</td>
                      <td className="px-6 py-4">{b.service_category}</td>
                      <td className="px-6 py-4">{b.cost} BDT</td>
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
                            disabled={isFetching}
                          >
                            Pay Now
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-3">
                        <IoMdEye
                          onClick={() => handleView(b.serviceId)}
                          className="text-xl cursor-pointer"
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

            {/*  PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="join shadow-md">
                  {/* Previous Button */}
                  <button
                    className="join-item btn btn-md btn-primary/80 disabled:bg-base-300"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isFetching}
                  >
                    <FiChevronLeft />
                  </button>

                  {/* Page Buttons */}
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      className={`join-item btn btn-md ${
                        currentPage === page
                          ? "btn-primary shadow-xl"
                          : "btn-ghost"
                      }`}
                      onClick={() => handlePageChange(page)}
                      disabled={isFetching}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    className="join-item btn btn-md btn-primary/80 disabled:bg-base-300"
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
