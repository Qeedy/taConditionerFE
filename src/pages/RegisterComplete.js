import React, { useEffect, useState } from "react";
import { CButton, CCol, CContainer, CRow } from "@coreui/react";
import { Banner } from "../components/Banner";
import congratulationImage from "../images/congratulation.jpg"
import { useNavigate } from "react-router-dom";
const RegisterComplete = ({onLoginClick}) => {
  const navigate = useNavigate();
  const image = (() => {
    return congratulationImage;
  })();
  const handleClickContact = () => {
    navigate(`/contact`);
  };

  return (
    <CContainer className="px-3 py-3">
      <CRow>
        <CCol>
          <CRow className="mt-4">
            <CCol>
              <Banner image={image} isWithButton={false} />
            </CCol>
            <CCol className="d-flex flex-column justify-content-center">
              <CContainer className="py-4">
                <CRow>
                  <CCol className="mx-auto">
                    <h1>Congratulation !!</h1>
                    <h5>
                      Welcome aboard! You have successfully registered at Top
                      Air Conditioner.
                      <br />
                      Go ahead and log in to get started!
                    </h5>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs="auto">
                    <CButton
                      color="info"
                      textBgColor="light"
                      className="text-white fw-bold"
                      onClick={()=> onLoginClick(true)}
                    >
                      Login
                    </CButton>
                  </CCol>
                  <CCol xs="auto">
                    <CButton
                      color="secondary"
                      textBgColor="light"
                      className="text-white fw-bold"
                      onClick={handleClickContact}
                    >
                      Contact Support
                    </CButton>
                  </CCol>
                </CRow>
              </CContainer>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default RegisterComplete;
