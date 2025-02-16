import React, { useEffect, useState } from "react";
import {
  CButton,
  CCol,
  CContainer,
  CRow,
} from "@coreui/react";
import { Banner } from "../components/Banner";
import dashboardManImage from "../images/afterLoginMan.png";
import dashboardTechImage from "../images/afterLoginTechnician.png";
import dashboardFemaleImage from "../images/afterLogin.png";
import AuthService from "../services/AuthService";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import BookingCard from "../components/BookingCard";
import TaskCard from "../components/TaskCard";
import api from "../config/AxiosInstance";
const UserDashboard = () => {
  const gender = AuthService.getGender();
  const role = AuthService.getUserRole();
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const profileData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const imageDashboard = (() => {
    if (role === "USER") {
      if (gender === "MALE") return dashboardManImage;
      return dashboardFemaleImage;
    } else {
      return dashboardTechImage;
    }
  })();
  const handleClickAction = (bookingId) => {
    if (role === "USER") navigate(`/create-booking`);
    else navigate(`/tasks`);
  };
  const handleClickContact = (bookingId) => {
    navigate(`/contact`);
  };
  const userName = (() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData.fullName;
  })();

  const handleViewClick = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };
  const handleTaskClick = (bookingId) => {
    navigate(`/tasks/${bookingId}`);
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const formatRemainingTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const differenceInMilliseconds = date - now;
    const differenceInDays = Math.ceil(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    if (differenceInDays > 0) {
      return `remaining ${differenceInDays} days`;
    } else if (differenceInDays === 0) {
      return "happening today";
    } else {
      return `expired ${Math.abs(differenceInDays)} days ago`;
    }
  };

  const fetchDataRecentBookings = async () => {
    console.log(profileData);
    try {
      const response = await api.get(
        `/booking/get-booking-list?role=${profileData.role}&page=0&size=5&sort=insertedDate,desc`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileData.token}`,
          },
        }
      );

      setRecentBookings(response.data.content);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataUpcomingBookings = async () => {
    console.log(profileData);
    try {
      const response = await api.get(
        `/booking/get-booking-list?role=${profileData.role}&page=0&size=5&sort=bookingDate,asc`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileData.token}`,
          },
        }
      );

      setUpcomingBookings(response.data.content);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPendingTasks = async () => {
    try {
      const response = await api.get(
        `/task/get-task-list?page=0&size=5`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileData.token}`,
          },
        }
      );
      setPendingTasks(response.data.content);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataRecentBookings();
    fetchPendingTasks();
    fetchDataUpcomingBookings();
  }, []);

  return (
    <CContainer className="px-3 py-3">
      <CRow>
        <CCol>
          <CRow className="mt-4">
            <CCol>
              <Banner image={imageDashboard} isWithButton={false} />
            </CCol>
            <CCol className="d-flex flex-column justify-content-center">
              <CContainer className="py-4">
                <CRow>
                  <CCol className="mx-auto">
                    <h1>Hi, {userName}</h1>
                    <p>
                      Welcome back to Top Air Conditioner.
                      <br />
                      What would you like to do today?
                    </p>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs="auto">
                    <CButton
                      color="info"
                      textBgColor="light"
                      className="text-white fw-bold"
                      onClick={handleClickAction}
                    >
                      {role === "USER" ? "Book a Service" : "Do the Task"}
                    </CButton>
                  </CCol>
                  <CCol xs="auto">
                    <CButton
                      color="secondary"
                      textBgColor="light"
                      className="text-white fw-bold"
                      onClick={handleClickContact}
                    >
                      Contact Support
                    </CButton>
                  </CCol>
                </CRow>
              </CContainer>
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <h1>Upcoming {role === "USER" ? "Bookings" : "Tasks"}</h1>
          </CRow>

          {role === "USER" ? (
            upcomingBookings.length === 0 ? (
              <CRow className="mt-4 justify-content-center align-items-center text-center">
                <h4>
                  <CIcon
                    icon={icon.cilFolderOpen}
                    className="fw-bold"
                    size="xl"
                  />{" "}
                  No Upcoming Bookings
                </h4>
              </CRow>
            ) : (
              <CRow>
                {upcomingBookings.map((booking) => (
                  <>
                    <BookingCard
                      booking={booking}
                      formatRelativeTime={formatRelativeTime}
                      formatRemainingTime={formatRemainingTime}
                      handleViewClick={handleViewClick}
                    />
                    <hr />
                  </>
                ))}
              </CRow>
            )
          ) : pendingTasks.length === 0 ? (
            <CRow className="mt-4 justify-content-center align-items-center text-center">
              <h4>
                <CIcon
                  icon={icon.cilFolderOpen}
                  className="fw-bold"
                  size="xl"
                />{" "}
                No Upcoming Bookings
              </h4>
            </CRow>
          ) : (
            <CRow>
              {pendingTasks.map((booking) => (
                <>
                  <TaskCard
                    booking={booking}
                    formatRelativeTime={formatRelativeTime}
                    formatRemainingTime={formatRemainingTime}
                    handleTaskClick={handleTaskClick}
                  />
                  <hr />
                </>
              ))}
            </CRow>
          )}
          <CRow className="mt-4">
            <h1>Recent Bookings</h1>
          </CRow>
          {recentBookings.length === 0 ? (
            <CRow className="mt-4 justify-content-center align-items-center text-center">
              <h4>
                <CIcon
                  icon={icon.cilFolderOpen}
                  className="fw-bold"
                  size="xl"
                />{" "}
                No Recent Bookings
              </h4>
            </CRow>
          ) : (
            <CRow className="">
              {recentBookings.map((booking) => (
                <>
                  <BookingCard
                    booking={booking}
                    formatRelativeTime={formatRelativeTime}
                    formatRemainingTime={formatRemainingTime}
                    handleViewClick={handleViewClick}
                  />
                  <hr />
                </>
              ))}
            </CRow>
          )}
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default UserDashboard;
