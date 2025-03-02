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
import EditProfileModel from "../model/UserProfileModel";
import UserProfileModel from "../model/UserProfileModel";
import api from "../config/AxiosInstance";

const EditProfileModal = ({ visible, setVisible }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState(new UserProfileModel(
    userData.uuid,
    userData.fullName,
    userData.address,
    userData.email,
    userData.phoneNumber,
    userData.role,
    userData.gender,
    userData.token
  ));
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = new UserProfileModel(
      formData.uuid,
      formData.fullName,
      formData.address,
      formData.email,
      formData.phoneNumber,
      formData.role,
      formData.gender,
      formData.token
    );
    updatedFormData.updateField(name, value);
    setFormData(updatedFormData);
  };

  const handleSaveClick = async (e) => {
    try {
      const updatedUser = { ...formData };
      await api.put(`/user/${updatedUser.uuid}`, updatedUser, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }finally {
      localStorage.setItem("user", JSON.stringify(formData));
      setVisible(false);
    }
  };

  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={() => setVisible(false)}
    >
      <CModalHeader>Edit Profile</CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSaveClick}>
          {errorMessage && (
            <div className="text-danger mb-3">{errorMessage}</div>
          )}
          <p>Full Name</p>
          <CFormInput
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="mb-3"
          />
          <p>Address</p>
          <CFormInput
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mb-3"
          />
          <p>Email</p>
          <CFormInput
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mb-3"
          />
          <p>Phone Number</p>
          <CFormInput
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="mb-3"
          />
          <p>Gender</p>
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
            Save
          </CButton>
        </CForm>
      </CModalBody>
      <CModalFooter>
        {/* {!isAdminAdd && (
          <div className="w-100 text-center">
            <p className="mb-2">Already have an account?</p>
            <CButton color="link" onClick={toggleToLogin}>
              Login here
            </CButton>
          </div>
        )} */}
      </CModalFooter>
    </CModal>
  );
};

export default EditProfileModal;
