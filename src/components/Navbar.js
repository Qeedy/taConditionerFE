import {
  CButton,
  CCollapse,
  CContainer,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavbarToggler,
  CNavItem,
  CNavLink
} from "@coreui/react";
import React, { useState } from "react";
import logo from "../images/logo.png";

const Navbar = ({ onLoginClick, onRegisterClick }) => {
  const [visible, setVisible] = useState(true);
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
          {/* Tambahkan kelas ms-auto untuk memindahkan menu ke kanan */}
          <CNavbarNav className="ms-auto">
            <CNavItem className="mx-3 my-2">
              <CNavLink href="/" active>
                Services
              </CNavLink>
            </CNavItem>
            <CNavItem className="mx-3 my-2">
              <CNavLink href="/about">About us</CNavLink>
            </CNavItem>
            <CNavItem className="mx-3 my-2">
              <CButton
                color="info"
                textBgColor="light"
                className="text-white fw-bold"
                onClick={() => onLoginClick(true)}
              >
                Login
              </CButton>
            </CNavItem>
            <CNavItem className="mx-3 my-2">
              <CButton
                color="info"
                textBgColor="light"
                className="text-white fw-bold"
                onClick={() => onRegisterClick(true)}
              >
                Register
              </CButton>
            </CNavItem>
          </CNavbarNav>
        </CCollapse>
      </CContainer>
    </CNavbar>
  );
};

export default Navbar;
