import styled, { ThemeProvider } from "styled-components";
import { darkTheme } from "./utils/Theme";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Authentication from "./pages/Authentication";
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: hidden;
  transition: all 0.2s ease;
`;

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 3;
`;

function ProtectedLayout({ isLoggedIn, setIsLoggedIn, onLogout, children }) {
  if (!isLoggedIn) return <Navigate to="/auth" replace />;
  return (
    <Wrapper>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} onLogout={onLogout} />
      {children}
    </Wrapper>
  );
}

function UnprotectedLayout({ isLoggedIn, setIsLoggedIn, onLogout, children }) {
  return (
    <Wrapper>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} onLogout={onLogout} />
      {children}
    </Wrapper>
  );
}

function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const navigate = useNavigate();

  // Sync auth state when localStorage changes (handles back button, other tabs, etc.)
  useEffect(() => {
    const handleStorageChange = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
      // If user logged out via back button or other means, redirect to auth
      if (!loggedIn) {
        navigate("/auth", { replace: true });
      }
    };

    // Listen for storage changes
    window.addEventListener("storage", handleStorageChange);
    
    // Also handle browser back button
    window.addEventListener("popstate", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("popstate", handleStorageChange);
    };
  }, [navigate]);

  const handleAuthSuccess = (userData) => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(userData));
    navigate("/", { replace: true });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/auth", { replace: true });
  };

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          isLoggedIn
            ? <Navigate to="/" replace />
            : <Authentication initialScreen="login" onSuccess={handleAuthSuccess} onBack={() => navigate("/")} />
        }
      />
      <Route
        path="/"
        element={
          <UnprotectedLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
            <Home />
          </UnprotectedLayout>
        }
      />
      <Route
        path="/post"
        element={
          <ProtectedLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
            <CreatePost />
          </ProtectedLayout>
        }
      />
      <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/auth"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Container>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;