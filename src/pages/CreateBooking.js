import {
  CButton,
  CCol,
  CContainer,
  CFormSelect,
  CFormTextarea,
  CRow
} from "@coreui/react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns/AdapterDateFns";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/AxiosInstance";
import { SERVICE_TIME_OPTIONS } from "../constants/ServiceTimeConstants";
import { SERVICE_TYPE_OPTIONS } from "../constants/ServiceTypeConstants";


const CreateBooking = () => {
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [serviceList, setServiceList] = useState([]);
  const [selectedService, setSelectedService] = useState({serviceName: "", serviceType:"", cost:0});
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const profileData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleAddressSelection = (option) => {
    setSelectedAddress(option);
    if (option === "Same as my address") {
      setAddress(profileData.address);
    } else {
      setAddress(""); 
    }
  };

  const handleSelectedService = (uuid) => {
    setSelectedService(serviceList.find(item => item.uuid === uuid))
  };

  const handleCreateBooking = async () => {
    if (!selectedService || !selectedAddress || !selectedTime || !bookingDate) {
      alert("Please fill in all required fields.");
      return;
    }
    console.log(selectedService);
    const bookingData = {
      customerId: profileData.uuid,
      serviceType: selectedService.serviceType,
      serviceName: selectedService.serviceName,
      cost: selectedService.cost,
      address: address,
      bookingDate: format(bookingDate, "dd-MM-yyyy"),
      serviceTime: selectedTime,
      instruction: instructions,
    };

    console.log(bookingData);

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
      navigate(`/tasks/${response.data}?taskId=customer-booking-task&taskName=Customer%20Booking%20Task`);
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

  useEffect(() => {
    if (selectedServiceType) {
      fetchServiceList(selectedServiceType);
    }
  }, [selectedServiceType]);

  const fetchServiceList = async (serviceType) => {
    try {
      console.log(serviceType);
      const response = await api.get(
        `/service/get-by-type?serviceType=${serviceType}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileData.token}`,
          },
        }
      );
      setServiceList(response.data);
    } catch (error) {
      console.error("Error fetching service list:", error);
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
                selectedServiceType === service.value
                  ? "bg-secondary text-white shadow"
                  : "bg-light"
              }`}
              onClick={() => setSelectedServiceType(service.value)}
            >
              {service.text}
            </CButton>
          </CCol>
        ))}
      </CRow>

      {serviceList.length > 0 && (
        <CRow className="mb-4">
          <h5 className="fw-bold">Select a Service</h5>
          <CFormSelect
            className="mb-3"
            value={selectedService.uuid}
            onChange={(e) => handleSelectedService(e.target.value)}
          >
            <option value="">Select a service</option>
            {serviceList.map((service) => (
              <option key={service.uuid} value={service.uuid}>
                {service.serviceName}
              </option>
            ))}
          </CFormSelect>
        </CRow>
      )}

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