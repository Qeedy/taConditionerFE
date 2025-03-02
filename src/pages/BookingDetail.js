import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CButton,
  CContainer,
  CBadge,
  CAlert,
  CSpinner,
} from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../services/AuthService";
import axios from "axios";
import { SERVICE_TYPE_OPTIONS } from "../constants/ServiceTypeConstants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faRedo, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import api from "../config/AxiosInstance";

const BookingDetail = () => {
  const { bookingId } = useParams();
  const profileData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleExportDocument = async () => {
    try {
      const response = await api.get(`/booking/report/${bookingId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${profileData.token}`,
        },
        responseType: "blob", // Penting untuk menangani file PDF
      });
  
      // Buat link untuk mendownload file PDF
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
    } catch (error) {
      console.error("Failed to export document:", error);
      alert("Error generating PDF");
    }
  };

  const handleFetchData = async (bookingId) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/booking/detail/${bookingId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileData.token}`,
          },
        }
      );
      setBookingData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchData(bookingId);
  }, [bookingId]);

  useEffect(() => {
    handleFetchData(bookingId);
  }, []);

  if (loading) {
    return (
      <CCard className="text-center p-5">
        <CSpinner color="primary" size="lg" />
        <p className="mt-3">Loading booking details...</p>
      </CCard>
    );
  }

  if (error || !bookingData) {
    return (
      <CCard className="text-center shadow-lg border-danger">
        <CCardHeader className="bg-danger text-white">
          <FontAwesomeIcon icon={faTriangleExclamation} className="me-2" />
          Error Fetching Data
        </CCardHeader>
        <CCardBody>
          <CAlert color="danger" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faTriangleExclamation} className="me-2" />
            {bookingId} not found
          </CAlert>
          <CButton color="dark" onClick={() => navigate(-1)} className="mt-2">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Back to Previous Page
          </CButton>
        </CCardBody>
      </CCard>
    );
  }

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <h5 className="text-muted">
            <a href="/dashboard" className="text-decoration-none text-primary">Dashboard</a> /
            <a href="/bookings" className="text-decoration-none text-primary"> Bookings</a> /
            <strong> {bookingId}</strong>
          </h5>
        </CCol>
      </CRow>
      <CRow className="mb-3">
        <h1>Booking #{bookingId}</h1>
        <h5 className="text-muted">Booked by: {bookingData.customerName}</h5>
      </CRow>

      {/* Details Section */}
      <h5 className="fw-bold">Details</h5>
      <hr />
      <CRow className="mb-3">
        <CCol md="6">
          <h5 className="fw-semibold text-muted mb-1">Service Type</h5>
          <h5>
            {
              SERVICE_TYPE_OPTIONS.find(
                (option) => option.value === bookingData.serviceType
              )?.text || "Unknown"
            }
          </h5>
        </CCol>
        <CCol md="6">
          <h5 className="fw-semibold text-muted mb-1">Date & Time</h5>
          <h5>{bookingData.bookingDateTime}</h5>
        </CCol>
      </CRow>
      <hr />
      <CRow className="mb-3">
        <CCol md="6">
          <h5 className="fw-semibold text-muted mb-1">Status</h5>
          <CBadge
            color={
              bookingData.bookingStatus === "COMPLETED"
                ? "success"
                : bookingData.bookingStatus === "Cancelled"
                ? "danger"
                : bookingData.bookingStatus === "CONFIRMED"
                ? "info"
                : "warning"
            }
          >
            {bookingData.bookingStatus}
          </CBadge>
        </CCol>
        <CCol md="6">
          <h5 className="fw-semibold text-muted mb-1">Technician</h5>
          <h5>{bookingData.technitionName || '-'}</h5>
        </CCol>
      </CRow>
      <hr />
      <CRow className="mb-3">
        <CCol md="6">
          <h5 className="fw-semibold text-muted mb-1">Location</h5>
          <h5>{bookingData.customerAddress}</h5>
        </CCol>
        <CCol md="6">
          <h5 className="fw-semibold text-muted mb-1">Instructions</h5>
          <h5>{bookingData.instructions || '-'}</h5>
        </CCol>
      </CRow>

      {/* Customer Details */}
      <h5 className="fw-bold mt-4">Customer Details</h5>
      <hr />
      <CRow className="mb-3">
        <CCol md="6">
          <h5 className="fw-semibold text-muted mb-1">Name</h5>
          <h5>{bookingData.customerName}</h5>
        </CCol>
        <CCol md="6">
          <h5 className="fw-semibold text-muted mb-1">Phone</h5>
          <h5>{bookingData.customerPhoneNumber}</h5>
        </CCol>
      </CRow>
      <hr />
      <CRow className="mb-3">
        <CCol md="6">
          <h5 className="fw-semibold text-muted mb-1">Email</h5>
          <h5>{bookingData.customerEmail}</h5>
        </CCol>
        <CCol md="6">
          <h5 className="fw-semibold text-muted mb-1">Address</h5>
          <h5>{bookingData.customerAddress}</h5>
        </CCol>
      </CRow>

      {/* Payment Details */}
      <h5 className="fw-bold mt-4">Payment</h5>
      <hr />
      <CRow>
        <CCol md="6">
          <h5 className="fw-semibold text-muted mb-1">Method</h5>
          <h5>{bookingData.paymentMethod}</h5>
        </CCol>
        <CCol md="6">
          <h5 className="fw-semibold text-muted mb-1">Total</h5>
          <h5>Rp. {bookingData.totalCost}</h5>
        </CCol>
      </CRow>

      {/* Export Button */}
      <CRow className="mt-4">
        <CCol md="auto">
          <CButton color="primary" size="lg" onClick={handleExportDocument}>Export Document</CButton>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default BookingDetail;
