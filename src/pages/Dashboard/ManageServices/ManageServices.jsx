import React, { useState } from "react";
import {
  FiEdit,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
  FiTrash2,
} from "react-icons/fi";
import { IoMdAdd, IoMdEye } from "react-icons/io";
import { FaTrashAlt, FaStar } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../../components/Shared/Modal/DeleteConfirmationModal";
import EditServiceModal from "../../../components/Shared/Modal/EditServiceModal";
import { Link, useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ManageServices = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [editingService, setEditingService] = useState(null);
  const [deleteService, setDeleteService] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ADD PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const {
    data: serviceData = {},
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["adminServices", currentPage, itemsPerPage],
    queryFn: async () => {
      const res = await axiosSecure.get(`/services`, {
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
  const services = serviceData.services || [];
  const totalCount = serviceData.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/service/${id}`),
    onSuccess: () => {
      toast.success("Service deleted successfully");
      queryClient.invalidateQueries(["adminServices"]);
      setIsDeleteOpen(false);
      if (services.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    },
    onError: () => toast.error("Failed to delete service"),
  });

  const handleDeleteClick = (service) => {
    setDeleteService(service);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deleteService) {
      deleteMutation.mutate(deleteService._id);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
  };

  const handleCloseEditModal = () => {
    setEditingService(null);
    queryClient.invalidateQueries(["adminServices"]);
  };

  const handleView = (id) => {
    navigate(`/service/${id}`);
  };

  // PAGINATION HANDLERS
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
                 <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Manage Services</h1>
                 <p className="text-base-content/70">
                    Create and edit service offerings. <span className="badge badge-neutral ml-2">{totalCount} Services</span>
                 </p>
            </div>
            <Link
                to={"/dashboard/add-service"}
                className="btn btn-primary rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold gap-2"
            >
                <IoMdAdd size={20} /> Add Service
            </Link>
        </motion.div>

        {isFetching && !isLoading && (
            <div className="fixed top-4 right-4 z-50">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        )}

        {services.length === 0 && !isFetching && !isLoading ? (
          <div className="p-12 bg-base-100 rounded-2xl shadow-sm text-center border border-dashed border-base-300">
             <div className="text-6xl mb-4">✨</div>
             <h3 className="text-xl font-bold text-base-content mb-2">No services found</h3>
             <p className="text-base-content/60 mb-6">Get started by creating your first service package.</p>
             <Link to="/dashboard/add-service" className="btn btn-outline btn-primary">Add New Service</Link>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
             {isLoading ? (
                 <LoadingSpinner type="card" count={itemsPerPage} />
             ) : (
             <AnimatePresence>
              {services.map((service, index) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  key={service._id}
                  className="bg-base-100 border border-base-200 rounded-2xl p-5 shadow-lg relative overflow-hidden group"
                >
                  {/* Image Header */}
                  <div className="relative h-40 -mx-5 -mt-5 mb-4 overflow-hidden">
                       <img
                        src={service.image}
                        alt={service.service_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 badge badge-warning shadow-md gap-1">
                          <FaStar className="text-xs" /> {service.ratings || 5}
                      </div>
                  </div>

                  <h2 className="text-xl font-bold text-base-content mb-1">{service.service_name}</h2>
                  <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">{service.service_category}</p>
                  
                  <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl font-bold text-base-content">{service.cost} BDT</span>
                      <span className="text-sm text-base-content/50">/ {service.unit}</span>
                  </div>

                  <p className="text-sm text-base-content/70 line-clamp-2 mb-5">{service.description}</p>
                  
                  <div className="divider my-0"></div>

                  <div className="flex justify-between items-center pt-3">
                    <button
                      onClick={() => handleView(service._id)}
                      className="btn btn-sm btn-ghost gap-2 text-base-content/70 hover:text-primary"
                    >
                      <IoMdEye /> View
                    </button>
                    <div className="flex gap-2">
                        <button
                        onClick={() => handleEdit(service)}
                        className="btn btn-sm btn-circle btn-ghost text-info hover:bg-info/10"
                        >
                        <FiEdit />
                        </button>
                        <button
                        onClick={() => handleDeleteClick(service)}
                        className="btn btn-sm btn-circle btn-ghost text-error hover:bg-error/10"
                        >
                        <FiTrash2 />
                        </button>
                    </div>
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
              <table className="table table-lg w-full min-w-[900px]">
                <thead className="bg-base-200/50">
                  <tr>
                    <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 pl-6">#</th>
                    <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Service Name</th>
                    <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Category</th>
                    <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Pricing Model</th>
                    <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr
                      key={service._id}
                      className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none"
                    >
                      <td className="pl-6 font-mono text-base-content/40">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td>
                          <div className="flex items-center gap-4">
                              <div className="avatar rounded-xl">
                                  <div className="w-12 h-12 rounded-xl">
                                      <img src={service.image} alt={service.service_name} />
                                  </div>
                              </div>
                              <div className="font-bold text-base-content">{service.service_name}</div>
                          </div>
                      </td>
                      <td>
                          <span className="badge badge-ghost bg-base-200 font-medium">
                            {service.service_category}
                          </span>
                      </td>
                      <td>
                         <div className="font-medium">
                            {service.cost} BDT <span className="text-xs text-base-content/50">/ {service.unit}</span>
                         </div>
                      </td>
                      <td className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                            <button
                            onClick={() => handleView(service._id)}
                            className="btn btn-sm btn-ghost hover:bg-base-200 tooltip tooltip-bottom"
                            data-tip="View Details"
                            disabled={isFetching}
                            >
                            <IoMdEye size={18} />
                            </button>
                            
                            <button
                            onClick={() => handleEdit(service)}
                            className="btn btn-sm btn-ghost text-info hover:bg-info/10 tooltip tooltip-bottom"
                            data-tip="Edit Service"
                            disabled={isFetching}
                            >
                            <FiEdit size={16} />
                            </button>
                            
                            <button
                            onClick={() => handleDeleteClick(service)}
                            className="btn btn-sm btn-ghost text-error hover:bg-error/10 tooltip tooltip-bottom"
                            data-tip="Delete Service"
                            disabled={isFetching}
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
          </>
        )}
      </div>

      {/* Delete Modal */}
      {isDeleteOpen && deleteService && (
        <DeleteConfirmationModal
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
          message={`Are you sure you want to delete "${deleteService.service_name}"? This action cannot be undone.`}
        />
      )}

      {/* Edit Modal */}
      {editingService && (
        <EditServiceModal
          service={editingService}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
};

export default ManageServices;
