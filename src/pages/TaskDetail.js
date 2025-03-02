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
  CFormSelect,
  CFormInput,
} from "@coreui/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AuthService from "../services/AuthService";
import { SERVICE_TYPE_OPTIONS } from "../constants/ServiceTypeConstants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import api from "../config/AxiosInstance";

const TaskDetail = () => {
  const { bookingId } = useParams();
  const profileData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("taskId");
  const taskName = searchParams.get("taskName");
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [errors, setErrors] = useState({});
  const handleFetchData = async (bookingId) => {
    try {
      setLoading(true);
      const response = await api.get(`/booking/detail/${bookingId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${profileData.token}`,
        },
      });
      setBookingData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTechnician = async () => {
    try {
      const response = await api.get(`/user/list-technician`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${profileData.token}`,
        },
      });
      setTechnicians(response.data);
    } catch (error) {
      console.error("Failed to fetch technicians:", error);
    }
  };

  useEffect(() => {
    handleFetchData(bookingId);
  }, [bookingId]);

  useEffect(() => {
    handleFetchData(bookingId);
  }, []);

  useEffect(() => {
    if (taskId === "approval-booking-task") {
      handleFetchTechnician();
    }
  }, [taskId]);

  const handleStatusUpdate = async (status) => {
    let newErrors = {};
    if (taskId === "approval-booking-task" && !selectedTechnician) {
      newErrors.selectedTechnician = "Please select a technician.";
    }
    if (taskId === "customer-booking-task") {
      if (!paymentMethod) {
        newErrors.paymentMethod = "Please select a payment method.";
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      setProcessing(true);
      let body = { isApproved: status };

      if (taskId === "approval-booking-task") {
        body = { isApproved: status, technicianId: selectedTechnician };
      }
      if (taskId === "customer-booking-task") {
        body = {
          isApproved: status,
          paymentMethod: paymentMethod,
        };
      }
      await api.post(`/task/process-task/${bookingId}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${profileData.token}`,
        },
      });

      navigate("/tasks");
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <CCard className="text-center p-5">
        <CSpinner color="primary" size="lg" />
        <p className="mt-3">Loading Task details...</p>
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
            <a href="/dashboard" className="text-decoration-none text-primary">
              Dashboard
            </a>{" "}
            /
            <a href="/tasks" className="text-decoration-none text-primary">
              {" "}
              Tasks
            </a>{" "}
            /<strong> {bookingId}</strong>
          </h5>
        </CCol>
      </CRow>
      <CRow className="mb-3">
        <h1>Task #{bookingId}</h1>
        <h5 className="text-muted">Booked by: {bookingData.customerName}</h5>
        <h5 className="text-muted">Task Name: {taskName}</h5>
      </CRow>

      {/* Details Section */}
      <h5 className="fw-bold">Details</h5>
      <hr />
      <CRow className="mb-3">
        <CCol md="6">
          <h5 className="fw-semibold text-muted mb-1">Service Type</h5>
          <h5>
            {SERVICE_TYPE_OPTIONS.find(
              (option) => option.value === bookingData.serviceType
            )?.text || "Unknown"}
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
          {taskId === "approval-booking-task" ? (
            <>
              <CFormSelect
                className="fw-semibold text-muted"
                value={selectedTechnician}
                onChange={(e) => setSelectedTechnician(e.target.value)}
              >
                <option value="">Select Technician</option>
                {technicians.map((tech) => (
                  <option key={tech.uuid} value={tech.uuid}>
                    {tech.fullName}
                  </option>
                ))}
              </CFormSelect>
              {errors.selectedTechnician && (
                <CAlert color="danger" className="mt-2">
                  {errors.selectedTechnician}
                </CAlert>
              )}
            </>
          ) : (
            <h5>{bookingData.technitionName || "-"}</h5>
          )}
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
          <h5>{bookingData.instructions || "-"}</h5>
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
          <h5 className="fw-semibold text-muted mb-1">Payment Method</h5>
          {taskId === "customer-booking-task" ? (
            <>
              <CFormSelect
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </CFormSelect>
              {errors.paymentMethod && (
                <CAlert color="danger" className="mt-2">
                  {errors.paymentMethod}
                </CAlert>
              )}
            </>
          ) : (
            <h5>{bookingData.paymentMethod}</h5>
          )}
        </CCol>
        <CCol md="6">
          <h5 className="fw-semibold text-muted mb-1">Total</h5>
          <h5>Rp. {bookingData.totalCost}</h5>
        </CCol>
      </CRow>
      <CRow className="mt-4">
        <CCol className="text-end">
          <CButton
            color="success"
            className="me-4 px-4 text-white fw-bold"
            disabled={processing}
            onClick={() => handleStatusUpdate(true)}
          >
            {processing ? <CSpinner size="sm" className="me-2" /> : null}
            {taskId !== "booking-process-task" && taskId !== "completion-task"
              ? "Accept"
              : "Done"}
          </CButton>
          {taskId !== "booking-process-task" &&
            taskId !== "completion-task" && (
              <CButton
                color="danger"
                className="px-4 text-white fw-bold"
                disabled={processing}
                onClick={() => handleStatusUpdate(false)}
              >
                {processing ? <CSpinner size="sm" className="me-2" /> : null}
                Reject
              </CButton>
            )}
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default TaskDetail;
