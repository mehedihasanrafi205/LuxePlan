import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiLoader } from "react-icons/fi";
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

  const { data: decorators = [], isLoading } = useQuery({
    queryKey: ["decorators", statusFilter],
    queryFn: async () => {
      const res = await axiosSecure.get(`/decorators?status=${statusFilter}`);
      return res.data;
    },
  });

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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background-dark  px-4 md:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl text-primary font-bold mb-4">
          Manage Decorator
        </h1>
        {/* Status Filter */}
        <div className="mb-4 flex gap-2">
          {["pending", "accepted", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`btn btn-sm ${
                statusFilter === status ? "btn-primary" : "btn-outline"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {decorators.map((decorator) => (
            <div
              key={decorator._id}
              className="bg-base-200 border border-primary/20 rounded-xl p-4 backdrop-blur-sm"
            >
              <div className="flex items-center mb-2">
                <div className="flex-1">
                  <p className="font-semibold ">{decorator.fullName}</p>
                  <p className=" text-sm">{decorator.email}</p>
                  <p className=" text-sm">{decorator.phoneNumber}</p>
                </div>
                <IoMdEye
                  onClick={() => handleView(decorator)}
                  className=" text-xl cursor-pointer"
                />
              </div>
              <p className=" mb-2">
                Specialties: {decorator.specialties.join(", ")}
              </p>
              <p className=" mb-2">Status: {decorator.status}</p>
              {decorator.status === "pending" && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleAccept(decorator._id)}
                    className="btn btn-success btn-sm flex-1"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(decorator._id)}
                    className="btn btn-error btn-sm flex-1"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white/5  rounded-xl shadow-xl border border-base-300 overflow-x-auto">
          <table className="w-full table min-w-[900px]">
            <thead>
              <tr className="border-b border-b-white/10">
                <th className="px-6 py-4 text-left  text-sm uppercase">Name</th>
                <th className="px-6 py-4 text-left text-sm uppercase">Email</th>
                <th className="px-6 py-4 text-left  text-sm uppercase">
                  Phone
                </th>
                <th className="px-6 py-4 text-left  text-sm uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left  text-sm uppercase">
                  Specialties
                </th>
                <th className="px-6 py-4 text-left  text-sm uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="">
              {decorators.map((decorator) => (
                <tr key={decorator._id}>
                  <td className="px-6 py-4 ">{decorator.fullName}</td>
                  <td className="px-6 py-4">{decorator.email}</td>
                  <td className="px-6 py-4">{decorator.phoneNumber}</td>
                  <td className="px-6 py-4 ">{decorator.status}</td>
                  <td className="px-6 py-4 ">
                    {decorator.specialties.join(", ")}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <IoMdEye
                      onClick={() => handleView(decorator)}
                      className="e text-xl cursor-pointer"
                    />
                    {decorator.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAccept(decorator._id)}
                          className="btn btn-success btn-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(decorator._id)}
                          className="btn btn-error btn-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageDecorators;
