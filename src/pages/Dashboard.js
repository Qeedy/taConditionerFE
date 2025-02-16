import React from "react";
import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CFormTextarea,
} from "@coreui/react";
import { Banner } from "../components/Banner";
import dashboardManImage from "../images/afterLoginMan.png";
import dashboardTechImage from "../images/afterLoginTechnician.png";
import dashboardFemaleImage from "../images/afterLogin.png";
import AuthService from "../services/AuthService";
import CIcon from "@coreui/icons-react";
import * as icon from '@coreui/icons';
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
const Dashboard = () => {
  const userRole = AuthService.getUserRole();
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
