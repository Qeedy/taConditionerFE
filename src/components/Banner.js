import {
  CButton,
  CCard,
  CCardImage,
  CCardImageOverlay,
  CCardText,
  CCardTitle,
} from "@coreui/react";
import React from "react";

export const Banner = ({ image, title, text, isWithButton, onLoginClick }) => {
  return (
    <CCard className="mb-4 bg-dark text-white border-0">
      <CCardImage
        src={image}
        className="w-100"
        style={{ objectFit: "cover" }}
      />
      <CCardImageOverlay className="d-flex flex-column justify-content-end p-5">
        <div className="text-start">
          <CCardTitle>
            <h1 className="text-white fw-bold">{title}</h1>
          </CCardTitle>
          <CCardText>
            <h5 className="text-white">{text}</h5>
          </CCardText>
          {isWithButton && (
            <CButton
              color="info"
              textBgColor="light"
              className="text-white fw-bold"
              onClick={() => onLoginClick(true)}
            >
              Book Now
            </CButton>
          )}
        </div>
      </CCardImageOverlay>
    </CCard>
  );
};
