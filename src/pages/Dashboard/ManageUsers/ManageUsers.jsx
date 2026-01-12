import React, { useState } from "react";
import { FiLoader, FiChevronLeft, FiChevronRight, FiUser, FiCheckCircle } from "react-icons/fi"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import ConfirmRoleChangeModal from "../../../components/Shared/Modal/ConfirmRoleChangeModal";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  //  ADD PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // React Query fetch
  const {
    data: userData = {},
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["allUsers", currentPage, itemsPerPage],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users`, {
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
  const users = userData.users || [];
  const totalCount = userData.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const { mutateAsync } = useMutation({
    mutationFn: async ({ id, role }) =>
      await axiosSecure.patch(`/users/${id}`, { role }),

    onSuccess: () => {
      toast.success("Role updated successfully!");
      queryClient.invalidateQueries(["allUsers"]);
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to update role.");
    },
  });

  const handleRoleChangeClick = (user, role) => {
    if (user.role === role) return;

    setSelectedUser(user);
    setNewRole(role);
    setIsModalOpen(true);
  };

  const confirmRoleChange = () => {
    mutateAsync({ id: selectedUser._id, role: newRole });
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = [...Array(totalPages).keys()].map((i) => i + 1);

  const roleColors = {
      admin: "badge-error",
      decorator: "badge-warning",
      user: "badge-ghost bg-base-300"
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 bg-base-100/50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Manage Users</h1>
             <p className="text-base-content/70">
                Oversee user roles and permissions. <span className="badge badge-neutral ml-2">{totalCount} Total</span>
            </p>
        </motion.div>

        {isFetching && !isLoading && (
            <div className="fixed top-4 right-4 z-50">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        )}

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
         {isLoading ? (
             <LoadingSpinner type="card" count={itemsPerPage} />
         ) : (
          <AnimatePresence>
          {users.map((user, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              key={user._id}
              className="bg-base-100 border border-base-200 rounded-2xl p-5 shadow-lg relative overflow-hidden"
            >
             <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>

             <div className="flex items-start gap-4 mb-4">
                 <div className="avatar">
                    <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={user.image || "https://i.ibb.co/V3NqB0F/user.png"} alt={user.name} />
                    </div>
                 </div>
                 <div>
                     <h2 className="text-lg font-bold text-base-content">{user.name}</h2>
                     <p className="text-sm text-base-content/60">{user.email}</p>
                     <span className={`badge mt-2 ${roleColors[user.role] || 'badge-ghost'}`}>
                        {user.role}
                     </span>
                 </div>
             </div>

              {/* Change Role */}
              <div className="form-control w-full">
                <label className="label">
                    <span className="label-text text-xs uppercase font-bold text-base-content/50">Change Role</span>
                </label>
                <select
                  defaultValue={user.role}
                  className="select select-bordered select-sm w-full font-medium "
                  onChange={(e) => handleRoleChangeClick(user, e.target.value)}
                  disabled={isFetching}
                >
                  <option value="user">User</option>
                  <option value="decorator">Decorator</option>
                  <option value="admin">Admin</option>
                </select>
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
                <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">User Profile</th>
                <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Email Address</th>
                <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 text-center">Current Role</th>
                <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 text-right pr-6">Manage Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none">
                  <td className="pl-6 font-mono text-base-content/40">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>

                  <td>
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-1">
                          <img
                            src={user?.image || "https://i.ibb.co/V3NqB0F/user.png"}
                            alt={user.name}
                          />
                        </div>
                      </div>
                      <span className="font-semibold text-base-content">{user.name}</span>
                    </div>
                  </td>

                  <td className="text-base-content/70 font-medium">{user.email}</td>

                  <td className="text-center">
                    <span className={`badge uppercase text-[10px] font-bold tracking-wider py-2.5 ${roleColors[user.role] || 'badge-ghost'}`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="text-right pr-6">
                    <select
                      defaultValue={user.role}
                      className="select select-bordered select-sm w-36 font-medium focus:border-primary cursor-pointer"
                      onChange={(e) =>
                        handleRoleChangeClick(user, e.target.value)
                      }
                      disabled={isFetching}
                    >
                      <option value="user">User</option>
                      <option value="decorator">Decorator</option>
                      <option value="admin">Admin</option>
                    </select>
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
                    currentPage === page ? "btn-primary text-primary-content shadow-md" : "btn-ghost hover:bg-base-200"
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
      </div>

      {/* MODAL (Unchanged) */}
      <ConfirmRoleChangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmRoleChange}
        user={selectedUser}
        newRole={newRole}
      />
    </div>
  );
};

export default ManageUsers;
