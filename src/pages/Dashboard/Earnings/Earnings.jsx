import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FiLoader } from "react-icons/fi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";

const EarningsPage = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch earnings
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["completed", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/booking/completed?decoratorEmail=${user?.email}`
      );
      return res.data;
    },
  });

  // Calculate total earnings (sum of completed bookings)
  const totalEarnings = projects.reduce(
    (sum, project) => sum + project.cost,
    0
  );

  // Calculate payout per project (80% of cost)
  const calculatePayout = (project) => project.cost * 0.8;

  if (isLoading) {
    return <LoadingSpinner />;
  }





  
  return (
    <div className="min-h-screen px-4 md:px-6 py-10 ">
      <h1 className="text-3xl font-bold mb-6">My Earnings</h1>

      <div className="mb-6">
        <p className="text-lg">
          Total Earnings:{" "}
          <span className="font-bold text-green-400">৳ {totalEarnings}</span>
        </p>
      </div>

      {/*  MOBILE CARDS VIEW  */}

      <div className="space-y-4 md:hidden">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-base-200 border border-primary/20 rounded-xl p-4 backdrop-blur-sm shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{project.service_name}</h3>
              <span
                className={`badge ${
                  project.status === "completed"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {project.status}
              </span>
            </div>

            <p className="text-sm">
              <span className="font-semibold">Client:</span> {project.userEmail}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(project.date).toLocaleDateString()}
            </p>

            <div className="mt-3">
              <p className="font-semibold text-primary">
                Cost: ৳ {project.cost}
              </p>
              <p className="font-semibold text-green-400">
                Payout: ৳ {calculatePayout(project)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-white/5 rounded-xl overflow-x-auto shadow-xl border border-base-300">
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
                <td>{index + 1}</td>
                <td>{project.service_name}</td>
                <td>{project.userEmail}</td>
                <td>{new Date(project.date).toLocaleDateString()}</td>
                <td>{project.cost}</td>
                <td>{calculatePayout(project)}</td>
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
    </div>
  );
};

export default EarningsPage;
