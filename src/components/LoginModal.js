import React, { useState } from "react";
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CButton,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

const LoginModal = ({ visible, setVisible, toggleToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    AuthService.handleLogin(
      email,
      password,
      () => {
        setVisible(false); 
        
        navigate("/dashboard"); 
      },
      (error) => setErrorMessage(error) 
    );
  };

  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={() => setVisible(false)}
    >
      <CModalHeader>Login</CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleLogin}>
          {errorMessage && (
            <div className="text-danger mb-3">{errorMessage}</div>
          )}
          <CFormInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3 bg-light"
          />
          <CFormInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-3 bg-light"
          />
          <CButton
            type="submit"
            color="info"
            textBgColor="light"
            className="text-white fw-bold w-100"
          >
            Login
          </CButton>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <div className="w-100 text-center">
          <p className="mb-2">Don't have an account?</p>
          <CButton color="link" onClick={toggleToRegister}>
            Create Account
          </CButton>
        </div>
      </CModalFooter>
    </CModal>
  );
};

export default LoginModal;
