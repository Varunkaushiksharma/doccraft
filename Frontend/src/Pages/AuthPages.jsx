import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthForm({ mode }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .auth-input:focus { outline: none; border-color: #4F8EF7; }
        .auth-input { transition: border-color 0.2s; }
      `}</style>

      <div style={styles.card}>
        <Link to="/" style={styles.logo}>
          <div style={styles.logoIcon}>⚡</div>
          <span style={styles.logoText}>DocCraft</span>
        </Link>

        <h1 style={styles.title}>{isLogin ? "Welcome back" : "Create your account"}</h1>
        <p style={styles.sub}>
          {isLogin ? "Sign in to access your conversion history." : "Free forever. No credit card required."}
        </p>

        {error && (
          <div style={styles.errorBox}>{error}</div>
        )}

        <div style={styles.fields}>
          {!isLogin && (
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                className="auth-input"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={styles.input}
              />
            </div>
          )}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={styles.input}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Please wait…" : isLogin ? "Sign In" : "Create Account"}
        </button>

        <p style={styles.switchText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link to={isLogin ? "/register" : "/login"} style={styles.switchLink}>
            {isLogin ? "Sign up free" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}

export function LoginPage() { return <AuthForm mode="login" />; }
export function RegisterPage() { return <AuthForm mode="register" />; }

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0D0D0F",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    background: "#141416",
    border: "1px solid #232326",
    borderRadius: 24,
    padding: "48px 44px",
    width: "100%",
    maxWidth: 440,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    marginBottom: 36,
    justifyContent: "center",
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: "linear-gradient(135deg,#4F8EF7,#A14FF7)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 17,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 800,
    color: "#F0EDE6",
    fontFamily: "'Syne'",
    letterSpacing: "-0.5px",
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: "#F0EDE6",
    fontFamily: "'Syne'",
    letterSpacing: "-0.8px",
    textAlign: "center",
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: "#666",
    fontFamily: "'DM Sans'",
    textAlign: "center",
    marginBottom: 32,
  },
  errorBox: {
    background: "#1a0e0e",
    border: "1px solid #3a1818",
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: 13,
    color: "#E85D4A",
    fontFamily: "'DM Sans'",
    marginBottom: 20,
  },
  fields: { display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 13, fontWeight: 600, color: "#888", fontFamily: "'DM Sans'", letterSpacing: "0.3px" },
  input: {
    background: "#0D0D0F",
    border: "1px solid #232326",
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: 14,
    color: "#F0EDE6",
    fontFamily: "'DM Sans'",
    width: "100%",
  },
  btn: {
    width: "100%",
    background: "#F0EDE6",
    color: "#0D0D0F",
    border: "none",
    borderRadius: 12,
    padding: "14px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Syne'",
    letterSpacing: "0.2px",
  },
  switchText: {
    textAlign: "center",
    fontSize: 14,
    color: "#555",
    fontFamily: "'DM Sans'",
    marginTop: 24,
  },
  switchLink: { color: "#4F8EF7", textDecoration: "none", fontWeight: 600 },
};