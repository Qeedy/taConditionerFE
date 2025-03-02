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
  CCol,
  CFormSelect,
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
import { BOOKING_STATUS, DATE_RANGES } from "../constants/ReportConstant";
import { DatePicker } from "@mui/x-date-pickers";

const Report = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState("MONTHLY");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [bookings, setBookings] = useState([]);
  const profileData = AuthService.getProfileData;

  const handleFetchData = async (
    page = 0,
    status,
    dateRange,
    dateFrom,
    dateTo
  ) => {
    try {
      const params = new URLSearchParams({
        status: status || "",
        dateRange,
        page: page,
        size: 10,
      });
  
      // Hanya tambahkan dateFrom dan dateTo jika tidak null
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);
  
      const response = await api.get(`/booking/report/preview?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${profileData.token}`,
        },
      });
  
      setBookings(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalData(response.data.totalElements);
      setCurrentPage(response.data.number);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  const handleExportDocument = async () => {
    try {

      const params = new URLSearchParams({
        status: status || "",
        dateRange,
      });
  
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);
  
      const response = await api.get(`/booking/report?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${profileData.token}`,
        },
        responseType: "blob"
      });
  
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `booking_l.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
    } catch (error) {
      console.error("Failed to export document:", error);
      alert("Error generating PDF");
    }
  };

  useEffect(() => {
    handleFetchData(currentPage, status, dateRange, dateTo, dateFrom);
  }, [currentPage, status, dateRange, dateTo, dateFrom]);

  const handlePageChange = (page) => {
    const zeroBasedPage = page - 1;
    if (zeroBasedPage >= 0 && zeroBasedPage < totalPages) {
      setCurrentPage(zeroBasedPage);
    }
  };

  return (
    <CContainer>
      <CRow>
        <h1>Report</h1>
      </CRow>
      <CRow className="mt-5 mb-3">
        <CCol md={4}>
          <label>Status</label>
          <CFormSelect
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {BOOKING_STATUS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol md={4}>
          <label>Date Range</label>
          <CFormSelect
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            {DATE_RANGES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </CFormSelect>
        </CCol>
      </CRow>
      {dateRange === "CUSTOM_DATE" && (
        <CRow>
          <CCol md={2}>
            <label>From</label>
            <DatePicker
              selected={dateFrom}
              onChange={(date) => setDateFrom(date)}
              className="form-control"
              dateFormat="yyyy-MM-dd"
            />
          </CCol>
          <CCol md={2}>
            <label>To</label>
            <DatePicker
              selected={dateTo}
              onChange={(date) => setDateTo(date)}
              className="form-control"
              dateFormat="yyyy-MM-dd"
            />
          </CCol>
        </CRow>
      )}
      <CRow className="mt-2">
        <h4 className="mb-2">Total Booking : {totalData}</h4>
      </CRow>
      {totalData != 0 && (
        <>
          <CRow className="w-25">
            <CButton
              style={{ backgroundColor: "#4a90e2", color: "white" }}
              className="w-50 mb-2 me-3 align-items-center rounded-pill fw-bold"
              size="lg"
              onClick={handleExportDocument}
            >
              Download 
            </CButton>
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
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage + 1}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </CContainer>
  );
};

export default Report;
