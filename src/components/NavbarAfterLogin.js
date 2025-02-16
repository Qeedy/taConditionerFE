import {
  CButton,
  CCollapse,
  CContainer,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavbarToggler,
  CNavItem,
  CNavLink,
} from "@coreui/react";
import React, { useState } from "react";
import logo from "../images/logo.png";
import {
  NAVBAR_CONTENT_TECHNICIAN,
  NAVBAR_CONTENT_USER,
  NAVBAR_CONTENT_ADMIN,
} from "../constants/NavbarContentAfterLogin";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";
import AuthService from "../services/AuthService";
import ProfileNavDropDown from "./ProfileNavDropDown";

const NavbarAfterLogin = ({ onLoginClick, onRegisterClick }) => {
  const [visible, setVisible] = useState(true);
  const userRole = AuthService.getUserRole();
  const getNavbarContent = (userRole) => {
    switch (userRole) {
      case "TECHNICIAN":
        return NAVBAR_CONTENT_TECHNICIAN;
      case "ADMIN":
        return NAVBAR_CONTENT_ADMIN;
      default:
        return NAVBAR_CONTENT_USER;
    }
  };
  const navbarContent = getNavbarContent(userRole);

  return (
    <CNavbar
      expand="lg"
      className="bg-body-tertiary navbar-custom px-5 py-3 sticky-top"
    >
      <CContainer fluid>
        <CNavbarBrand>
          <img src={logo} width="30" height="" alt="logo" /> Top Air Conditioner
        </CNavbarBrand>
        <CNavbarToggler onClick={() => setVisible(!visible)} />
        <CCollapse className="navbar-collapse" visible={visible}>
          <CNavbarNav className="ms-auto">
            {navbarContent.map((item, index) => (
              <CNavItem className="mx-3 my-3">
                <CNavLink href={item.redirect}>{item.name}</CNavLink>
              </CNavItem>
            ))}
            <CNavItem>
              <ProfileNavDropDown />
            </CNavItem>
          </CNavbarNav>
        </CCollapse>
      </CContainer>
    </CNavbar>
  );
};

export default NavbarAfterLogin;
