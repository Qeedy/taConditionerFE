import React from "react";
import { FaTools } from "react-icons/fa";
import { SERVICE_TYPE_OPTIONS } from "../constants/ServiceTypeConstants";
import { CButton, CCard, CCardBody, CCol, CRow } from "@coreui/react";

const BookingCard = ({
  booking,
  formatRelativeTime,
  formatRemainingTime,
  handleViewClick
}) => {
  return (
    <CCard
    key={booking.bookingId}
    className="border-0 shadow-none w-100"
  >
    <CCardBody className="d-flex justify-content-between align-items-center">
      <CRow className="w-100 align-items-center">
        <CCol
          xs="1"
          className="d-flex align-items-center justify-content-center"
        >
          <div className="bg-light p-2 rounded-circle">
            <FaTools className="text-secondary fs-5" />
          </div>
        </CCol>
        <CCol xs="7">
          <h5 className="mb-1 fw-semibold">
            {booking.bookingId}, {booking.customerName}
          </h5>
          <p className="text-muted small">
            {formatRelativeTime(booking.createdDate)}, ,{" "}
            {
              SERVICE_TYPE_OPTIONS.find(
                (option) => option.value === booking.serviceType
              )?.text
            }
          </p>
        </CCol>
        <CCol xs="2" className="text-center">
          {formatRemainingTime(booking.bookingDate)}
        </CCol>
        <CCol xs="2" className="text-end">
          <CButton
            style={{ backgroundColor: "#4a90e2", color: "white" }}
            className="rounded-pill fw-bold"
            size="sm"
            onClick={() => handleViewClick(booking.bookingId)}
          >
            View
          </CButton>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
  );
};

export default BookingCard;
