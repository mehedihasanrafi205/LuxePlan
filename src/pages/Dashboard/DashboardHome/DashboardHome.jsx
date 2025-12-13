import React from "react";
import useRole from "../../../hooks/useRole";
import LoadingSpinner from "../../../components/LoadingSpinner";
import DecoratorDashboardHome from "./DecoratorDashboardHome";
import UserDashboardHome from "./UserDashboardHome";
import AdminDashboardHome from "./AdminDashboardHome";

const DashboardHome = () => {
  const { role, isRoleLoading } = useRole();
  if (isRoleLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  if (role === "admin") {
    return <AdminDashboardHome></AdminDashboardHome>;
  } else if (role === "decorator") {
    return <DecoratorDashboardHome></DecoratorDashboardHome>;
  } else {
    return <UserDashboardHome></UserDashboardHome>;
  }
};

export default DashboardHome;
