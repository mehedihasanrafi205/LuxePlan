import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FiLoader, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoMdEye } from "react-icons/io";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ManageDecorators = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("pending");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const {
    data: decoratorData = {},
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["decorators", statusFilter, currentPage, itemsPerPage],
    queryFn: async () => {
      const res = await axiosSecure.get(`/decorators`, {
        params: {
          status: statusFilter,
          page: currentPage,
          size: itemsPerPage,
        },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const decorators = decoratorData.decorators || [];
  const totalCount = decoratorData.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await axiosSecure.patch(`/decorators/${id}`, { status });
    },
    onSuccess: () => {
      toast.success("Action completed");
      queryClient.invalidateQueries({ queryKey: ["decorators"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const handleAccept = (id) =>
    updateStatusMutation.mutate({ id, status: "accepted" });

  const handleReject = (id) =>
    updateStatusMutation.mutate({ id, status: "rejected" });

  const handleView = (decorator) =>
    navigate(`/decorator/${decorator._id}`, { state: decorator });

  // PAGINATION HANDLERS
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const pageNumbers = [...Array(totalPages).keys()].map((i) => i + 1);



  return (
    <div className="min-h-screen bg-base-100/50 px-4 md:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
             Manage Decorators
            </h1>
            
            {/* Status Filter Tabs */}
            {/* Premium Segmented Status Filter */}
            <div className="inline-flex bg-base-200/50 p-1 rounded-full border border-base-200 relative">
              {["pending", "accepted", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilterChange(status)}
                  className={`relative px-6 py-2 text-sm font-medium capitalize rounded-full transition-colors z-10 cursor-pointer ${
                    statusFilter === status ? "text-primary-content" : "text-base-content/60 hover:text-base-content"
                  }`}
                >
                  {statusFilter === status && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-primary rounded-full shadow-md z-[-1]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {status}
                </button>
              ))}
            </div>
        </motion.div>

        {isFetching && !isLoading && (
          <div className="fixed top-4 right-4 z-50">
             <span className="loading loading-spinner text-primary"></span>
          </div>
        )}

        {decorators.length === 0 && !isLoading && !isFetching ? (
          <div className="p-10 bg-base-100 rounded-2xl shadow-sm text-center border border-dashed border-base-300 mt-8">
            <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoMdEye className="text-2xl text-base-content/30" />
            </div>
            <p className="text-lg text-base-content/70 font-medium">
              No {statusFilter} applications found.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden mt-6">
              {isLoading ? (
                  <LoadingSpinner type="card" count={itemsPerPage} />
              ) : (
                 <AnimatePresence mode="wait">
                  {decorators.map((decorator, index) => (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={decorator._id}
                      className={`bg-base-100 rounded-2xl shadow-md border border-base-200 overflow-hidden group relative p-5 ${
                          decorator.status === 'pending' ? 'border-l-4 border-l-warning' :
                          decorator.status === 'accepted' ? 'border-l-4 border-l-success' :
                          'border-l-4 border-l-error'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-base-content">{decorator.fullName}</h3>
                          <p className="text-sm text-base-content/60">{decorator.email}</p>
                        </div>
                        <IoMdEye
                            onClick={() => handleView(decorator)}
                            className="text-2xl text-base-content/40 hover:text-primary cursor-pointer transition-colors"
                        />
                      </div>

                      <div className="space-y-2 mb-4">
                         <div className="flex items-center text-sm">
                            <span className="w-24 text-base-content/50">Phone:</span>
                            <span className="font-medium">{decorator.phoneNumber}</span>
                         </div>
                         <div className="flex items-start text-sm">
                            <span className="w-24 text-base-content/50 shrink-0">Specialties:</span>
                            <div className="flex flex-wrap gap-1">
                                {decorator.specialties.slice(0, 3).map((s, i) => (
                                    <span key={i} className="badge badge-xs badge-neutral">{s}</span>
                                ))}
                                {decorator.specialties.length > 3 && <span className="text-xs opacity-50">+{decorator.specialties.length - 3}</span>}
                            </div>
                         </div>
                      </div>

                      {decorator.status === "pending" && (
                        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-base-200">
                          <button
                            onClick={() => handleAccept(decorator._id)}
                            className="btn btn-success btn-sm text-white shadow-success/20 shadow-lg"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(decorator._id)}
                            className="btn btn-error btn-sm text-white shadow-error/20 shadow-lg"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                 </AnimatePresence>
              )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block mt-6">
              {isLoading ? (
                  <LoadingSpinner type="table" count={itemsPerPage} className="border-none" />
              ) : (
              <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 className="bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden"
              >
              <table className="table table-lg w-full">
                <thead className="bg-base-200/50">
                  <tr>
                    <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 pl-6">Applicant</th>
                    <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Contact</th>
                    <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Specialties</th>
                    <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 text-center">Status</th>
                    <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="">
                  {decorators.map((decorator, index) => (
                    <tr
                      key={decorator._id}
                      className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none"
                    >
                      <td className="pl-6">
                         <div className="flex items-center space-x-3">
                            <div className="avatar">
                                <div className="w-10 rounded-full ring-2 ring-base-200">
                                    <img 
                                        src={decorator.profileImage || `https://ui-avatars.com/api/?name=${decorator.fullName}&background=random`} 
                                        alt={decorator.fullName}
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src=`https://ui-avatars.com/api/?name=${decorator.fullName}&background=random`
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="font-bold">{decorator.fullName}</div>
                                <div className="text-xs opacity-50">Applied: {decorator.createdAt ? new Date(decorator.createdAt).toLocaleDateString() : "N/A"}</div>
                            </div>
                        </div>
                      </td>
                      <td>
                          <div className="flex flex-col text-sm">
                             <span className="font-medium">{decorator.email}</span>
                             <span className="text-base-content/50 text-xs">{decorator.phoneNumber}</span>
                          </div>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                           {decorator.specialties.slice(0, 2).map((s, i) => (
                                <span key={i} className="badge badge-sm badge-ghost">{s}</span>
                           ))}
                           {decorator.specialties.length > 2 && <span className="text-xs opacity-50">+{decorator.specialties.length - 2}</span>}
                        </div>
                      </td>
                      <td className="text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            decorator.status === "pending"
                              ? "bg-warning/10 text-warning border border-warning/20"
                              : decorator.status === "accepted"
                              ? "bg-success/10 text-success border border-success/20"
                              : "bg-error/10 text-error border border-error/20"
                          }`}
                        >
                          {decorator.status}
                        </span>
                      </td>
                      <td className="pr-6 text-right">
                         <div className="flex items-center justify-end gap-2">
                             <button 
                                onClick={() => handleView(decorator)}
                                className="btn btn-circle btn-ghost btn-sm tooltip tooltip-left"
                                data-tip="View Details"
                             >
                                <IoMdEye className="text-lg" />
                             </button>
                             
                            {decorator.status === "pending" && (
                            <>
                                <button
                                    onClick={() => handleAccept(decorator._id)}
                                    className="btn btn-success btn-xs text-white"
                                    disabled={isFetching}
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleReject(decorator._id)}
                                    className="btn btn-error btn-xs text-white"
                                    disabled={isFetching}
                                >
                                    Reject
                                </button>
                            </>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </motion.div>
              )}
            </div>

            {/* PAGINATION CONTROLS - IMPROVED STYLING */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 mb-8">
                <div className="flex items-center gap-2 bg-base-100 p-2 rounded-2xl shadow-sm border border-base-200">
                  {/* Previous Button */}
                  <button
                    className="btn btn-sm btn-circle btn-ghost hover:bg-primary/10 hover:text-primary transition-all disabled:bg-transparent"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isFetching}
                  >
                    <FiChevronLeft />
                  </button>

                  {/* Page Buttons */}
                  <div className="flex gap-1">
                    {pageNumbers.map((page) => (
                        <button
                        key={page}
                        className={`btn btn-sm btn-circle transition-all ${
                            currentPage === page
                            ? "btn-primary shadow-lg shadow-primary/30"
                            : "btn-ghost hover:bg-base-200"
                        }`}
                        onClick={() => handlePageChange(page)}
                        disabled={isFetching}
                        >
                        {page}
                        </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    className="btn btn-sm btn-circle btn-ghost hover:bg-primary/10 hover:text-primary transition-all disabled:bg-transparent"
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
    </div>
  );
};

export default ManageDecorators;
