import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background-dark px-4 md:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl text-primary font-bold mb-4">
          Manage Decorator Applications ({totalCount} Total{" "}
          {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)})
        </h1>

        {/* Status Filter */}
        <div className="mb-4 flex gap-2">
          {["pending", "accepted", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilterChange(status)}
              className={`btn btn-sm ${
                statusFilter === status ? "btn-primary" : "btn-outline"
              }`}
              disabled={isFetching}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {isFetching && (
          <div className="text-center text-primary mb-4">
            <FiLoader className="inline animate-spin mr-2" /> Loading
            decorators...
          </div>
        )}

        {decorators.length === 0 && !isFetching ? (
          <div className="p-10 bg-base-100 rounded-xl shadow-xl text-center">
            <p className="text-xl text-primary font-semibold">
              No {statusFilter} applications found.
            </p>
          </div>
        ) : (
          <>
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
            <div className="hidden md:block bg-white/5 rounded-xl shadow-xl border border-base-300 overflow-x-auto">
              <table className="w-full table min-w-[900px]">
                <thead>
                  <tr className="border-b border-b-white/10">
                    <th className="px-6 py-4 text-left text-sm uppercase">#</th>
                    <th className="px-6 py-4 text-left text-sm uppercase">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm uppercase">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm uppercase">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-sm uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm uppercase">
                      Specialties
                    </th>
                    <th className="px-6 py-4 text-left text-sm uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {decorators.map((decorator, index) => (
                    <tr
                      key={decorator._id}
                      className={isFetching ? "opacity-50" : ""}
                    >
                      {/* Calculate index based on current page */}
                      <td className="px-6 py-4">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 ">{decorator.fullName}</td>
                      <td className="px-6 py-4">{decorator.email}</td>
                      <td className="px-6 py-4">{decorator.phoneNumber}</td>
                      <td className="px-6 py-4 ">
                        <span
                          className={`badge ${
                            decorator.status === "pending"
                              ? "badge-warning"
                              : decorator.status === "accepted"
                              ? "badge-success"
                              : "badge-error"
                          }`}
                        >
                          {decorator.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 ">
                        {decorator.specialties.join(", ")}
                      </td>
                      <td className="px-6 py-4 flex gap-2 items-center">
                        <IoMdEye
                          onClick={() => handleView(decorator)}
                          className="text-xl cursor-pointer"
                        />
                        {decorator.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleAccept(decorator._id)}
                              className="btn btn-success btn-xs"
                              disabled={isFetching}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(decorator._id)}
                              className="btn btn-error btn-xs"
                              disabled={isFetching}
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
    </div>
  );
};

export default ManageDecorators;
