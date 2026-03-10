import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { LogoutRounded, LoginRounded } from "@mui/icons-material";
import Button from "./button";

const Container = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.navbar};
  color: ${({ theme }) => theme.text_primary};
  font-weight: bold;
  font-size: 22px;
  padding: 14px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  gap: 20px;
  @media only screen and (max-width: 600px) {
    padding: 10px 12px;
    gap: 10px;
  }
`;

const Brand = styled.span`
  color:${({ theme }) => theme.secondary}; /* accent color for GenAI text */
`;

const NavButtons = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  @media only screen and (max-width: 600px) {
    gap: 6px;
  }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.secondary || "#ff6b6b"};
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  animation: slideUp 0.3s ease;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;

const Navbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleGenerateClick = () => {
    if (!isLoggedIn) {
      setShowToast(true);
    } else {
      navigate("/post");
    }
  };

  return (
    <Container>
      <Brand>GenAI</Brand>
      <NavButtons>
        {path[1] === "post" ? (
          <Button
            onClick={() => navigate("/")}
            text="Explore Posts"
            leftIcon={
              <ExploreRounded
                style={{
                  fontSize: "18px",
                }}
              />
            }
            type="secondary"
          />
        ) : (
          <Button
            onClick={handleGenerateClick}
            text="Generate Image & post"
            type="secondary"
          />
        )}
        {isLoggedIn ? (
          <Button
            onClick={onLogout}
            text="Logout"
            leftIcon={
              <LogoutRounded
                style={{
                  fontSize: "18px",
                }}
              />
            }
            type="secondary"
          />
        ) : (
          <Button
            onClick={() => navigate("/auth")}
            text="Login"
            leftIcon={
              <LoginRounded
                style={{
                  fontSize: "18px",
                }}
              />
            }
            type="secondary"
          />
        )}
      </NavButtons>
      {showToast && <Toast>Login for image generation</Toast>}
    </Container>
  );
};

export default Navbar;
