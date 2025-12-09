import React, { useState } from "react";
import { FiEdit, FiLoader } from "react-icons/fi";
import { IoMdEye } from "react-icons/io";
import { FaTrashAlt, FaStar } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../../components/Shared/Modal/DeleteConfirmationModal";
import EditServiceModal from "../../../components/Shared/Modal/EditServiceModal"; // import the edit modal

const ManageServices = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const queryClient = useQueryClient();

  const [editingService, setEditingService] = useState(null);
  const [deleteService, setDeleteService] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Fetch services
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/services`);
      return res.data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => axios.delete(`${API_URL}/service/${id}`),
    onSuccess: () => {
      toast.success("Service deleted successfully");
      queryClient.invalidateQueries(["services"]);
      setIsDeleteOpen(false);
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
    setEditingService(service); // open edit modal
  };

  const handleCloseEditModal = () => {
    setEditingService(null); // close edit modal
  };

  const handleView = (id) => {
    window.location.href = `/service/${id}`;
  };

  return (
    <div className="min-h-screen bg-background-dark text-white px-4 md:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-4">Manage Services</h1>
        <p className="text-white/60 mb-8">
          Add, edit, or delete services easily.
        </p>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <FiLoader className="animate-spin text-4xl text-primary" />
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-white/5 border border-primary/20 rounded-xl p-4 backdrop-blur-sm"
                >
                  <img
                    src={service.image}
                    alt={service.service_name}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h2 className="text-lg font-semibold">{service.service_name}</h2>
                  <p className="text-white/60 mt-1">{service.service_category}</p>
                  <p className="text-white/60 mt-1">
                    Cost: {service.cost} BDT / {service.unit}
                  </p>
                  <p className="text-white/60 mt-1 flex items-center gap-1">
                    Rating: <FaStar className="text-yellow-400" /> {service.ratings}
                  </p>
                  <p className="text-white/70 mt-2 line-clamp-3">{service.description}</p>
                  <div className="flex justify-between mt-4">
                    <IoMdEye
                      onClick={() => handleView(service._id)}
                      className="text-white/80 hover:text-white text-xl cursor-pointer"
                    />
                    <FiEdit
                      onClick={() => handleEdit(service)}
                      className="text-blue-400 hover:text-blue-300 text-lg cursor-pointer"
                    />
                    <FaTrashAlt
                      onClick={() => handleDeleteClick(service)}
                      className="text-red-400 hover:text-red-300 text-lg cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white/5 border border-primary/20 rounded-xl backdrop-blur-sm overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-b-white/10">
                    <th className="px-6 py-4 text-left text-white/70 text-sm uppercase">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm uppercase">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm uppercase">
                      Cost / Unit
                    </th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {services.map((service) => (
                    <tr key={service._id}>
                      <td className="px-6 py-4 text-white">{service.service_name}</td>
                      <td className="px-6 py-4 text-white/70">{service.service_category}</td>
                      <td className="px-6 py-4 text-white/70">
                        {service.cost} BDT / {service.unit}
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-3">
                        <IoMdEye
                          onClick={() => handleView(service._id)}
                          className="text-white/80 hover:text-white text-xl cursor-pointer"
                        />
                        <FiEdit
                          onClick={() => handleEdit(service)}
                          className="text-blue-400 hover:text-blue-300 text-lg cursor-pointer"
                        />
                        <FaTrashAlt
                          onClick={() => handleDeleteClick(service)}
                          className="text-red-400 hover:text-red-300 text-lg cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Delete Modal */}
      {isDeleteOpen && deleteService && (
        <DeleteConfirmationModal
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
          message={`Are you sure you want to delete "${deleteService.service_name}"?`}
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
