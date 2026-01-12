import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
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




  return (
    <div className="min-h-screen px-4 md:px-8 py-10 bg-base-100/50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Today&apos;s Schedule</h1>
            <p className="text-base-content/70">
               Your tasks for today. <span className="badge badge-neutral ml-2">{totalCount} Project{totalCount !== 1 && 's'}</span>
            </p>
        </motion.div>
      
      {isFetching && !isLoading && (
          <div className="fixed top-4 right-4 z-50">
            <span className="loading loading-spinner text-primary"></span>
          </div>
      )}

      {projects.length === 0 && !isFetching && !isLoading ? (
        <div className="p-10 bg-base-100 rounded-2xl shadow-sm text-center border border-dashed border-base-300 mt-8">
            <p className="text-xl text-base-content/50 font-medium">No projects scheduled for today.</p>
            <p className="text-sm text-base-content/40 mt-1">Enjoy your day!</p>
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden mt-6">
            {isLoading ? (
                <LoadingSpinner type="card" count={itemsPerPage} />
            ) : (
                <AnimatePresence>
                {projects.map((project, index) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    key={project._id}
                    className="bg-base-100 rounded-2xl shadow-md border border-base-200 p-5 relative overflow-hidden"
                  >
                     <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${statusColors[project.status]?.split(' ')[0].replace('/20', '') || 'bg-gray-400'}`}></div>

                    <div className="flex justify-between items-start mb-2 pl-3">
                      <div>
                          <h2 className="text-lg font-bold text-base-content">{project.service_name}</h2>
                          <p className="text-sm text-base-content/60">{project.userName}</p>
                      </div>
                      <span className="text-xs font-mono opacity-50">#{index + 1}</span>
                    </div>

                    <div className="pl-3 space-y-2 mt-4">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold w-16 text-base-content/50">Time:</span>
                            <span className="badge badge-neutral">{project.time}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                            <span className="font-semibold w-16 text-base-content/50">Loc:</span>
                            <span className="flex-1">{project.location}</span>
                        </div>
                    </div>

                    <div className="mt-4 pl-3">
                        <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide border ${
                            statusColors[project.status] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        } ${statusColors[project.status]?.includes('border') ? '' : 'border-current opacity-80'}`}
                        >
                        {project.status.replace(/_/g, " ")}
                        </span>
                    </div>
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
            <table className="table table-lg w-full min-w-[900px]">
              <thead className="bg-base-200/50">
                <tr>
                  <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 pl-6">#</th>
                  <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Project Details</th>
                  <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Client</th>
                  <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Schedule</th>
                  <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project, index) => (
                  <tr key={project._id} className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none">
                    <td className="pl-6 font-mono text-base-content/40">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>
                        <div className="font-bold">{project.service_name}</div>
                        <div className="text-xs opacity-50 truncate max-w-[200px]" title={project.location}>{project.location}</div>
                    </td>
                    <td>
                        <div className="font-medium">{project.userName}</div>
                    </td>
                    <td>
                        <span className="badge badge-neutral font-mono">{project.time}</span>
                    </td>
                    <td className="text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          statusColors[project.status] ||
                          "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        } ${statusColors[project.status]?.includes('border') ? '' : 'border-current opacity-80'}`}
                      >
                        {project.status.replace(/_/g, " ")}
                      </span>
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
            <div className="flex justify-center mt-12 mb-8">
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
    </div>
  );
};

export default TodaysSchedule;