import React, { useState } from "react";
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CButton,
  CFormSelect,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import RegisterUserModel from "../model/RegisterUserModel";

const RegisterModal = ({ visible, setVisible, toggleToLogin }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState(new RegisterUserModel());
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = new RegisterUserModel(
      formData.fullName,
      formData.address,
      formData.email,
      formData.phoneNumber,
      formData.password,
      formData.role,
      formData.gender
    );
    updatedFormData.updateField(name, value);
    setFormData(updatedFormData);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    AuthService.handleRegister(
      formData,
      () => {
        setVisible(false); 
        navigate("/registerCompleted"); 
      },
      (error) => setErrorMessage(error) 
    );
  };

  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={() => setVisible(false)}
    >
      <CModalHeader>Register</CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleRegister}>
          {errorMessage && (
            <div className="text-danger mb-3">{errorMessage}</div>
          )}

          {/* Form Input Fields */}
          <CFormInput
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="mb-3"
          />
          <CFormInput
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mb-3"
          />
          <CFormInput
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mb-3"
          />
          <CFormInput
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="mb-3"
          />
          <CFormInput
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mb-3"
          />
          <CFormSelect
            name="role"
            aria-label="Role"
            value={formData.role}
            onChange={handleChange}
            required
            className="mb-3"
            options={[
              { label: "Select Role" },
              { label: "User", value: "USER" },
              { label: "Technician", value: "TECHNICIAN" },
            ]}
          />
          <CFormSelect
            name="gender"
            aria-label="Gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="mb-3"
            options={[
              { label: "Select Gender" },
              { label: "Male", value: "MALE" },
              { label: "Female", value: "FEMALE" },
            ]}
          />
          <CButton
            type="submit"
            color="info"
            textBgColor="light"
            className="text-white fw-bold w-100"
          >
            Register
          </CButton>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <div className="w-100 text-center">
          <p className="mb-2">Already have an account?</p>
          <CButton color="link" onClick={toggleToLogin}>
            Login here
          </CButton>
        </div>
      </CModalFooter>
    </CModal>
  );
};

export default RegisterModal;
