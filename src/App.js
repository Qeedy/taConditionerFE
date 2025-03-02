import React, { Suspense, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import routes from "./router/Routers";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import { CContainer, CSpinner } from "@coreui/react";
import AuthService from "./services/AuthService";
import NavbarAfterLogin from "./components/NavbarAfterLogin";

const App = () => {
  const [loginVisible, setLoginVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const isAuthenticated = AuthService.isAuthenticated();
  const toggleToRegister = () => {
    setLoginVisible(false);
    setRegisterVisible(true);
  };

  const toggleToLogin = () => {
    setRegisterVisible(false);
    setLoginVisible(true);
  };

  return (
    <Router>
      {isAuthenticated ? <NavbarAfterLogin
        onLoginClick={() => setLoginVisible(true)}
        onRegisterClick={() => setRegisterVisible(true)}
      /> : <Navbar
      onLoginClick={() => setLoginVisible(true)}
      onRegisterClick={() => setRegisterVisible(true)}/>}
      
      <CContainer className="px-3 py-5">
        <Suspense
          fallback={
            <div
              style={{ height: "100vh" }}
              className="d-flex justify-content-center align-items-center"
            >
              <CSpinner
                color="info"
                style={{ width: "3rem", height: "3rem" }}
              />
            </div>
          }
        >
          <Routes>
            {routes.map((route, idx) => (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                element={React.cloneElement(route.element, {
                  onLoginClick: () => setLoginVisible(true),
                })}
              />
            ))}
          </Routes>
        </Suspense>
      </CContainer>
      <LoginModal
        visible={loginVisible}
        setVisible={setLoginVisible}
        toggleToRegister={toggleToRegister}
      />
      <RegisterModal
        visible={registerVisible}
        setVisible={setRegisterVisible}
        toggleToLogin={toggleToLogin}
        isAdminAdd={false}
      />
    </Router>
  );
};

export default App;
