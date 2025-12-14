import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }
  
  if (projects.length === 0 && !isFetching) {
    return (
        <div className="min-h-screen px-4 md:px-6 py-10">
            <h1 className="text-3xl font-bold mb-6">Assigned Projects</h1>
            <div className="p-10 bg-base-100/50 rounded-xl shadow-xl text-center">
                <p className="text-xl font-semibold">You have no active projects assigned.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-6 py-10 ">
      <h1 className="text-3xl font-bold mb-6">Assigned Projects ({totalCount} Total)</h1>
      
      {isFetching && (
        <div className="text-center text-primary mb-4">
          <FiLoader className="inline animate-spin mr-2" /> Fetching projects...
        </div>
      )}

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 mt-6">
        {projects.map((project, index) => (
          <div
            key={project._id}
            className={`bg-[#fdfbf7] border border-primary/20 rounded-xl p-4 backdrop-blur-sm shadow-lg ${isFetching ? 'opacity-50' : ''}`}
          >
            {/* Title + Cost */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">{project.service_name}</h2>
              {/* Calculate index based on current page */}
              <span className="text-sm ">#{(currentPage - 1) * itemsPerPage + index + 1}</span> 
            </div>

            {/* Client Info */}
            <div className=" text-sm space-y-1">
              <p>
                <span className="font-medium">Client:</span> {project.userEmail}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {project.date || "N/A"}
              </p>
              <p>
                <span className="font-medium">Time:</span>{" "}
                {project.time || "N/A"}
              </p>
              <p>
                <span className="font-medium">Location:</span>{" "}
                {project.location}
              </p>
            </div>

            {/* Status */}
            <div className="mt-3">
              <span
                className={`px-3 py-1 rounded-lg text-xs ${
                  statusStyles[project.status]
                }`}
              >
                {format(project.status)}
              </span>
            </div>

            {/* Status Update Select */}
            <div className="mt-4">
              <select
                defaultValue={project.status}
                className="w-full select select-bordered bg-gray-800 text-sm"
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
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="bg-white/5 hidden md:block rounded-xl shadow-xl border border-base-300 overflow-x-auto">
        <table className="table w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-white/10 ">
              <th>#</th>
              <th>Project</th>
              <th>Client</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project, index) => (
              <tr key={project._id} className={isFetching ? 'opacity-50' : ''}>
                {/* Calculate index based on current page */}
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td> 
                <td>{project.service_name}</td>
                <td>{project.userEmail}</td>
                <td>
                  <span className={`badge ${statusStyles[project.status]}`}>
                    {format(project.status)}
                  </span>
                </td>
                <td>
                  <select
                    defaultValue={project.status}
                    className="select select-bordered select-sm bg-gray-700/98 text-white"
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

      <ConfirmStatusChangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmStatusUpdate}
        newStatus={newStatus}
      />
    </div>
  );
};

export default AssignedProjects;