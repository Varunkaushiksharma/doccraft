// src/components/Footer.jsx  — responsive version
// Changes vs original:
//   • inner padding: 60px 60px → 40px 20px on mobile
//   • top section: flex-direction column on mobile
//   • cols gap: 60 → 32 on mobile

import { Link } from "react-router-dom";
import { useBreakpoint } from "../hooks/useBreakpoint";

const cols = [
  {
    title: "Tools",
    links: [
      { label: "PDF to Word", to: "/tool/pdf-to-word" },
      { label: "Word to PDF", to: "/tool/word-to-pdf" },
      { label: "Merge PDF",   to: "/tool/merge-pdf"   },
      { label: "Compress PDF",to: "/tool/compress-pdf" },
      { label: "All Tools",   to: "/tools"             },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About",   to: "/about"   },
      { label: "Pricing", to: "/pricing" },
      { label: "Blog",    to: "/blog"    },
      { label: "API",     to: "/api"     },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy",   to: "/privacy" },
      { label: "Terms of Service", to: "/terms"   },
      { label: "Cookie Policy",    to: "/cookies" },
    ],
  },
];

export default function Footer() {
  const isMobile = useBreakpoint(768);

  return (
    <footer style={styles.footer}>
      <div style={{ ...styles.inner, padding: isMobile ? "40px 20px 24px" : "60px 60px 32px" }}>
        <div style={{ ...styles.top, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 36 : 60 }}>

          {/* Brand */}
          <div style={styles.brand}>
            <div style={styles.logoIcon}>⚡</div>
            <span style={styles.logoText}>DocCraft</span>
            <p style={styles.tagline}>
              Fast, secure, and free document<br />conversion in your browser.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {["𝕏", "in", "gh"].map((s) => (
                <div key={s} style={styles.socialBtn}>{s}</div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div style={{ ...styles.cols, gap: isMobile ? 32 : 60 }}>
            {cols.map((col) => (
              <div key={col.title}>
                <p style={styles.colTitle}>{col.title}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {col.links.map((l) => (
                    <li key={l.label} style={{ marginBottom: 10 }}>
                      <Link to={l.to} style={styles.colLink}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.bottom}>
          <p style={styles.copy}>© 2026 DocCraft. All rights reserved.</p>
          <p style={styles.copy}>Built with React + Spring Boot + MySQL</p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: { background: "#0a0a0c", borderTop: "1px solid #191919", marginTop: "auto" },
  inner: { maxWidth: 1200, margin: "0 auto" },
  top: { display: "flex", justifyContent: "space-between", marginBottom: 48 },
  brand: { maxWidth: 240 },
  logoIcon: {
    width: 36, height: 36,
    background: "linear-gradient(135deg,#4F8EF7,#A14FF7)",
    borderRadius: 10, display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: 17, marginBottom: 10,
  },
  logoText: { fontSize: 20, fontWeight: 800, color: "#F0EDE6", letterSpacing: "-0.5px", fontFamily: "'Syne', sans-serif", display: "block", marginBottom: 14 },
  tagline: { fontSize: 13, color: "#555", fontFamily: "'DM Sans'", lineHeight: 1.7 },
  socialBtn: { width: 34, height: 34, background: "#141416", border: "1px solid #232326", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#666", cursor: "pointer" },
  cols: { display: "flex", flexWrap: "wrap" },
  colTitle: { fontSize: 12, fontWeight: 700, color: "#F0EDE6", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'Syne'", marginBottom: 16 },
  colLink: { fontSize: 14, color: "#555", textDecoration: "none", fontFamily: "'DM Sans'", transition: "color 0.2s" },
  bottom: { borderTop: "1px solid #191919", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 },
  copy: { fontSize: 13, color: "#444", fontFamily: "'DM Sans'" },
};