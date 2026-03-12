import { useParams, Link } from "react-router-dom";
import { TOOLS } from "../utils/theme";
import { useConversion } from "../hooks/useConversion";
import DropZone from "../components/DropZone";
import ConversionStatus from "../components/ConversionStatus";
import AdBanner from "../components/AdBanner";
import { downloadBlob } from "../services/api";
import { useState } from "react";

export default function ToolPage() {
  const { toolId } = useParams();
  const tool = TOOLS.find((t) => t.id === toolId);

  const {
    files, progress, status, error, resultFilename,
    addFiles, removeFile, reset, convert,
  } = useConversion(tool);

  const [resultBlob, setResultBlob] = useState(null);

  if (!tool) {
    return (
      <div style={{ textAlign: "center", padding: "120px 24px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <h2 style={styles.heading}>Tool not found</h2>
        <Link to="/tools" style={styles.backLink}>← Back to all tools</Link>
      </div>
    );
  }

  const relatedTools = TOOLS.filter((t) => t.id !== tool.id).slice(0, 4);

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .related-card { background: #141416; border: 1px solid #232326; border-radius: 14px; padding: 20px; cursor: pointer; transition: all 0.2s; text-decoration: none; display: block; }
        .related-card:hover { border-color: #3a3a3f; transform: translateY(-2px); }
      `}</style>

      {/* ── TOP AD BANNER ─────────────────────────────────────────── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 24px 0" }}>
        <AdBanner slot="6666666666" format="horizontal" />
      </div>

      <div style={styles.container} className="fade-up">
        {/* BACK */}
        <Link to="/tools" style={styles.backBtn}>← All Tools</Link>

        {/* HEADER */}
        <div style={styles.header}>
          <div style={{ ...styles.iconBox, background: tool.color + "18", border: `1px solid ${tool.color}33` }}>
            <span style={{ fontSize: 30 }}>{tool.icon}</span>
          </div>
          <div>
            <h1 style={styles.title}>{tool.label}</h1>
            <p style={styles.desc}>{tool.desc}</p>
          </div>
        </div>

        {/* BREADCRUMB */}
        <div style={styles.breadcrumb}>
          <span style={styles.breadTag}>{tool.from}</span>
          <span style={{ color: "#444", fontSize: 18 }}>→</span>
          <span style={{ ...styles.breadTag, borderColor: tool.color + "44", color: tool.color }}>{tool.to}</span>
        </div>

        {/* ── Two column layout: main card + sidebar ad ──────────── */}
        <div style={styles.twoCol}>

          {/* MAIN CARD */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.card}>
              {status === "idle" || status === "error" ? (
                <>
                  <DropZone tool={tool} files={files} onAdd={addFiles} onRemove={removeFile} />
                  {files.length > 0 && status !== "error" && (
                    <button onClick={() => convert()} style={styles.convertBtn}>
                      Convert to {tool.to} →
                    </button>
                  )}
                </>
              ) : null}

              <ConversionStatus
                status={status}
                progress={progress}
                error={error}
                tool={tool}
                resultFilename={resultFilename}
                onReset={reset}
                onDownload={() => resultBlob && downloadBlob(resultBlob, resultFilename)}
              />
            </div>

            {/* SECURITY BADGES */}
            <div style={styles.badges}>
              {[
                "🔒 Files deleted after 1hr",
                "🛡️ 128-bit SSL encryption",
                "🚫 Never shared with third parties",
              ].map((b) => (
                <span key={b} style={styles.secBadge}>{b}</span>
              ))}
            </div>

            {/* ── AD BELOW CONVERSION CARD ──────────────────────── */}
            <div style={{ marginTop: 28 }}>
              <AdBanner slot="7777777777" format="horizontal" />
            </div>

            {/* HOW TO USE */}
            <div style={styles.howTo}>
              <h3 style={styles.subHeading}>How to {tool.label}</h3>
              <div style={styles.stepsRow}>
                {[
                  { n: "1", t: `Upload your ${tool.from}`, d: `Drag & drop or click to browse your ${tool.from} file.` },
                  { n: "2", t: "Click Convert", d: `We process it instantly using our high-fidelity ${tool.label} engine.` },
                  { n: "3", t: `Download ${tool.to}`, d: "Your converted file downloads automatically. Ready to use." },
                ].map((s) => (
                  <div key={s.n} style={styles.step}>
                    <div style={{ ...styles.stepNum, background: tool.color + "22", color: tool.color }}>{s.n}</div>
                    <p style={styles.stepTitle}>{s.t}</p>
                    <p style={styles.stepDesc}>{s.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RELATED TOOLS */}
            <div style={{ marginTop: 48 }}>
              <h3 style={styles.subHeading}>Related Tools</h3>
              <div style={styles.relatedGrid}>
                {relatedTools.map((t) => (
                  <Link key={t.id} to={`/tool/${t.id}`} className="related-card">
                    <div style={{ fontSize: 22, marginBottom: 10 }}>{t.icon} → {t.iconTo}</div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: "#F0EDE6", fontFamily: "'Syne'" }}>{t.label}</p>
                    <p style={{ fontSize: 12, color: "#555", fontFamily: "'DM Sans'", marginTop: 4 }}>{t.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── SIDEBAR ADS ─────────────────────────────────────── */}
          <div style={styles.sidebar}>
            <AdBanner slot="8888888888" format="rectangle" />
            <div style={{ marginTop: 20 }}>
              <AdBanner slot="9999999999" format="rectangle" />
            </div>
          </div>

        </div>

        {/* ── BOTTOM AD ───────────────────────────────────────────── */}
        <div style={{ marginTop: 48 }}>
          <AdBanner slot="1010101010" format="horizontal" />
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: { background: "#0D0D0F", minHeight: "100vh", paddingBottom: 80 },
  container: { maxWidth: 1100, margin: "0 auto", padding: "32px 24px" },
  twoCol: { display: "flex", gap: 28, alignItems: "flex-start" },
  sidebar: { width: 300, flexShrink: 0, position: "sticky", top: 100 },
  backBtn: {
    color: "#666", fontSize: 14, textDecoration: "none",
    fontFamily: "'DM Sans'", display: "inline-block", marginBottom: 32,
  },
  header: { display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 20 },
  iconBox: {
    width: 68, height: 68, borderRadius: 18,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  title: {
    fontSize: 34, fontWeight: 800, letterSpacing: "-1px",
    color: "#F0EDE6", fontFamily: "'Syne'", marginBottom: 8,
  },
  desc: { fontSize: 15, color: "#666", fontFamily: "'DM Sans'", lineHeight: 1.6 },
  breadcrumb: { display: "flex", alignItems: "center", gap: 10, marginBottom: 28 },
  breadTag: {
    display: "inline-block", background: "#1a1a1e", border: "1px solid #2e2e33",
    borderRadius: 8, padding: "4px 12px", fontSize: 12,
    fontFamily: "'DM Sans'", color: "#888", fontWeight: 600,
  },
  card: { background: "#141416", border: "1px solid #232326", borderRadius: 20, padding: 32 },
  convertBtn: {
    width: "100%", background: "#F0EDE6", color: "#0D0D0F", border: "none",
    borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700,
    cursor: "pointer", fontFamily: "'Syne'", marginTop: 20,
  },
  badges: { display: "flex", flexWrap: "wrap", gap: 16, marginTop: 16 },
  secBadge: { fontSize: 12, color: "#444", fontFamily: "'DM Sans'" },
  howTo: { marginTop: 48 },
  subHeading: {
    fontSize: 22, fontWeight: 800, color: "#F0EDE6",
    fontFamily: "'Syne'", letterSpacing: "-0.5px", marginBottom: 20,
  },
  stepsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 },
  step: { background: "#141416", border: "1px solid #232326", borderRadius: 14, padding: 22 },
  stepNum: {
    width: 36, height: 36, borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16, fontWeight: 800, fontFamily: "'Syne'", marginBottom: 14,
  },
  stepTitle: { fontSize: 14, fontWeight: 700, color: "#F0EDE6", fontFamily: "'Syne'", marginBottom: 6 },
  stepDesc: { fontSize: 13, color: "#666", fontFamily: "'DM Sans'", lineHeight: 1.6 },
  relatedGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14 },
  heading: { fontSize: 28, fontWeight: 800, color: "#F0EDE6", fontFamily: "'Syne'" },
  backLink: { color: "#4F8EF7", textDecoration: "none", fontFamily: "'DM Sans'", display: "inline-block", marginTop: 16 },
};