import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ToolPage from "./pages/ToolPage";
import ToolsPage from "./pages/ToolsPage";
import HistoryPage from "./pages/HistoryPage";
import { LoginPage, RegisterPage } from "./pages/AuthPages";

function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0D0D0F" }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/"              element={<Layout><HomePage /></Layout>} />
            <Route path="/tools"         element={<Layout><ToolsPage /></Layout>} />
            <Route path="/tool/:toolId"  element={<Layout><ToolPage /></Layout>} />
            <Route path="/history"       element={<Layout><HistoryPage /></Layout>} />
            <Route path="*" element={
              <Layout>
                <div style={{ textAlign: "center", padding: "120px 24px" }}>
                  <div style={{ fontSize: 64, marginBottom: 20 }}>🌌</div>
                  <h1 style={{ fontSize: 36, fontWeight: 800, color: "#F0EDE6", fontFamily: "'Syne'" }}>Page not found</h1>
                  <p style={{ color: "#555", fontFamily: "'DM Sans'", marginTop: 12, marginBottom: 32 }}>The page you're looking for doesn't exist.</p>
                  <a href="/" style={{ background: "#F0EDE6", color: "#0D0D0F", padding: "12px 28px", borderRadius: 10, fontWeight: 700, fontFamily: "'Syne'", textDecoration: "none", fontSize: 14 }}>
                    Go Home
                  </a>
                </div>
              </Layout>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}