import React, { useState } from "react";
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAvatar,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilHome, cilLockLocked, cilPhone } from "@coreui/icons";
import profilePic from "../images/profile.png";
import RegisterUserModel from "../model/RegisterUserModel";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "./EditProfileModal";

const ProfileNavDropDown = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user")) || null;
  const profileData = userData
    ? new RegisterUserModel(
        userData.fullName,
        userData.address,
        userData.email,
        userData.phoneNumber,
        null,
        userData.role,
        userData.gender
      )
    : null;
  const handleSignOut = () => {
    navigate("/");
    window.location.reload();
    localStorage.removeItem("user");
  };
  return (
    <>
      {profileData ? (
        <>
          <CDropdown className="profile-dropdown">
            <CDropdownToggle
              caret={false}
              className="d-flex align-items-center"
            >
              <CAvatar src={profilePic} size="lg" />
            </CDropdownToggle>
            <CDropdownMenu
              className="p-4"
              placement="bottom-end"
              style={{ minWidth: "300px" }}
            >
              <div className="text-center mb-4">
                <CAvatar src={profilePic} size="xl" className="mb-2" />
                <h5 className="mb-0">{profileData.fullName}</h5>
                <small className="text-muted">{profileData.fullName}</small>
              </div>
              <CDropdownItem className="d-flex align-items-center mb-3">
                <CIcon icon={cilHome} className="me-3" size="xl" />
                <div>
                  <strong>Address</strong>
                  <div>{profileData.address}</div>
                </div>
              </CDropdownItem>
              <CDropdownItem className="d-flex align-items-center mb-3">
                <CIcon icon={cilPhone} className="me-3" size="xl" />
                <div>
                  <strong>Phone Number</strong>
                  <div>{profileData.phoneNumber}</div>
                </div>
              </CDropdownItem>
              <CDropdownItem
                className="d-flex align-items-center mb-3"
                href="#"
              >
                <CIcon icon={cilPencil} className="me-3" size="xl" />
                <CButton
                  color="link"
                  className="text-primary fw-bold"
                  onClick={() => setVisible(!visible)}
                >
                  Edit Profile
                </CButton>
              </CDropdownItem>
              <div className="text-center">
                <CButton
                  color="link"
                  className="text-danger fw-bold"
                  onClick={handleSignOut}
                >
                  <CIcon icon={cilLockLocked} className="me-2" />
                  Sign Out
                </CButton>
              </div>
            </CDropdownMenu>
          </CDropdown>
          <EditProfileModal visible={visible} setVisible={setVisible} />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProfileNavDropDown;
