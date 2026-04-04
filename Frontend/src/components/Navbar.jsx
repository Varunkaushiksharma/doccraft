// src/components/Navbar.jsx  — responsive version
// Changes vs original:
//   • Responsive padding (20px mobile vs 60px desktop)
//   • Hamburger menu on mobile — collapses all links into a slide-down drawer
//   • Touch targets min 44px (accessibility)

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { COLORS } from "../utils/theme";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useBreakpoint(768);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <nav style={{ ...styles.nav, padding: isMobile ? "14px 20px" : "18px 60px" , background: COLORS.bg }}>
      <Link to="/" style={styles.logo} onClick={close}>
        <div style={styles.logoIcon}>⚡</div>
        <span style={{ ...styles.logoText, color: COLORS.text }}>DocCraft</span>
      </Link>

      {!isMobile && (
        <div style={{...styles.links , color: COLORS.text }}>
          <Link to="/tools" style={{ ...styles.link, color: location.pathname === "/tools" ? COLORS.text : "#888" }}>
            All Tools
          </Link>
        </div>
      )}

      {!isMobile && (
        <div style={styles.actions}>
          {user ? (
            <>
              <Link to="/history" style={{ ...styles.linkBtn, color: location.pathname === "/history" ? "#F0EDE6" : "#888" }}>
                History
              </Link>
              <div style={styles.avatar} title={user.name}>{user.name?.[0]?.toUpperCase()}</div>
              <button onClick={handleLogout} style={styles.btnOutline}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.linkBtn}>Sign in</Link>
              <Link to="/register" style={styles.btnPrimary}>Get Started Free</Link>
            </>
          )}
        </div>
      )}

      {isMobile && (
        <button
          onClick={() => setMenuOpen((v) => !v)}
          style={styles.hamburger}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      )}

      {isMobile && menuOpen && (
        <div style={styles.drawer}>
          <Link to="/tools" style={{ ...styles.drawerLink, color: location.pathname === "/tools" ? "#F0EDE6" : "#888" }} onClick={close}>
            All Tools
          </Link>
          {user ? (
            <>
              <Link to="/history" style={{ ...styles.drawerLink, color: location.pathname === "/history" ? "#F0EDE6" : "#888" }} onClick={close}>
                History
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
                <div style={styles.avatar}>{user.name?.[0]?.toUpperCase()}</div>
                <span style={{ fontSize: 14, color: "#888", fontFamily: "'DM Sans'" }}>{user.name}</span>
              </div>
              <button onClick={handleLogout} style={{ ...styles.btnOutline, width: "100%", marginTop: 4 }}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.drawerLink} onClick={close}>Sign in</Link>
              <Link to="/register" style={{ ...styles.btnPrimary, display: "block", textAlign: "center", marginTop: 8 }} onClick={close}>
                Get Started Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap",
    borderBottom: "1px solid #191919",
    position: "sticky", top: 0,
    background: "rgba(13,13,15,0.92)",
    backdropFilter: "blur(16px)",
    zIndex: 100,
  },
  logo: { display: "flex", alignItems: "center", gap: 10, textDecoration: "none" },
  logoIcon: {
    width: 34, height: 34,
    background: "linear-gradient(135deg,#4F8EF7,#A14FF7)",
    borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
  },
  logoText: { fontSize: 20, fontWeight: 800, color: "#F0EDE6", letterSpacing: "-0.5px", fontFamily: "'Syne', sans-serif" },
  links: { display: "flex", gap: 32 },
  link: { textDecoration: "none", fontSize: 14, fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" },
  actions: { display: "flex", alignItems: "center", gap: 12 },
  linkBtn: { fontSize: 14, textDecoration: "none", fontFamily: "'DM Sans', sans-serif", color: "#888", transition: "color 0.2s" },
  btnOutline: {
    background: "transparent", color: "#F0EDE6", border: "1px solid #333",
    borderRadius: 10, padding: "9px 20px", fontSize: 13, fontWeight: 600,
    cursor: "pointer", fontFamily: "'Syne', sans-serif",
  },
  btnPrimary: {
    background: "#F0EDE6", color: "#0D0D0F", border: "none",
    borderRadius: 10, padding: "9px 20px", fontSize: 13, fontWeight: 700,
    cursor: "pointer", fontFamily: "'Syne', sans-serif", textDecoration: "none",
  },
  avatar: {
    width: 34, height: 34, borderRadius: "50%",
    background: "linear-gradient(135deg,#4F8EF7,#A14FF7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer",
  },
  hamburger: {
    background: "none", border: "none", color: "#F0EDE6",
    cursor: "pointer", padding: "4px",
    display: "flex", alignItems: "center", justifyContent: "center",
    minWidth: 44, minHeight: 44,
  },
  drawer: {
    width: "100%", borderTop: "1px solid #191919",
    padding: "16px 20px 20px",
    display: "flex", flexDirection: "column", gap: 4,
    background: "rgba(13,13,15,0.97)",
  },
  drawerLink: {
    fontSize: 16, textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
    padding: "12px 0", borderBottom: "1px solid #191919", color: "#888",
    transition: "color 0.2s",
  },
};