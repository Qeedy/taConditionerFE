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

const Bookings = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const profileData = AuthService.getProfileData;

  const handleFetchData = async (page = 0, search = "") => {
    try {
      const response = await api.get(
        `/booking/get-booking-list?role=${profileData.role}&page=${page}&size=5&search=${searchTerm}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileData.token}`,
          },
        }
      );

      setBookings(response.data.content);
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

  const handleViewClick = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  return (
    <CContainer>
      <CRow>
        <h1>Bookings</h1>
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
        <h4 className="mb-2">All bookings</h4>
      </CRow>

      <CTable className="custom-table" hover responsive>
        <CTableHead>
          <CTableRow className="bg-light">
            <CTableHeaderCell>Booking ID</CTableHeaderCell>
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
          {bookings.map((booking) => (
            <CTableRow key={booking.bookingId}>
              <CTableDataCell className="fw-semibold">
                {booking.bookingId}
              </CTableDataCell>
              <CTableDataCell>{booking.bookingDate}</CTableDataCell>
              <CTableDataCell>
                {
                  SERVICE_TIME_OPTIONS.find(
                    (option) => option.value === booking.serviceTime
                  )?.time
                }
              </CTableDataCell>
              <CTableDataCell>
                <CBadge
                  color={
                    booking.bookingStatus === "COMPLETED"
                      ? "success"
                      : booking.bookingStatus === "Cancelled"
                      ? "danger"
                      : booking.bookingStatus === "CONFIRMED"
                      ? "info"
                      : "warning"
                  }
                >
                  {booking.bookingStatus}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell>{booking.customerName}</CTableDataCell>
              <CTableDataCell>
                {
                  SERVICE_TYPE_OPTIONS.find(
                    (option) => option.value === booking.serviceType
                  )?.text
                }
              </CTableDataCell>
              <CTableDataCell>{booking.technicianName}</CTableDataCell>
              <CTableDataCell>{booking.createdDate}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  style={{ backgroundColor: "#4a90e2", color: "white" }}
                  className="rounded-pill fw-bold"
                  size="sm"
                  onClick={() => handleViewClick(booking.bookingId)}
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

export default Bookings;
