import React, { useEffect, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CInputGroup,
  CFormInput,
  CContainer,
  CForm,
  CButton,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthService from "../services/AuthService";
import { SERVICE_TIME_OPTIONS } from "../constants/ServiceTimeConstants";
import { SERVICE_TYPE_OPTIONS } from "../constants/ServiceTypeConstants";
import api from "../config/AxiosInstance";

const Tasks = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const profileData = AuthService.getProfileData;

  const handleFetchData = async (page = 0, search = "") => {
    try {
      const response = await api.get(
        `/task/get-task-list?page=${page}&size=5&keyword=${searchTerm}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileData.token}`,
          },
        }
      );

      setTasks(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.number);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleFetchData(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handlePageChange = (page) => {
    const zeroBasedPage = page - 1;
    if (zeroBasedPage >= 0 && zeroBasedPage < totalPages) {
      setCurrentPage(zeroBasedPage);
    }
  };

  const handleViewClick = (bookingId, taskId, taskName) => {
    navigate(`/tasks/${bookingId}?taskId=${taskId}&taskName=${taskName}`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  return (
    <CContainer>
      <CRow>
        <h1>Tasks</h1>
      </CRow>
      <CRow className="mt-5">
        <CForm className="mb-4">
          <CInputGroup className="p-2 rounded-pill bg-light-subtle border-0 shadow-sm">
            <CIcon icon={cilSearch} className="text-secondary" size="lg" />
            <CFormInput
              placeholder="Search for bookings"
              className="border-0 bg-transparent text-muted"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </CInputGroup>
        </CForm>
      </CRow>
      <CRow className="mt-2">
        <h4 className="mb-2">All Tasks</h4>
      </CRow>

      <CTable className="custom-table" hover responsive>
        <CTableHead>
          <CTableRow className="bg-light">
            <CTableHeaderCell>Booking ID</CTableHeaderCell>
            <CTableHeaderCell>Task Name</CTableHeaderCell>
            <CTableHeaderCell>Booking Date</CTableHeaderCell>
            <CTableHeaderCell>Time</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Customer</CTableHeaderCell>
            <CTableHeaderCell>Service</CTableHeaderCell>
            <CTableHeaderCell>Technician</CTableHeaderCell>
            <CTableHeaderCell>Created Date</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {tasks.map((task) => (
            <CTableRow key={task.bookingId}>
              <CTableDataCell className="fw-semibold">
                {task.bookingId}
              </CTableDataCell>
              <CTableDataCell>
                {task.taskName}
              </CTableDataCell>
              <CTableDataCell>{task.bookingDate}</CTableDataCell>
              <CTableDataCell>
                {SERVICE_TIME_OPTIONS.find((option) => option.value === task.serviceTime)?.time}
              </CTableDataCell>
              <CTableDataCell>
                <CBadge
                   color={
                    task.bookingStatus === "COMPLETED"
                      ? "success"
                      : task.bookingStatus === "Cancelled"
                      ? "danger"
                      : task.bookingStatus === "CONFIRMED"
                      ? "info"
                      : "warning"
                  }
                >
                  {task.bookingStatus}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell>{task.customerName}</CTableDataCell>
              <CTableDataCell>
                {SERVICE_TYPE_OPTIONS.find((option) => option.value === task.serviceType)?.text}
              </CTableDataCell>
              <CTableDataCell>{task.technicianName}</CTableDataCell>
              <CTableDataCell>{task.createdDate}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  style={{ backgroundColor: "#4a90e2", color: "white" }}
                  className="rounded-pill fw-bold"
                  size="sm"
                  onClick={() => handleViewClick(task.bookingId, task.taskId, task.taskName)}
                >
                  View
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage + 1}
        onPageChange={handlePageChange}
      />
    </CContainer>
  );
};

export default Tasks;
