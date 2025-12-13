import React, { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users`);
      return res.data;
    },
  });

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

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-6 py-10 bg-background-dark ">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl text-primary font-bold mb-4">Manage Users</h1>
        
        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-base-200 border border-primary/20 rounded-xl p-4 backdrop-blur-sm"
            >
              {/* User Photo */}
              <img
                src={user.image || "https://i.ibb.co/V3NqB0F/user.png"}
                alt={user.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />

              {/* Name & Email */}
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className=" mt-1">{user.email}</p>

              {/* Role */}
              <p className="mt-1">
                Role:{" "}
                <span className="badge badge-primary">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </p>

              {/* Change Role */}
              <div className="mt-3">
                <select
                  defaultValue={user.role}
                  className="select select-bordered select-sm w-full bg-gray-700/98"
                  onChange={(e) => handleRoleChangeClick(user, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="decorator">Decorator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block bg-white/5 backdrop-blur-md rounded-xl shadow-xl border border-base-300 overflow-x-auto">
          <table className="w-full table min-w-[900px]">
            <thead>
              <tr className="border-b border-white/10 ">
                <th className="px-6 py-4 text-left">#</th>
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Change Role</th>
              </tr>
            </thead>

            <tbody className="">
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td className="px-6 py-4">{index + 1}</td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user?.image}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span>{user.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 ">{user.email}</td>

                  <td className="px-6 py-4">
                    <span className="badge badge-primary">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <select
                      defaultValue={user.role}
                      className="select select-bordered select-sm bg-gray-700/98"
                      onChange={(e) =>
                        handleRoleChangeClick(user, e.target.value)
                      }
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
        </div>
      </div>

      {/* MODAL */}
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
