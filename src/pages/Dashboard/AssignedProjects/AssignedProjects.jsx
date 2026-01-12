import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FiLoader, FiChevronLeft, FiChevronRight } from "react-icons/fi"; 
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import ConfirmStatusChangeModal from "../../../components/Shared/Modal/ConfirmStatusChangeModal";
import useAuth from "../../../hooks/useAuth"; 
import LoadingSpinner from "../../../components/LoadingSpinner";

const AssignedProjects = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // ADD PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; 

  const [selectedProject, setSelectedProject] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statuses = [
    "assigned", 
    "planning",
    "materials_prepared",
    "on_the_way",
    "setup_in_progress",
    "completed",
  ];

  const statusStyles = {
    pending: "bg-yellow-500/20 text-yellow-400", 
    assigned: "bg-blue-500/20 text-blue-400",
    planning: "bg-purple-500/20 text-purple-400",
    materials_prepared: "bg-amber-500/20 text-amber-400",
    on_the_way: "bg-sky-500/20 text-sky-400",
    setup_in_progress: "bg-orange-500/20 text-orange-400",
    completed: "bg-green-500/20 text-green-400",
  };

  const format = (t) => (t ? t.replace(/_/g, " ") : "N/A");

  const { 
    data: projectData = {}, 
    isLoading, 
    isFetching 
  } = useQuery({
    queryKey: ["assignedProjects", user?.email, currentPage, itemsPerPage], 
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/assigned`, {
        params: {
          decoratorEmail: user?.email,
          page: currentPage, 
          size: itemsPerPage, 
        },
      });
      return res.data; // Expected format: { projects: [...], count: N }
    },
    enabled: !!user?.email,
    keepPreviousData: true,
  });

  // Extract data for clarity
  const projects = projectData.projects || [];
  const totalCount = projectData.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const { mutateAsync } = useMutation({
    mutationFn: async ({ id, status, decoratorId }) =>
      await axiosSecure.patch(`/bookings/${id}/assigned`, {
        status,
        decoratorId,
      }),
    onSuccess: () => {
      toast.success("Status updated!");
      queryClient.invalidateQueries(["assignedProjects", user?.email]);
      setIsModalOpen(false);
    },
    onError: () => toast.error("Failed to update status."),
  });

  const handleStatusChangeClick = (project, status) => {
    if (project.status === status) return;

    setSelectedProject(project);
    setNewStatus(status);
    setIsModalOpen(true);
  };

  const confirmStatusUpdate = () => {
    mutateAsync({
      id: selectedProject._id,
      status: newStatus,
      decoratorId: selectedProject.decoratorId, 
    });
  };
  
  // PAGINATION HANDLERS
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = [...Array(totalPages).keys()].map(i => i + 1);


  
  if (projects.length === 0 && !isFetching && !isLoading) {
    return (
        <div className="min-h-screen px-4 md:px-8 py-10 bg-base-100/50">
           <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">Assigned Projects</h1>
                <div className="p-12 bg-base-100 rounded-2xl shadow-sm text-center border border-dashed border-base-300">
                    <p className="text-xl font-semibold text-base-content/60">You have no active projects assigned.</p>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 bg-base-100/50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Assigned Projects</h1>
            <p className="text-base-content/70">
               Manage status and progress. <span className="badge badge-neutral ml-2">{totalCount} Active</span>
            </p>
        </motion.div>
      
      {isFetching && !isLoading && (
        <div className="fixed top-4 right-4 z-50">
             <span className="loading loading-spinner text-primary"></span>
        </div>
      )}

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 mt-6">
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
                className={`bg-base-100 border border-base-200 rounded-2xl p-5 shadow-md relative overflow-hidden`}
              >
                 <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${statusStyles[project.status]?.split(' ')[0].replace('/20', '') || 'bg-gray-400'}`}></div>

                {/* Title + Cost */}
                <div className="flex justify-between items-center mb-3 pl-3">
                  <h2 className="font-bold text-lg text-base-content">{project.service_name}</h2>
                  {/* Calculate index based on current page */}
                  <span className="text-xs font-mono opacity-50">#{(currentPage - 1) * itemsPerPage + index + 1}</span> 
                </div>

                {/* Client Info */}
                <div className="pl-3 text-sm space-y-2 text-base-content/70">
                  <p>
                    <span className="font-medium text-base-content">Client:</span> {project.userEmail}
                  </p>
                  <div className="flex gap-4">
                      <p>
                        <span className="font-medium text-base-content">Date:</span>{" "}
                        {project.date || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-base-content">Time:</span>{" "}
                        {project.time || "N/A"}
                      </p>
                  </div>
                  <p className="truncate">
                    <span className="font-medium text-base-content">Location:</span>{" "}
                    {project.location}
                  </p>
                </div>

                <div className="divider my-3"></div>

                {/* Status Update Select */}
                <div className="pl-3">
                  <label className="label pt-0"><span className="label-text-alt font-bold uppercase tracking-wider text-base-content/50">Update Status</span></label>
                  <select
                    defaultValue={project.status}
                    className={`w-full select select-bordered select-sm font-medium ${statusStyles[project.status]}`}
                    onChange={(e) =>
                      handleStatusChangeClick(project, e.target.value)
                    }
                    disabled={isFetching}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status} className="bg-base-100 text-base-content">
                        {format(status)}
                      </option>
                    ))}
                  </select>
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
              <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Project</th>
              <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Client</th>
              <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 text-center">Current Status</th>
              <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 text-right pr-6">Update Action</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project, index) => (
              <tr key={project._id} className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none">
                {/* Calculate index based on current page */}
                <td className="pl-6 font-mono text-base-content/40">{(currentPage - 1) * itemsPerPage + index + 1}</td> 
                <td className="font-bold">{project.service_name}</td>
                <td>{project.userEmail}</td>
                <td className="text-center">
                  <span className={`badge border-none font-bold uppercase tracking-wider text-[10px] py-3 ${statusStyles[project.status]}`}>
                    {format(project.status)}
                  </span>
                </td>
                <td className="text-right pr-6">
                  <select
                    defaultValue={project.status}
                    className="select select-bordered select-sm w-44 font-medium focus:border-primary"
                    onChange={(e) =>
                      handleStatusChangeClick(project, e.target.value)
                    }
                    disabled={isFetching}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {format(status)}
                      </option>
                    ))}
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

      <ConfirmStatusChangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmStatusUpdate}
        newStatus={newStatus}
      />
    </div>
    </div>
  );
};

export default AssignedProjects;