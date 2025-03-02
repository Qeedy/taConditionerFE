import { cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import api from "../config/AxiosInstance";
import AuthService from "../services/AuthService";
import { SERVICE_TYPE_OPTIONS } from "../constants/ServiceTypeConstants";
import RegisterModal from "../components/RegisterModal";

const Users = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [editFormData, setEditFormData] = useState({
    uuid: "",
    fullName: "",
    address: "",
    email: "",
    phoneNumber: null,
    role: "",
    gender: "",
  });
  const navigate = useNavigate();
  const profileData = AuthService.getProfileData;

  const handleFetchData = async (page = 0, search = "") => {
    try {
      const response = await api.get(
        `/user/list?page=${page}&size=5&keyword=${searchTerm}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileData.token}`,
          },
        }
      );
      setUsers(response.data.content);
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

  const handleEditClick = (user) => {
    setEditingUserId(user.uuid);
    setEditFormData({
      uuid: user.uuid,
      fullName: user.fullName,
      address: user.address,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      gender: user.gender,
    });
  };

  // Membatalkan mode edit
  const handleCancelClick = () => {
    setEditingUserId(null);
  };

  const handleDeleteClick = async (userId) => {
    try {
      await api.delete(`/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${profileData.token}`,
        },
      });
      navigate(0);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSaveClick = async (userId) => {
    try {
      console.log(editFormData);
      const updatedUser = { ...editFormData };
      await api.put(`/user/${userId}`, updatedUser, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${profileData.token}`,
        },
      });
      users.map((user) =>
        user.uuid === userId ? { ...user, ...editFormData } : user
      );
      handleFetchData(currentPage, searchTerm);
      setEditingUserId(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handleAddClick = () => {
    setRegisterVisible(true);
  };
  return (
    <CContainer>
      <CRow>
        <h1>Users</h1>
      </CRow>
      <CRow className="mt-5">
        <CForm className="mb-4">
          <CInputGroup className="p-2 rounded-pill bg-light-subtle border-0 shadow-sm">
            <CIcon icon={cilSearch} className="text-secondary" size="lg" />
            <CFormInput
              placeholder="Search for users"
              className="border-0 bg-transparent text-muted"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </CInputGroup>
        </CForm>
      </CRow>
      <CRow className="mt-2 align-items-center">
        <h4 className="mb-2 me-3">All Users</h4>
      </CRow>
      {/* Tombol Add hanya tampil jika tidak dalam mode tambah */}
      {!registerVisible && (
        <CRow className="w-25">
          <CButton
            style={{ backgroundColor: "#4a90e2", color: "white" }}
            className="w-50 mb-2 me-3 align-items-center rounded-pill fw-bold"
            size="lg"
            onClick={handleAddClick}
          >
            Add User
          </CButton>
        </CRow>
      )}

      <CTable className="custom-table" hover responsive>
        <CTableHead>
          <CTableRow className="bg-light">
            <CTableHeaderCell>Full Name</CTableHeaderCell>
            <CTableHeaderCell>Address</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Phone Number</CTableHeaderCell>
            <CTableHeaderCell>Role</CTableHeaderCell>
            <CTableHeaderCell>Gender</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {users.map((user) => (
            <CTableRow key={user.uuid}>
              {editingUserId === user.uuid ? (
                <>
                  <CTableDataCell>
                    <CFormInput
                      type="text"
                      value={editFormData.fullName}
                      onChange={(e) =>
                        handleEditFormChange("fullName", e.target.value)
                      }
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="text"
                      value={editFormData.address}
                      onChange={(e) =>
                        handleEditFormChange("address", e.target.value)
                      }
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="text"
                      value={editFormData.email}
                      onChange={(e) =>
                        handleEditFormChange("email", e.target.value)
                      }
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="number"
                      value={editFormData.phoneNumber}
                      onChange={(e) =>
                        handleEditFormChange("phoneNumber", e.target.value)
                      }
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormSelect
                      name="role"
                      aria-label="Role"
                      value={(editFormData.role).toUpperCase()}
                      onChange={(e) =>
                        handleEditFormChange("role", e.target.value)
                      }
                      required
                      className="mb-3"
                      options={[
                        { label: "Select Role" },
                        { label: "User", value: "USER" },
                        { label: "Technician", value: "TECHNICIAN" },
                      ]}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormSelect
                      name="gender"
                      aria-label="Gender"
                      value={editFormData.gender}
                      onChange={(e) =>
                        handleEditFormChange("gender", e.target.value)
                      }
                      required
                      className="mb-3"
                      options={[
                        { label: "Select Gender" },
                        { label: "Male", value: "MALE" },
                        { label: "Female", value: "FEMALE" },
                      ]}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      style={{
                        backgroundColor: "#4a90e2",
                        color: "white",
                        marginRight: "0.5rem",
                      }}
                      className="rounded-pill fw-bold"
                      size="sm"
                      onClick={() => handleSaveClick(user.uuid)}
                    >
                      Save
                    </CButton>
                    <CButton
                      variant="outline"
                      className="rounded-pill fw-bold"
                      size="sm"
                      onClick={handleCancelClick}
                    >
                      Cancel
                    </CButton>
                  </CTableDataCell>
                </>
              ) : (
                <>
                  <CTableDataCell className="fw-semibold">
                    {user.fullName}
                  </CTableDataCell>
                  <CTableDataCell>{user.address}</CTableDataCell>
                  <CTableDataCell>{user.email}</CTableDataCell>
                  <CTableDataCell>{user.phoneNumber}</CTableDataCell>
                  <CTableDataCell>{user.role}</CTableDataCell>
                  <CTableDataCell>{user.gender}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      style={{
                        backgroundColor: "#4a90e2",
                        color: "white",
                        marginRight: "0.5rem",
                      }}
                      className="rounded-pill fw-bold"
                      size="sm"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </CButton>
                    <CButton
                      variant="outline"
                      className="rounded-pill fw-bold"
                      size="sm"
                      onClick={() => handleDeleteClick(user.uuid)}
                    >
                      Delete
                    </CButton>
                  </CTableDataCell>
                </>
              )}
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage + 1}
        onPageChange={handlePageChange}
      />
      <RegisterModal
        visible={registerVisible}
        setVisible={setRegisterVisible}
        toggleToLogin={() => {}}
        isAdminAdd={true}
      />
    </CContainer>
  );
};

export default Users;
