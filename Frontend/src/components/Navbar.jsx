import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/tools", label: "All Tools" },
  ];

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <Link to="/" style={styles.logo}>
        <div style={styles.logoIcon}>⚡</div>
        <span style={styles.logoText}>DocCraft</span>
      </Link>

      {/* Center links */}
      <div style={styles.links}>
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            style={{
              ...styles.link,
              color: location.pathname === to ? "#F0EDE6" : "#888",
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Right side actions */}
      <div style={styles.actions}>
        {user ? (
          <>
            <Link
              to="/history"
              style={{
                ...styles.linkBtn,
                color: location.pathname === "/history" ? "#F0EDE6" : "#888",
              }}
            >
              History
            </Link>
            <div style={styles.avatar} title={user.name}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <button onClick={handleLogout} style={styles.btnOutline}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.linkBtn}>Sign in</Link>
            <Link to="/register" style={styles.btnPrimary}>Get Started Free</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 60px",
    borderBottom: "1px solid #191919",
    position: "sticky",
    top: 0,
    background: "rgba(13,13,15,0.92)",
    backdropFilter: "blur(16px)",
    zIndex: 100,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
  },
  logoIcon: {
    width: 34,
    height: 34,
    background: "linear-gradient(135deg,#4F8EF7,#A14FF7)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 800,
    color: "#F0EDE6",
    letterSpacing: "-0.5px",
    fontFamily: "'Syne', sans-serif",
  },
  links: { display: "flex", gap: 32 },
  link: {
    textDecoration: "none",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    transition: "color 0.2s",
  },
  actions: { display: "flex", alignItems: "center", gap: 12 },
  linkBtn: {
    fontSize: 14,
    textDecoration: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "color 0.2s",
  },
  btnOutline: {
    background: "transparent",
    color: "#F0EDE6",
    border: "1px solid #333",
    borderRadius: 10,
    padding: "9px 20px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Syne', sans-serif",
  },
  btnPrimary: {
    background: "#F0EDE6",
    color: "#0D0D0F",
    border: "none",
    borderRadius: 10,
    padding: "9px 20px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Syne', sans-serif",
    textDecoration: "none",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#4F8EF7,#A14FF7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    color: "#fff",
    cursor: "pointer",
  },
};