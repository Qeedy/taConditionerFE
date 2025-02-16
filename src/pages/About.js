import React from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCardText, CCardTitle, CCol, CContainer, CRow } from '@coreui/react';
import { Banner } from '../components/Banner';
import sampleImage from '../images/aboutUs.png'
const About = () => {
  const title = "About Us";
  const text = "We are a local air conditioning company that provides services, maintenance, and installation of air conditioners in homes and businesses. Our goal is to provide exceptional service to our customers at a fair price. We are experts in our field and are committed to providing the highest level of customer service.";
     return (
    <CContainer className="px-3 py-5">
        <Banner 
                image={sampleImage}
                title={title}
                text={text}
                isWithButton={false}/>
        <CRow>
            <h2>Our Mission</h2>
            <p>
              Our mission is to provide the best air conditioning services and products to our customers. We are
              committed to providing high-quality, reliable, and energy-efficient solutions for your home or business.
              We are dedicated to providing excellent customer service and ensuring that you are completely satisfied
              with our work.
            </p>
        </CRow>
        <CRow className="mt-4">
          <CCol>
            <h2>Testimonials</h2>
            <CRow>
              <CCol md={4}>
                <CCard className="mb-3">
                  <CCardBody>
                    <CCardTitle>John Smith</CCardTitle>
                    <CCardText>
                      <small>July 2, 2022</small>
                      <br />
                      Great service! They arrived on time, fixed my air conditioner, and cleaned up after themselves. I
                      would definitely recommend them.
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={4}>
                <CCard className="mb-3">
                  <CCardBody>
                    <CCardTitle>Jane Doe</CCardTitle>
                    <CCardText>
                      <small>June 15, 2022</small>
                      <br />
                      The technician was very professional and fixed my air conditioner quickly. I was very impressed
                      with the service.
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={4}>
                <CCard className="mb-3">
                  <CCardBody>
                    <CCardTitle>Robert Johnson</CCardTitle>
                    <CCardText>
                      <small>May 28, 2022</small>
                      <br />
                      I had a great experience with this company. The technician was friendly and knowledgeable, and the
                      service was fast and efficient. I would definitely use them again.
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
                <div className="d-grid gap-2 col-6 mx-auto">
                    <CButton color="info" className="text-white fw-bold" href="/contact">Contact Us</CButton>
                </div>
            </CRow>
          </CCol>
        </CRow>
    </CContainer>
  );
};

export default About;