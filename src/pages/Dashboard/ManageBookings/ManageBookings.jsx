import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiLoader, FiUserPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi"; // 👈 Import Chevron icons
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import AssignDecoratorModal from "../../../components/Shared/Modal/AssignDecoratorModal";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ManageBookings = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; 

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDecorator, setSelectedDecorator] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const { data: bookingData = {}, isLoading, isFetching } = useQuery({
    queryKey: ["bookings", currentPage, itemsPerPage], 
    queryFn: async () => {
      const res = await axiosSecure("/bookings", { 
        params: {
          page: currentPage,
          size: itemsPerPage,
        },
      });
      return res.data; 
    },
    keepPreviousData: true, 
  });

  // Extract data for clarity
  const bookings = bookingData.bookings || [];
  const totalCount = bookingData.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const { data: decorators = [] } = useQuery({
    queryKey: ["decorators", "accepted", "available_or_assigned"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/decorators?status=accepted&workStatus=available,assigned"
      );
      return res.data?.decorators;
    },
  });

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
    setSelectedDecorator("");
  };

  const handleAssign = async () => {
    if (!selectedDecorator)
      return toast.error("Please select a decorator first");

    setAssigning(true);
    try {
      await axiosSecure.patch(`/bookings/${selectedBooking._id}/assign`, {
        decoratorEmail: selectedDecorator.email,
        decoratorId: selectedDecorator._id,
        decoratorName: selectedDecorator.fullName,
      });

      toast.success("Decorator assigned successfully!");

      queryClient.invalidateQueries({ queryKey: ["bookings"] });

      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign decorator");
    } finally {
      setAssigning(false);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = [...Array(totalPages).keys()].map(i => i + 1);

  if (isLoading)
    return (
      <LoadingSpinner/>
    );

  const statusStyles = {
    pending: "bg-yellow-500/20 text-yellow-400",
    assigned: "bg-blue-500/20 text-blue-400",
    planning: "bg-purple-500/20 text-purple-400",
    materials_prepared: "bg-amber-500/20 text-amber-400",
    on_the_way: "bg-sky-500/20 text-sky-400",
    setup_in_progress: "bg-orange-500/20 text-orange-400",
    completed: "bg-green-500/20 text-green-400",
  };

  return (
    <div className="min-h-screen bg-background-dark px-4 md:px-6 py-10">
      <div className="container mx-auto">
        <h1 className="text-3xl text-primary font-bold mb-4">
          Manage Bookings ({totalCount} Total) 
        </h1>

        {isFetching && (
          <div className="text-center text-primary mb-4">
            <FiLoader className="inline animate-spin mr-2" /> Fetching bookings...
          </div>
        )}

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className={`bg-base-200 border border-primary/20 rounded-xl p-4 backdrop-blur-sm shadow-lg ${isFetching ? 'opacity-50' : ''}`}
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-lg">{b.service_name}</h2>
                <p className="font-bold text-primary">{b.cost} ৳</p>
              </div>

              {/* Info */}
              <div className="space-y-1  text-sm">
                <p>
                  <span className="font-medium">User:</span> {b.userEmail}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {b.date}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {b.location}
                </p>
                <p>
                  <span className="font-medium">Assigned:</span>{" "}
                  {b.decoratorName ? (
                    <span className="text-blue-300">{b.decoratorName}</span>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </p>

                {/* Status */}
                <p className="flex items-center gap-2 pt-1">
                  <span className="font-medium">Status:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      statusStyles[b.status] || "bg-gray-500/20 text-gray-300"
                    }`}
                  >
                    {b.status}
                  </span>
                </p>

                {/* Payment */}
                <p className="flex items-center gap-2">
                  <span className="font-medium">Payment:</span>
                  {b.paymentStatus === "unpaid" ? (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                      Unpaid
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                      Paid
                    </span>
                  )}
                </p>
              </div>

              {/* Assign Button */}
              <button
                onClick={() => openModal(b)}
                className={`mt-4 w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-white transition ${
                  b.status !== "pending"
                    ? "bg-gray-500/40 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/80"
                }`}
                disabled={b.status !== "pending" || isFetching}
              >
                <FiUserPlus />
                {b.status !== "pending" ? "Assigned" : "Assign Decorator"}
              </button>
            </div>
          ))}
        </div>

        {/* TABLE VIEW */}
        <div className="hidden md:block bg-white/5 shadow-xl border border-base-300 rounded-xl overflow-x-auto">
          <table className="w-full table min-w-[900px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left  text-sm uppercase">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-sm uppercase">
                  User
                </th>
                <th className="px-6 py-4 text-left  text-sm uppercase">
                  Date
                </th>
                <th className="px-6 py-4 text-left  text-sm uppercase">
                  Assigned
                </th>
                <th className="px-6 py-4 text-left  text-sm uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left  text-sm uppercase">
                  Payment
                </th>
                <th className="px-6 py-4 text-left  text-sm uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="">
              {bookings.map((b) => (
                <tr key={b._id} className={isFetching ? 'opacity-50' : ''}>
                  <td className="px-6 py-4 ">{b.service_name}</td>
                  <td className="px-6 py-4 ">{b.userEmail}</td>
                  <td className="px-6 py-4 ">{b.date}</td>
                  <td className="px-6 py-4 ">
                    {b.decoratorName || (
                      <span className="text-white/40">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        statusStyles[b.status] || "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {b.paymentStatus === "unpaid" ? (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                        Unpaid
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                        Paid
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openModal(b)}
                      className={`btn btn-primary btn-sm flex items-center gap-1 ${
                        b.status !== "pending"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={b.status !== "pending" || isFetching}
                    >
                      <FiUserPlus />{" "}
                      {b.status !== "pending" ? "Assigned" : "Assign"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>        
         
        {/* PAGINATION CONTROLS */}
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
         
        {/* Modal */}
        <AssignDecoratorModal
          isOpen={isModalOpen}
          booking={selectedBooking}
          decorators={decorators}
          selectedDecorator={selectedDecorator}
          setSelectedDecorator={setSelectedDecorator}
          onClose={closeModal}
          onAssign={handleAssign}
          loading={assigning}
        />
      </div>
    </div>
  );
};

export default ManageBookings;