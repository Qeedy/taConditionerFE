import React from "react";
import AuthService from "../services/AuthService";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
const Dashboard = () => {
  const profileData = JSON.parse(localStorage.getItem("user"));

  const renderDashboard = () => {
    switch (profileData.role) {
      case "ADMIN":
        return <AdminDashboard />;
      case "TECHNICIAN":
        return <UserDashboard />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <>
        {renderDashboard()}
    </>
  );
};

export default Dashboard;
