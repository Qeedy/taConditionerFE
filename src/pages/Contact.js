import * as icon from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CCard, CCardBody, CCardText, CCardTitle, CCol, CContainer, CForm, CFormInput, CFormLabel, CFormTextarea, CRow } from '@coreui/react';
import React from 'react';
import { Banner } from '../components/Banner';
import sampleImage from '../images/contactUs.png';
const Contact = () => {
    return (
      <CContainer className="px-3 py-5">
          <CRow>
            <CCol>
              <h2>Contact Us</h2>
              <br/>
              <CRow>
                <CCol md={3}>
                <CCard className="mb-3 overflow-auto" style={{ height: '220px' }}>
                  <CCardBody className="d-flex flex-column justify-content-center">
                      <CCardTitle><CIcon icon={icon.cilLocationPin} className="fw-bold" size="xl" /></CCardTitle>
                      <CCardText>
                        <h4>Jl. Duren I, Pedurenan, Kec. Karang Tengah, Kota Tangerang, Banten 15159</h4>
                        <small>Main Office</small>
                      </CCardText>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol md={3}>
                <CCard className="mb-3 overflow-auto" style={{ height: '220px' }}>
                  <CCardBody className="d-flex flex-column justify-content-center">
                      <CCardTitle><CIcon icon={icon.cilPhone} className="fw-bold" size="xl" /></CCardTitle>
                      <CCardText>
                        <h4>+62 812-1967-0199</h4>
                        <small>Phone</small>
                      </CCardText>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol md={3}>
                <CCard className="mb-3 overflow-auto" style={{ height: '220px' }}>
                    <CCardBody className="d-flex flex-column justify-content-center">
                      <CCardTitle><CIcon icon={icon.cibGmail} className="fw-bold" size="xl" /></CCardTitle>
                      <CCardText>
                        <h4>info@topAir.com</h4>
                        <small>Email</small>
                      </CCardText>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol md={3}>
                  <CCard className="mb-3 overflow-auto" style={{ height: '220px' }}>
                    <CCardBody className="d-flex flex-column justify-content-center">
                      <CCardTitle><CIcon icon={icon.cilAvTimer} className="fw-bold" size="xl" /></CCardTitle>
                      <CCardText>
                        <h4>Monday - Friday, 8:00 AM - 5:00 PM</h4>
                        <small>Hours</small>
                      </CCardText>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <CCol>
                  <CContainer className="py-4">
                    <CRow>
                      <CCol className="mx-auto">
                        <CForm>
                          <div className="mb-4">
                            <CFormLabel htmlFor="name">Name</CFormLabel>
                            <CFormInput type="text" id="name" placeholder="Your name" className="bg-light" />
                          </div>
                          <div className="mb-4">
                            <CFormLabel htmlFor="email">Email</CFormLabel>
                            <CFormInput type="email" id="email" placeholder="Your email" className="bg-light"/>
                          </div>
                          <div className="mb-4">
                            <CFormLabel htmlFor="message">Message</CFormLabel>
                            <CFormTextarea
                              id="message"
                              rows="4"
                              className="bg-light"
                            />
                          </div>
                          <div>
                            <CButton type="submit" color="info" className="w-100 text-white">
                              Submit
                            </CButton>
                          </div>
                        </CForm>
                      </CCol>
                    </CRow>
                  </CContainer>
                </CCol>
                <CCol>
                    <Banner 
                      image={sampleImage}
                      isWithButton={false}/>
                </CCol>
              </CRow>
            </CCol>
          </CRow>
      </CContainer>
    );
};

export default Contact;