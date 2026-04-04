// src/pages/HomePage.jsx  — responsive version
// Changes vs original:
//   • Hero padding: 60px → 20px on mobile; 60px sides → 20px sides
//   • Stats row gap: 60 → 24 on mobile, font-sizes smaller
//   • Tools section padding: 60px sides → 20px
//   • Features & CTA sections: 60px padding → 20px
//   • CTA card padding: 60px/40px → 32px/24px on mobile

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TOOLS } from "../utils/theme";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { COLORS, CATEGORIES } from "../utils/theme.js";
// or wherever your theme.js file is located

const stats = [
  ["50M+", "Files Converted"],
  ["4.9★", "User Rating"],
  ["128-bit", "SSL Encryption"],
  ["99.9%", "Uptime SLA"],
];

const features = [
  { icon: "⚡", title: "Lightning Fast", desc: "Files processed in seconds using our optimized conversion engine." },
  { icon: "🔒", title: "100% Secure", desc: "All uploads are encrypted. Files auto-deleted after 1 hour." },
  { icon: "🌐", title: "Works Everywhere", desc: "No installation needed. Works on any device with a browser." },
  { icon: "📦", title: "Batch Processing", desc: "Convert multiple files at once with our merge and batch tools." },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const navigate = useNavigate();
  const isMobile = useBreakpoint(768);

  const filtered = activeCategory === "all"
    ? TOOLS
    : TOOLS.filter((t) => t.category === activeCategory);

  const px = isMobile ? "20px" : "60px";

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        .tool-card { background: 141416; border: 1px solid #232326; border-radius: 16px; padding: 26px 22px; cursor: pointer; transition: all 0.22s; position: relative; overflow: hidden; text-decoration: none; display: block; }
        .tool-card:hover { border-color: #3a3a3f; transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.5); }
        .cat-btn { background: transparent; border: 1px solid #232326; border-radius: 100px; padding: 7px 18px; font-size: 13px; cursor: pointer; font-family: 'DM Sans'; transition: all 0.2s; }
        .cat-btn.active { background: #F0EDE6; color: #0D0D0F; border-color: #F0EDE6; }
        .cat-btn:not(.active) { color: #888; }
        .cat-btn:not(.active):hover { border-color: #444; color: #F0EDE6; }
        .feature-card { background: #141416; border: 1px solid #232326; border-radius: 16px; padding: 28px; }
        .hero-glow { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 700px; height: 400px; background: radial-gradient(ellipse at center, rgba(79,142,247,0.07) 0%, transparent 70%); pointer-events: none; }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.6s 0.1s ease both; }
        .fade-up-3 { animation: fadeUp 0.6s 0.2s ease both; }
      `}</style>

      {/* HERO */}
      <section style={{
        textAlign: "center",
        padding: isMobile ? "60px 20px 50px" : "110px 60px 90px",
        position: "relative",
        background: COLORS.bg,
      }}>
        <div className="hero-glow" />
        <div className="fade-up">
          <span style={styles.badge}>✦ Free · No sign-up required</span>
          <h1 style={{
            ...styles.heroTitle,
            fontSize: isMobile ? "clamp(32px, 8vw, 52px)" : "clamp(42px, 6vw, 78px)",
            letterSpacing: isMobile ? "-1px" : "-2px",
            color: COLORS.text,
          }}>
            Convert documents<br />
            <span style={styles.heroGradient}>without the hassle.</span>
          </h1>
        </div>
        <p className="fade-up-2" style={{ ...styles.heroSub, fontSize: isMobile ? 15 : 18 }}>
          PDF, DOCX, JPG — convert, compress, merge & split.<br />
          Fast. Secure. Free. No installs.
        </p>
        <div className="fade-up-3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/tool/pdf-to-word")} style={{...styles.btnPrimary ,border: `1px solid black` } }>
            Try PDF to Word →
          </button>
          <button
            onClick={() => document.getElementById("tools-section").scrollIntoView({ behavior: "smooth" })}
            style={{ ...styles.btnOutline, color: COLORS.text }}
          >
            See all tools
          </button>
        </div>

        {/* Stats */}
        <div style={{
          ...styles.statsRow,
          gap: isMobile ? 24 : 60,
          marginTop: isMobile ? 48 : 72,
        }}>
          {stats.map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" , color: COLORS.text }}>
              <div style={{ ...styles.statValue, fontSize: isMobile ? 22 : 30 }}>{v}</div>
              <div style={{...styles.statLabel , color: COLORS.text }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools-section" style={{ padding: `0 ${px} 100px`, maxWidth: 1200, margin: "0 auto", background: COLORS.bg }}>
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ ...styles.sectionTitle , color: COLORS.text }}>All Tools</h2>
          <p style={styles.sectionSub}>Everything you need to work with documents.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
            {["all","convert","organize","optimize","edit","security"].map((cat) => (
              <button
                key={cat}
                className={`cat-btn${activeCategory === cat ? " active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          ...styles.toolGrid,
          gridTemplateColumns: isMobile
            ? "repeat(auto-fill, minmax(150px, 1fr))"
            : "repeat(auto-fill, minmax(210px, 1fr))",
        }}>
          {filtered.map((tool) => (
            <Link key={tool.id} to={`/tool/${tool.id}`} className="tool-card">
              <div style={{ position: "absolute", top: 16, right: 16, width: 8, height: 8, borderRadius: "50%", background: tool.color, opacity: 0.8 }} />
              <div style={{ fontSize: isMobile ? 22 : 28, marginBottom: 14 }}>
                {tool.icon}
                <span style={{ fontSize: isMobile ? 12 : 16, margin: "0 4px", color: "#444" }}>→</span>
                {tool.iconTo}
              </div>
              <p style={{ ...styles.toolLabel, fontSize: isMobile ? 13 : 15 }}>{tool.label}</p>
              <p style={styles.toolDesc}>{tool.desc}</p>
              <div style={{ marginTop: 16, display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{ ...styles.tag, borderColor: tool.color + "44", color: tool.color }}>{tool.from}</span>
                <span style={styles.tag}>{tool.to}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: COLORS.bg, borderTop: "1px solid #191919", padding: `80px ${px}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ ...styles.sectionTitle, marginBottom: 8 , color : COLORS.text }}>Why DocCraft?</h2>
          <p style={{ ...styles.sectionSub, marginBottom: 48 }}>Built for speed, security, and simplicity.</p>
          <div style={styles.featureGrid}>
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div style={styles.featureIcon}>{f.icon}</div>
                <p style={styles.featureTitle}>{f.title}</p>
                <p style={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: `80px ${px}`, textAlign: "center"  , background: COLORS.bg }}>
        <div style={{
          ...styles.ctaBox,
          padding: isMobile ? "40px 24px" : "60px 40px",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(79,142,247,0.1) 0%, transparent 60%)", pointerEvents: "none", borderRadius: 24 }} />
          <h2 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 800, letterSpacing: "-1px", fontFamily: "'Syne'", color: "#F0EDE6", marginBottom: 16 }}>
            Start converting for free
          </h2>
          <p style={{ fontFamily: "'DM Sans'", color: "#666", fontSize: isMobile ? 14 : 16, marginBottom: 32 }}>
            No sign-up required. No watermarks. No limits on free tools.
          </p>
          <Link to="/tools" style={styles.btnPrimary}>Browse All Tools →</Link>
        </div>
      </section>
    </div>
  );
}

const styles = {
  badge: {
    display: "inline-block", background: "#1e1e22", border: "1px solid #2e2e35",
    borderRadius: 100, padding: "5px 16px", fontSize: 12,
    fontFamily: "'DM Sans'", color: "#888", letterSpacing: "0.5px", marginBottom: 28,
  },
  heroTitle: {
    fontWeight: 800, lineHeight: 1.05, marginBottom: 24,
    fontFamily: "'Syne', sans-serif", color: "#F0EDE6",
  },
  heroGradient: {
    background: "linear-gradient(135deg, #4F8EF7, #A14FF7)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontFamily: "'DM Sans'", color: "#888",
    maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.8,
  },
  btnPrimary: {
    background: "#F0EDE6", color: "#0D0D0F", border: "none",
    borderRadius: 10, padding: "14px 32px", fontSize: 15,
    fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif",
    textDecoration: "none", display: "inline-block",
  },
  btnOutline: {
    background: "transparent", color: "#F0EDE6", border: "1px solid #333",
    borderRadius: 10, padding: "13px 28px", fontSize: 14,
    fontWeight: 600, cursor: "pointer", fontFamily: "'Syne', sans-serif",
  },
  statsRow: { display: "flex", justifyContent: "center", flexWrap: "wrap" },
  statValue: { fontWeight: 800, letterSpacing: "-1px", color: "#F0EDE6", fontFamily: "'Syne'" },
  statLabel: { fontSize: 13, color: "#555", marginTop: 4, fontFamily: "'DM Sans'" },
  sectionTitle: { fontSize: 34, fontWeight: 800, letterSpacing: "-1px", fontFamily: "'Syne'", color: "#F0EDE6" },
  sectionSub: { fontSize: 15, color: "#555", fontFamily: "'DM Sans'", marginTop: 8 },
  toolGrid: { display: "grid", gap: 16 },
  toolLabel: { fontWeight: 700, color: "#F0EDE6", fontFamily: "'Syne'", marginBottom: 6 },
  toolDesc: { fontSize: 13, color: "#666", fontFamily: "'DM Sans'", lineHeight: 1.6 },
  tag: {
    display: "inline-block", background: "#1a1a1e", border: "1px solid #2e2e33",
    borderRadius: 6, padding: "3px 9px", fontSize: 11,
    fontFamily: "'DM Sans'", color: "#666",
  },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 },
  featureIcon: {
    fontSize: 28, width: 54, height: 54, background: "#1a1a1e",
    border: "1px solid #2e2e33", borderRadius: 14,
    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18,
  },
  featureTitle: { fontSize: 16, fontWeight: 700, color: "#F0EDE6", fontFamily: "'Syne'", marginBottom: 8 },
  featureDesc: { fontSize: 14, color: "#666", fontFamily: "'DM Sans'", lineHeight: 1.7 },
  ctaBox: {
    maxWidth: 680, margin: "0 auto",
    background: "#141416", border: "1px solid #2e2e35",
    borderRadius: 24, position: "relative", overflow: "hidden",
  },
};