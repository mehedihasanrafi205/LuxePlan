import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiLoader, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";

const EarningsPage = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const {
    data: earningsData = {},
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["completed", user?.email, currentPage, itemsPerPage],
    queryFn: async () => {
      const res = await axiosSecure.get(`/booking/completed`, {
        params: {
          decoratorEmail: user?.email,
          page: currentPage,
          size: itemsPerPage,
        },
      });
      return res.data;
    },
    enabled: !!user?.email,
    keepPreviousData: true,
  });

  // Extract data for clarity
  const projects = earningsData.projects || [];
  const totalCount = earningsData.count || 0;
  const totalEarnings = earningsData.totalEarnings || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const calculatePayout = (project) => project.cost * 0.8;

  // PAGINATION HANDLERS
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = [...Array(totalPages).keys()].map((i) => i + 1);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen px-4 md:px-6 py-10 ">
      <h1 className="text-3xl font-bold mb-6">My Earnings</h1>

      {isFetching && (
        <div className="text-center text-primary mb-4">
          <FiLoader className="inline animate-spin mr-2" /> Loading earnings...
        </div>
      )}

      <div className="mb-6">
        <p className="text-lg">
          Total Earnings:{" "}
          <span className="font-bold text-green-400">
            ৳ {totalEarnings.toFixed(2)}
          </span>
        </p>
        <p className="text-sm text-gray-400">
          Based on {totalCount} completed projects.
        </p>
      </div>

      {projects.length === 0 && !isFetching ? (
        <p className="text-gray-400">No completed projects found.</p>
      ) : (
        <>
          {/* MOBILE CARDS VIEW */}
          <div
            className={`space-y-4 md:hidden ${isFetching ? "opacity-50" : ""}`}
          >
            {projects.map((project, index) => (
              <div
                key={project._id}
                className="bg-base-200 border border-primary/20 rounded-xl p-4 backdrop-blur-sm shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">
                    {project.service_name}
                  </h3>
                  <span className="text-sm">
                    #{(currentPage - 1) * itemsPerPage + index + 1}
                  </span>
                </div>

                <p className="text-sm">
                  <span className="font-semibold">Client:</span>{" "}
                  {project.userEmail}
                </p>

                <p className="text-sm">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(project.date).toLocaleDateString()}
                </p>

                <div className="mt-3">
                  <p className="font-semibold text-primary">
                    Cost: ৳ {project.cost.toFixed(2)}
                  </p>
                  <p className="font-semibold text-green-400">
                    Payout: ৳ {calculatePayout(project).toFixed(2)}
                  </p>
                </div>
                <span
                  className={`badge mt-2 ${
                    project.status === "completed"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {project.status.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div
            className={`hidden md:block bg-white/5 rounded-xl overflow-x-auto shadow-xl border border-base-300 ${
              isFetching ? "opacity-50" : ""
            }`}
          >
            <table className="table w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th>#</th>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Cost (৳)</th>
                  <th>Payout (৳)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={project._id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{project.service_name}</td>
                    <td>{project.userEmail}</td>
                    <td>{new Date(project.date).toLocaleDateString()}</td>
                    <td>{project.cost.toFixed(2)}</td>
                    <td>{calculatePayout(project).toFixed(2)}</td>
                    <td>
                      <span
                        className={`badge ${
                          project.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {project.status.replace(/_/g, " ")}
                      </span>
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
  );
};

export default EarningsPage;
