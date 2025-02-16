import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CFormInput,
  CFormTextarea,
} from "@coreui/react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns/AdapterDateFns";
import { format } from "date-fns";
import axios from "axios";
import { SERVICE_TIME_OPTIONS } from "../constants/ServiceTimeConstants";
import { SERVICE_TYPE_OPTIONS } from "../constants/ServiceTypeConstants";
import AuthService from "../services/AuthService";
import api from "../config/AxiosInstance";


const CreateBooking = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const profileData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {

  }, [])
  const handleAddressSelection = (option) => {
    setSelectedAddress(option);
    if (option === "Same as my address") {
      setAddress(profileData.address);
    } else {
      setAddress(""); 
    }
  };

  const handleCreateBooking = async () => {
    if (!selectedService || !selectedAddress || !selectedTime || !bookingDate) {
      alert("Please fill in all required fields.");
      return;
    }
    console.log(profileData)

    const bookingData = {
      customerId: profileData.uuid,
      serviceType: selectedService,
      address: address,
      bookingDate: format(bookingDate, "dd-MM-yyyy"),
      serviceTime: selectedTime,
      instruction: instructions,
    };

    try {
      const response = await api.post(
        "/task/create",
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileData.token}`,
          },
        }
      );

      console.log("Booking created:", response.data);
      navigate(`/tasks/${response.data}`);
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
        alert(
          `Failed: ${error.response.data.message || "Something went wrong!"}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response from server. Please try again.");
      } else {
        console.error("Error setting up request:", error.message);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <CContainer className="py-5" style={{ maxWidth: "600px" }}>
      {/* Header */}
      <h2 className="fw-bold">Book a service</h2>

      {/* Service Type */}
      <h5 className="fw-bold mt-4">What type of service you want?</h5>
      <CRow className="mb-4">
        {SERVICE_TYPE_OPTIONS.map((service) => (
          <CCol key={service.value} md="auto">
            <CButton
              className={`px-3 py-2 rounded-pill border shadow-sm ${
                selectedService === service.value
                  ? "bg-secondary text-white shadow"
                  : "bg-light"
              }`}
              onClick={() => setSelectedService(service.value)}
            >
              {service.text}
            </CButton>
          </CCol>
        ))}
      </CRow>

      {/* Address */}
      <h5 className="fw-bold">Where should we work?</h5>
      <CRow className="mb-3">
        {["Same as my address", "Another address"].map((option) => (
          <CCol key={option} md="auto">
            <CButton
              className={`px-3 py-2 rounded-pill border shadow-sm ${
                selectedAddress === option
                  ? "bg-secondary text-white shadow"
                  : "bg-light"
              }`}
              onClick={() => handleAddressSelection(option)}
            >
              {option}
            </CButton>
          </CCol>
        ))}
      </CRow>
      <CFormTextarea
        placeholder="Enter your address"
        rows={3}
        className="bg-light border-0 p-3 rounded shadow-sm"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        disabled={selectedAddress === "Same as my address"}
      />

      {/* Date Selection */}
      <h5 className="fw-bold mt-4">When do you need us?</h5>
      <CRow className="mb-4">
        <CCol>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              selected={bookingDate}
              onChange={(date) => setBookingDate(date)}
              format="dd-MM-yyyy"
              className="form-control bg-light border-0 text-center rounded shadow-sm"
              placeholderText="Select a date"
              showPopperArrow={false}
            />
          </LocalizationProvider>
        </CCol>
      </CRow>

      {/* Time Selection */}
      <h5 className="fw-bold">What time of day works best for you?</h5>
      <CRow className="mb-4">
        {SERVICE_TIME_OPTIONS.map((time) => (
          <CCol key={time.value} md="auto">
            <CButton
              className={`px-3 py-2 rounded-pill border shadow-sm ${
                selectedTime === time.value
                  ? "bg-secondary text-white shadow"
                  : "bg-light"
              }`}
              onClick={() => setSelectedTime(time.value)}
            >
              {time.text}
            </CButton>
          </CCol>
        ))}
      </CRow>

      {/* Additional Instructions */}
      <h5 className="fw-bold">Any specific instruction or problems?</h5>
      <CFormTextarea
        placeholder="Describe your instruction or problems"
        rows={3}
        className="bg-light border-0 p-3 rounded shadow-sm"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
      />

      {/* Submit Button */}
      <CButton
        color="primary"
        size="lg"
        style={{ backgroundColor: "#4a90e2", color: "white" }}
        className="mt-4 px-4 shadow-lg rounded-pill fw-bold"
        onClick={handleCreateBooking}
      >
        Submit
      </CButton>
    </CContainer>
  );
};

export default CreateBooking;
