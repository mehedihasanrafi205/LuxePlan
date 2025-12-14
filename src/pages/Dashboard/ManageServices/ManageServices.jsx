import React, { useState } from "react";
import { FiEdit, FiChevronLeft, FiChevronRight, FiLoader } from "react-icons/fi"; 
import { IoMdEye } from "react-icons/io";
import { FaTrashAlt, FaStar } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../../components/Shared/Modal/DeleteConfirmationModal";
import EditServiceModal from "../../../components/Shared/Modal/EditServiceModal";
import { useNavigate } from "react-router";
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

  const { data: serviceData = {}, isLoading, isFetching } = useQuery({
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
  
  const pageNumbers = [...Array(totalPages).keys()].map(i => i + 1);


  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark px-4 md:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl text-primary font-bold mb-4">Manage Services ({totalCount} Total)</h1>
        
        {isFetching && <div className="text-center text-primary mb-4"><FiLoader className="inline animate-spin mr-2" /> Fetching services...</div>}

        {services.length === 0 && !isFetching ? (
          <div className="p-10 bg-base-100 rounded-xl shadow-xl text-center">
            <p className="text-xl text-primary font-semibold">No services have been added yet.</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-base-200 border border-primary/20 rounded-xl p-4 backdrop-blur-sm"
                >
                  <img
                    src={service.image}
                    alt={service.service_name}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h2 className="text-lg font-semibold">{service.service_name}</h2>
                  <p className=" mt-1">{service.service_category}</p>
                  <p className=" mt-1">
                    Cost: {service.cost} BDT / {service.unit}
                  </p>
                  <p className=" mt-1 flex items-center gap-1">
                    Rating: <FaStar className="text-yellow-400" /> {service.ratings || 5}
                  </p>
                  <p className=" mt-2 line-clamp-3">{service.description}</p>
                  <div className="flex justify-between mt-4">
                    <button onClick={() => handleView(service._id)} className="btn btn-sm btn-ghost p-2">
                        <IoMdEye className=" text-xl" />
                    </button>
                    <button onClick={() => handleEdit(service)} className="btn btn-sm btn-ghost p-2 text-blue-400 hover:text-blue-300">
                        <FiEdit className="text-lg" />
                    </button>
                    <button onClick={() => handleDeleteClick(service)} className="btn btn-sm btn-ghost p-2 text-red-400 hover:text-red-300">
                        <FaTrashAlt className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white/5 rounded-xl shadow-xl border border-base-300 backdrop-blur-sm overflow-x-auto">
              <table className="w-full table min-w-[900px]">
                <thead>
                  <tr className="border-b border-b-white/10">
                    <th className="px-6 py-4 text-left text-sm uppercase">#</th>
                    <th className="px-6 py-4 text-left text-sm uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-sm uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-sm uppercase">Cost / Unit</th>
                    <th className="px-6 py-4 text-left text-sm uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="">
                  {services.map((service, index) => (
                    <tr key={service._id} className={isFetching ? 'opacity-50' : ''}>
                      {/* Calculate index based on current page */}
                      <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4 ">{service.service_name}</td>
                      <td className="px-6 py-4 ">{service.service_category}</td>
                      <td className="px-6 py-4 0">
                        {service.cost} BDT / {service.unit}
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-3">
                        <button onClick={() => handleView(service._id)} className="btn btn-xs btn-ghost p-2" disabled={isFetching}>
                             <IoMdEye className=" text-xl" />
                        </button>
                        <button onClick={() => handleEdit(service)} className="btn btn-xs btn-ghost p-2 text-blue-400 hover:text-blue-300" disabled={isFetching}>
                            <FiEdit className="text-lg" />
                        </button>
                        <button onClick={() => handleDeleteClick(service)} className="btn btn-xs btn-ghost p-2 text-red-400 hover:text-red-300" disabled={isFetching}>
                            <FaTrashAlt className="text-lg" />
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