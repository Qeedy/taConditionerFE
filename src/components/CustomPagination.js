import React from "react";
import { CPagination, CPaginationItem } from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <CPagination align="center" className="mt-4 pagination-container">
      {/* Tombol Previous */}
      <CPaginationItem
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="pagination-arrow"
      >
        &lt;
      </CPaginationItem>

      {/* Nomor Halaman */}
      {pageNumbers.map((page) => (
        <CPaginationItem
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
          className={`pagination-number ${page === currentPage ? "active" : ""}`}
        >
          {page}
        </CPaginationItem>
      ))}

      {/* Tombol Next */}
      <CPaginationItem
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="pagination-arrow"
      >
        &gt;
      </CPaginationItem>
    </CPagination>
  );
};

export default CustomPagination;
