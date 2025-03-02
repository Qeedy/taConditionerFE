import React, { useEffect, useState } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
} from "@coreui/react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import BookingCard from "../components/BookingCard";
import TaskCard from "../components/TaskCard";
import api from "../config/AxiosInstance";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const profileData = JSON.parse(localStorage.getItem("user"));
  const [recentBookings, setRecentBookings] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBooking, setTotalBooking] = useState(0);
  const [totalTask, setTotalTask] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    revenue: [],
    bookings: [],
  });
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleViewClick = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };
  const handleTaskClick = (bookingId) => {
    navigate(`/tasks/${bookingId}`);
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

  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
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

  const getTotalRevenue = async () => {
    console.log(profileData);
    try {
      const response = await api.get(
        `/booking/get-revenue`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileData.token}`,
          },
        }
      );
      let revenue = Number(response.data);
      setTotalRevenue(revenue);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getTotalBooking = async () => {
    console.log(profileData);
    try {
      const response = await api.get(
        `/booking/get-total-bookings`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileData.token}`,
          },
        }
      );
      setTotalBooking(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getTotalTask = async () => {
    console.log(profileData);
    try {
      const response = await api.get(
        `/task/get-total-task`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileData.token}`,
          },
        }
      );
      setTotalTask(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(
        `/booking/get-transaction-history`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileData.token}`,
          },
        }
      );
      const data = response.data;

      setChartData({
        labels: data.labels,
        revenue: data.revenue,
        bookings: data.bookings,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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
    getTotalRevenue();
    getTotalBooking();
    getTotalTask();
    fetchDashboardData();
  }, []);

  return (
    <CContainer className="py-5">
      {/* Header */}
      <h2 className="fw-bold">Admin Dashboard</h2>

      {/* Quick Overview Section */}
      <h5 className="fw-bold mt-4">Quick Overview</h5>
      <CRow className="mb-4">
        <CCol md="4">
          <CCard className="p-4 text-center bg-light">
            <h3 className="fw-bold">Rp. {formatCurrency(totalRevenue)}</h3>
            <p className="fw-semibold text-muted">Total Revenue</p>
          </CCard>
        </CCol>
        <CCol md="4">
          <CCard className="p-4 text-center bg-light">
            <h3 className="fw-bold">{totalBooking}</h3>
            <p className="fw-semibold text-muted">Bookings</p>
          </CCard>
        </CCol>
        <CCol md="4">
          <CCard className="p-4 text-center bg-light">
            <h3 className="fw-bold">{totalTask}</h3>
            <p className="fw-semibold text-muted">Tasks</p>
          </CCard>
        </CCol>
      </CRow>

      {/* Charts Section */}
      <CRow>
        {/* Revenue Chart */}
        <CCol md="6">
          <h6 className="fw-bold">Revenue</h6>
          <Line
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  label: "Revenue",
                  data: chartData.revenue,
                  borderColor: "#4a90e2",
                  tension: 0.4,
                },
              ],
            }}
          />
        </CCol>

        {/* Bookings Chart */}
        <CCol md="6">
          <h6 className="fw-bold">Bookings</h6>
          <Bar
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  label: "Bookings",
                  data: chartData.bookings,
                  backgroundColor: "#4a90e2",
                },
              ],
            }}
          />
        </CCol>
      </CRow>

      {/* Pending Tasks */}
      <h5 className="fw-bold mt-5">Pending Tasks</h5>
      <CRow className="">
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

      {/* Recent Bookings */}
      <h5 className="fw-bold mt-5">Recent Bookings</h5>
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
    </CContainer>
  );
};

export default AdminDashboard;
