import React from "react";
import { CButton, CContainer } from "@coreui/react";
import { cilCaretLeft, cilCaretRight } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <CContainer className="d-flex justify-content-center mt-4">
      <CButton
        color="light"
        className="mx-2 rounded-circle"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <CIcon icon={cilCaretLeft} />
      </CButton>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <CButton
          key={page}
          color={currentPage === page ? "secondary" : "light"}
          className="mx-2 rounded-circle"
          onClick={() => onPageChange(page)}
        >
          {page}
        </CButton>
      ))}
      <CButton
        color="light"
        className="mx-2 rounded-circle"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <CIcon icon={cilCaretRight} />
      </CButton>
    </CContainer>
  );
};

export default Pagination;
