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

const Services = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    uuid: "",
    serviceName: "",
    serviceType: "",
    cost: "",
  });
  const [addingService, setAddingService] = useState(false);
  const [newServiceData, setNewServiceData] = useState({
    uuid: null,
    serviceName: "",
    serviceType: "",
    cost: "",
  });
  const navigate = useNavigate();
  const profileData = AuthService.getProfileData;

  const handleFetchData = async (page = 0, search = "") => {
    try {
      const response = await api.get(
        `/service/list?page=${page}&size=5&keyword=${searchTerm}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileData.token}`,
          },
        }
      );
      setServices(response.data.content);
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

  // Fungsi untuk mengaktifkan mode edit pada suatu service
  const handleEditClick = (service) => {
    setEditingServiceId(service.uuid);
    setEditFormData({
      uuid: service.uuid,
      serviceName: service.serviceName,
      serviceType: service.serviceType,
      cost: service.cost,
    });
  };

  // Membatalkan mode edit
  const handleCancelClick = () => {
    setEditingServiceId(null);
  };

  const handleDeleteClick = async (serviceId) => {
    try {
      await api.delete(`/service/${serviceId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${profileData.token}`,
        },
      });
      navigate(0);
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  // Menyimpan perubahan hasil edit
  const handleSaveClick = async (serviceId) => {
    try {
      const updatedService = { ...editFormData };
      // Contoh panggilan API untuk update data service
      await api.post(`/service`, updatedService, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${profileData.token}`,
        },
      });
      // Perbarui state lokal setelah sukses
      const updatedServices = services.map((service) =>
        service.id === serviceId ? { ...service, ...editFormData } : service
      );
      handleFetchData(currentPage, searchTerm);
      setEditingServiceId(null);
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  // Menangani perubahan input pada mode edit
  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Menangani perubahan input pada mode tambah service baru
  const handleNewFormChange = (field, value) => {
    setNewServiceData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  // Mengaktifkan mode tambah service baru
  const handleAddClick = () => {
    setAddingService(true);
    setNewServiceData({
      uuid: null,
      serviceName: "",
      serviceType: "",
      cost: "",
    });
  };

  // Membatalkan mode tambah service baru
  const handleCancelNew = () => {
    setAddingService(false);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Menyimpan data service baru ke API dan memperbarui state lokal
  const handleSaveNew = async () => {
    console.log({ ...newServiceData, uuid: null });
    try {
      const response = await api.post(
        "/service",
        { ...newServiceData, uuid: null },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileData.token}`,
          },
        }
      );
      // Menambahkan service baru ke daftar, misalnya menambahkannya di awal daftar
      setServices([response.data, ...services]);
      setAddingService(false);
    } catch (error) {
      console.error("Error adding new service:", error);
    }
  };

  return (
    <CContainer>
      <CRow>
        <h1>Services</h1>
      </CRow>
      <CRow className="mt-5">
        <CForm className="mb-4">
          <CInputGroup className="p-2 rounded-pill bg-light-subtle border-0 shadow-sm">
            <CIcon icon={cilSearch} className="text-secondary" size="lg" />
            <CFormInput
              placeholder="Search for services"
              className="border-0 bg-transparent text-muted"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </CInputGroup>
        </CForm>
      </CRow>
      <CRow className="mt-2 align-items-center">
        <h4 className="mb-2 me-3">All Services</h4>
      </CRow>
      {/* Tombol Add hanya tampil jika tidak dalam mode tambah */}
      {!addingService && (
        <CRow className="w-25">
          <CButton
            style={{ backgroundColor: "#4a90e2", color: "white" }}
            className="w-50 mb-2 me-3 align-items-center rounded-pill fw-bold"
            size="lg"
            onClick={handleAddClick}
          >
            Add Service
          </CButton>
        </CRow>
      )}

      <CTable className="custom-table" hover responsive>
        <CTableHead>
          <CTableRow className="bg-light">
            <CTableHeaderCell>Service Name</CTableHeaderCell>
            <CTableHeaderCell>Service Type</CTableHeaderCell>
            <CTableHeaderCell>Cost</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {/* Baris untuk menambah service baru */}
          {addingService && (
            <CTableRow key="new">
              <CTableDataCell>
                <CFormInput
                  type="text"
                  placeholder="Service Name"
                  value={newServiceData.serviceName}
                  onChange={(e) =>
                    handleNewFormChange("serviceName", e.target.value)
                  }
                />
              </CTableDataCell>
              <CTableDataCell>
                <CFormSelect
                  value={newServiceData.serviceType}
                  onChange={(e) =>
                    handleNewFormChange("serviceType", e.target.value)
                  }
                >
                  <option value="">Select Service Type</option>
                  {SERVICE_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </CFormSelect>
              </CTableDataCell>
              <CTableDataCell>
                <CFormInput
                  type="number"
                  placeholder="Cost"
                  value={newServiceData.cost}
                  onChange={(e) => handleNewFormChange("cost", e.target.value)}
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
                  onClick={handleSaveNew}
                >
                  Save
                </CButton>
                <CButton
                  variant="outline"
                  className="rounded-pill fw-bold"
                  size="sm"
                  onClick={handleCancelNew}
                >
                  Cancel
                </CButton>
              </CTableDataCell>
            </CTableRow>
          )}

          {services.map((service) => (
            <CTableRow key={service.uuid}>
              {editingServiceId === service.uuid ? (
                <>
                  <CTableDataCell>
                    <CFormInput
                      type="text"
                      value={editFormData.serviceName}
                      onChange={(e) =>
                        handleEditFormChange("serviceName", e.target.value)
                      }
                    />
                  </CTableDataCell>

                  <CTableDataCell>
                    <CFormSelect
                      value={editFormData.serviceType}
                      onChange={(e) =>
                        handleEditFormChange("serviceType", e.target.value)
                      }
                    >
                      <option value="">Select Service Type</option>
                      {SERVICE_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.text}
                        </option>
                      ))}
                    </CFormSelect>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="number"
                      value={editFormData.cost}
                      onChange={(e) =>
                        handleEditFormChange("cost", e.target.value)
                      }
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
                      onClick={() => handleSaveClick(service.uuid)}
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
                    {service.serviceName}
                  </CTableDataCell>
                  <CTableDataCell>{service.serviceType}</CTableDataCell>
                  <CTableDataCell>
                    Rp {formatCurrency(service.cost)}
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
                      onClick={() => handleEditClick(service)}
                    >
                      Edit
                    </CButton>
                    <CButton
                      variant="outline"
                      className="rounded-pill fw-bold"
                      size="sm"
                      onClick={()=> handleDeleteClick(service.uuid)}
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
    </CContainer>
  );
};

export default Services;
