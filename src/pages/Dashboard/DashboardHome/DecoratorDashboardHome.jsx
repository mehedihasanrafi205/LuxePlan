import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FiCalendar, FiCheckCircle, FiClock } from "react-icons/fi"; 
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";
import moment from "moment";

const useDecoratorDashboardData = (userEmail) => {
  const axiosSecure = useAxiosSecure();

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["decoratorProjects", userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/decorator/projects");
      return res.data;
    },
    enabled: !!userEmail,
  });

  const { data: todaySchedule = [], isLoading: isLoadingSchedule } = useQuery({
    queryKey: ["decoratorTodaySchedule", userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/decorator/today");
      return res.data;
    },
    enabled: !!userEmail,
  });

  const {
    data: earningsData = { totalEarnings: 0 },
    isLoading: isLoadingEarnings,
  } = useQuery({
    queryKey: ["decoratorEarnings", userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/decorator/earnings");
      return res.data; 
    },
    enabled: !!userEmail,
  });

  const completedProjects = projects.filter(
    (p) => p.status === "completed"
  ).length;

  const activeProjects = projects.length - completedProjects;

  return {
    projects,
    todaySchedule,
    totalEarnings: earningsData.totalEarnings,
    totalProjects: projects.length,
    completedProjects,
    activeProjects,
    isLoading: isLoadingProjects || isLoadingSchedule || isLoadingEarnings,
  };
};

const MetricCard = ({ icon, title, value, color }) => (
  <div
    className={`min-w-[200px] card bg-base-200 shadow-xl p-5 border-l-4 border-${color}`}
  >
    <div className="flex items-center">
      <span className={`text-${color} text-2xl mr-4`}>{icon}</span>
      <div>
        <p className="text-base-content/70">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const DecoratorDashboardHome = () => {
  const { user } = useAuth();
  const userName = user?.displayName || "Decorator";
  const userEmail = user?.email;

  const {
    projects,
    todaySchedule,
    totalEarnings,
    totalProjects,
    completedProjects,
    isLoading,
  } = useDecoratorDashboardData(userEmail);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-500/20";
      case "pending":
      case "assigned":
      case "planning":
        return "text-blue-400 bg-blue-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-extrabold text-primary mb-2">
        Welcome Back, {userName.split(" ")[0]} 👋
      </h2>
      <p className="text-base-content/70 mb-8">
        Manage your schedule and track your career progress.
      </p>

      <hr className="my-8 border-base-300" />

      <h3 className="text-2xl font-semibold mb-6 text-primary/90">
        Performance Overview
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        <MetricCard
          icon={<span className="text-green-500 font-bold text-2xl">৳</span>}
          title="Total Lifetime Earnings"
          value={`${totalEarnings.toLocaleString()} BDT`}
          color="success"
        />
        <MetricCard
          icon={<FiCalendar />}
          title="Total Assigned Projects"
          value={totalProjects}
          color="primary"
        />
        <MetricCard
          icon={<FiCheckCircle />}
          title="Projects Completed"
          value={completedProjects}
          color="success"
        />
      </div>

      <hr className="my-8 border-base-300" />

      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-1/2">
          <h3 className="text-2xl font-semibold mb-4 text-primary/90 flex items-center">
            <FiClock className="mr-2" /> Today's Schedule
          </h3>

          <div className="bg-base-200 p-4 rounded-xl shadow-lg min-h-[150px]">
            {todaySchedule.length === 0 ? (
              <p className="text-base-content/70">
                🎉 You have no projects scheduled for today.
              </p>
            ) : (
              <ul className="space-y-3">
                {todaySchedule.map((project) => (
                  <li
                    key={project._id}
                    className="border-b border-base-300 pb-2 last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{project.service_name}</p>
                      <span className="text-sm font-bold text-primary">
                        {project.time}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                        project.status
                      )} capitalize`}
                    >
                      {project.status.replace(/_/g, " ")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="lg:w-1/2 mt-8 lg:mt-0">
          <h3 className="text-2xl font-semibold mb-4 text-primary/90 flex items-center">
            <FiCalendar className="mr-2" /> Recent Projects
          </h3>

          <div className="bg-base-200 p-4 rounded-xl shadow-lg min-h-[150px]">
            {projects.length === 0 ? (
              <p className="text-base-content/70">
                No projects have been assigned yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <li
                    key={project._id}
                    className="border-b border-base-300 pb-2 last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{project.service_name}</p>
                      <span className="text-sm text-base-content/70">
                        {moment(project.date).format("MMM DD")}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                        project.status
                      )} capitalize`}
                    >
                      {project.status.replace(/_/g, " ")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecoratorDashboardHome;
