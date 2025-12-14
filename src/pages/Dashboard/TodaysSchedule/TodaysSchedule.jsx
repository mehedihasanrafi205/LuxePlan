import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiLoader, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";

const TodaysSchedule = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth(); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; 

  const { 
    data: projectData = {}, 
    isLoading,
    isFetching 
  } = useQuery({
    queryKey: ["todaysSchedule", user?.email, currentPage, itemsPerPage], 
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/today`, {
          params: {
            decoratorEmail: user?.email,
            page: currentPage,
            size: itemsPerPage,
          },
        }
      );
      return res.data; 
    },
    enabled: !!user?.email,
    keepPreviousData: true,
  });

  // Extract data for clarity
  const projects = projectData.projects || [];
  const totalCount = projectData.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);


  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400",
    assigned: "bg-blue-500/20 text-blue-400",
    planning: "bg-purple-500/20 text-purple-400",
    materials_prepared: "bg-amber-500/20 text-amber-400",
    on_the_way: "bg-sky-500/20 text-sky-400",
    setup_in_progress: "bg-orange-500/20 text-orange-400",
    completed: "bg-green-500/20 text-green-400",
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
    <div className="min-h-screen px-4 md:px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Today's Schedule ({totalCount} Projects)</h1>
      
      {isFetching && (
        <div className="text-center text-primary mb-4">
          <FiLoader className="inline animate-spin mr-2" /> Fetching schedule...
        </div>
      )}

      {projects.length === 0 && !isFetching ? (
        <p className="text-gray-400">No projects scheduled for today.</p>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className={`space-y-4 md:hidden ${isFetching ? 'opacity-50' : ''}`}>
            {projects.map((project, index) => (
              <div
                key={project._id}
                className="bg-base-200 border border-primary/20 rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-lg font-semibold">{project.service_name}</h2>
                  <span className="text-sm ">#{(currentPage - 1) * itemsPerPage + index + 1}</span>
                </div>
                <p className="text-sm mt-1">Client: {project.userName}</p>
                <p className="text-sm mt-1">Time: {project.time}</p>
                <p className="text-sm mt-1">Location: {project.location}</p>

                <span
                  className={`inline-block mt-3 rounded-full px-3 py-1 text-xs font-semibold ${
                    statusColors[project.status] || "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {project.status.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
 

 
          {/* Desktop Table */}
          <div className={`hidden md:block bg-white/5 rounded-xl overflow-x-auto shadow-xl border border-base-300 ${isFetching ? 'opacity-50' : ''}`}>
            <table className="table w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th>#</th>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project, index) => (
                  <tr key={project._id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{project.service_name}</td>
                    <td>{project.userName}</td>
                    <td>{project.time}</td>
                    <td>{project.location}</td>
                    <td>
                      <span
                        className={`badge ${
                          statusColors[project.status] ||
                          "bg-gray-500/20 text-gray-400"
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

export default TodaysSchedule;