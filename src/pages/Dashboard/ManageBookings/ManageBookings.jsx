import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiLoader, FiUserPlus, FiChevronLeft, FiChevronRight, FiCalendar, FiMapPin } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import AssignDecoratorModal from "../../../components/Shared/Modal/AssignDecoratorModal";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ManageBookings = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; 

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDecorator, setSelectedDecorator] = useState([]);
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
    setSelectedDecorator([]);
  };

  const handleAssign = async () => {
    if (selectedDecorator.length === 0)
      return toast.error("Please select at least one decorator");

    setAssigning(true);
    try {
      await axiosSecure.patch(`/bookings/${selectedBooking._id}/assign`, {
        decoratorEmails: selectedDecorator.map(d => d.email),
        decoratorIds: selectedDecorator.map(d => d._id),
        decoratorNames: selectedDecorator.map(d => d.fullName),
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

  const statusStyles = {
    pending: " badge-warning",
    assigned: " badge-info",
    planning: " badge-secondary",
    materials_prepared: " badge-accent",
    on_the_way: " badge-primary",
    setup_in_progress: " badge-warning",
    completed: " badge-success",
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 bg-base-100/50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
             className="mb-8"
        >
             <h1 className="text-3xl md:text-4xl text-primary font-bold mb-2">Manage Bookings</h1>
             <p className="text-base-content/70">
                Oversee all service requests and assign decorators. <span className="badge badge-neutral ml-2">{totalCount} Total</span>
            </p>
        </motion.div>

        {isFetching && !isLoading && (
          <div className="fixed top-4 right-4 z-50">
              <span className="loading loading-spinner text-primary"></span>
          </div>
        )}

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden space-y-4">
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
              className="bg-base-100 border border-base-200 rounded-2xl p-5 shadow-lg relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-3">
                 <div>
                    <h2 className="font-bold text-lg text-base-content leading-tight mb-1">{b.service_name}</h2>
                    <p className="text-xs text-base-content/50 uppercase tracking-wide">{b.service_category}</p>
                 </div>
                 <span className="font-bold text-primary">{b.cost} ৳</span>
              </div>

              <div className="space-y-2 text-sm text-base-content/70 mb-4">
                  <div className="flex items-center gap-2">
                     <span className="w-5 flex justify-center text-primary"><FiCalendar /></span>
                     <span>{b.date} • {b.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="w-5 flex justify-center text-primary"><FiMapPin /></span>
                     <span className="truncate">{b.location}</span>
                  </div>
                   <div className="flex items-center gap-2">
                     <span className="w-5 flex justify-center text-primary"><HiUserGroup /></span>
                     <span className="truncate">{b.userEmail}</span>
                  </div>
              </div>

             <div className="flex flex-wrap gap-2 mb-4">
                <span className={`badge ${statusStyles[b.status] || "badge-ghost"}`}>
                    {b.status.replace(/_/g, " ")}
                </span>
                {b.paymentStatus === "paid" ? (
                    <span className="badge badge-success gap-1 bg-success/10 text-success border-none">Paid</span>
                ) : (
                    <span className="badge badge-error gap-1 bg-error/10 text-error border-none">Unpaid</span>
                )}
             </div>

              <div className="bg-base-200/50 rounded-xl p-3 mb-4">
                  <span className="text-xs font-bold text-base-content/40 uppercase block mb-1">Assigned Decorator</span>
                  {b.decoratorName ? (
                     <div className="font-medium text-base-content">{b.decoratorName}</div>
                  ) : (
                     <div className="text-base-content/40 italic text-sm">Not assigned yet</div>
                  )}
              </div>

              {/* Assign Button */}
              <button
                onClick={() => openModal(b)}
                className={`w-full btn btn-sm ${
                  b.status !== "pending"
                    ? "btn-disabled bg-base-300 text-base-content/40"
                    : "btn-primary shadow-lg shadow-primary/20"
                }`}
                disabled={b.status !== "pending" || isFetching}
              >
                <FiUserPlus />
                {b.status !== "pending" ? "Assigned" : "Assign Decorator"}
              </button>
            </motion.div>
          ))}
          </AnimatePresence>
         )}
        </div>

        {/* TABLE VIEW */}
        <div className="hidden md:block">
         {isLoading ? (
             <LoadingSpinner type="table" count={itemsPerPage} className="border-none" />
         ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden"
          >
          <table className="w-full table min-w-[900px]">
            <thead className="bg-base-200/50">
              <tr>
                <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 pl-6">Service Info</th>
                <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Customer</th>
                <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Schedule</th>
                <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Assigned To</th>
                <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Status</th>
                <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Payment</th>
                <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none">
                  <td className="pl-6">
                      <div className="font-bold text-base-content">{b.service_name}</div>
                      <div className="text-xs text-base-content/50">{b.cost} ৳</div>
                  </td>
                  <td className="text-base-content/70 font-medium text-sm">{b.userEmail}</td>
                  <td>
                      <div className="font-medium text-sm">{b.date}</div>
                      <div className="text-xs text-base-content/50">{b.time}</div>
                  </td>
                  <td>
                    {b.decoratorName ? (
                        <span className="font-medium text-primary bg-primary/10 px-2 py-1 rounded-md text-xs">{b.decoratorName}</span>
                    ) : (
                      <span className="text-base-content/40 text-sm italic">Pending</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm font-bold uppercase tracking-wider py-2.5 ${
                        statusStyles[b.status] || "badge-ghost"
                      }`}
                    >
                      {b.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td>
                    {b.paymentStatus === "unpaid" ? (
                      <span className="badge badge-error badge-sm bg-error/10 text-error border-none font-bold">Unpaid</span>
                    ) : (
                      <span className="badge badge-success badge-sm bg-success/10 text-success border-none font-bold">Paid</span>
                    )}
                  </td>
                  <td className="text-right pr-6">
                    <button
                      onClick={() => openModal(b)}
                      className={`btn btn-primary btn-sm rounded-full px-4 shadow-md ${
                        b.status !== "pending"
                          ? "btn-disabled"
                          : ""
                      }`}
                      disabled={b.status !== "pending" || isFetching}
                    >
                      <FiUserPlus />{" "}
                      {b.status !== "pending" ? "Done" : "Assign"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </motion.div>
         )}
        </div>        
         
        {/* PAGINATION CONTROLS */}
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
          onAutoRecommend={async () => {
              try {
                  const res = await axiosSecure.post("/decorators/recommend", {
                      category: selectedBooking.service_category || "", 
                  });
                  if (res.data && res.data.length > 0) {
                      setSelectedDecorator(res.data);
                      toast.success(`Found ${res.data.length} recommended decorators!`);
                  } else {
                      toast.error("No specific recommendations found (Try manual selection).");
                  }
              } catch(e) {
                  console.error(e);
                  toast.error("Failed to fetch recommendations.");
              }
          }}
        />
      </div>
    </div>
  );
};

export default ManageBookings;