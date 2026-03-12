import { useParams, Link } from "react-router-dom";
import { TOOLS } from "../utils/theme";
import { useConversion } from "../hooks/useConversion";
import DropZone from "../components/DropZone";
import ConversionStatus from "../components/ConversionStatus";
import AdBanner from "../components/AdBanner";
import { downloadBlob } from "../services/api";
import { useState } from "react";

// ── Tool-specific option panels ────────────────────────────────────────────

function SplitOptions({ opts, setOpts }) {
  return (
    <div style={optStyles.panel}>
      <p style={optStyles.label}>Split Mode</p>
      <div style={optStyles.toggleRow}>
        {["all-pages", "range"].map((mode) => (
          <button
            key={mode}
            onClick={() => setOpts((p) => ({ ...p, mode }))}
            style={{
              ...optStyles.toggleBtn,
              background: opts.mode === mode ? "#F0EDE6" : "#1a1a1e",
              color: opts.mode === mode ? "#0D0D0F" : "#888",
              border: opts.mode === mode ? "1px solid #F0EDE6" : "1px solid #2e2e33",
            }}
          >
            {mode === "all-pages" ? "✂️ Every Page" : "📐 Page Range"}
          </button>
        ))}
      </div>

      {opts.mode === "range" && (
        <div style={optStyles.row}>
          <div style={optStyles.inputGroup}>
            <label style={optStyles.inputLabel}>Start Page</label>
            <input
              type="number"
              min={1}
              value={opts.startPage}
              onChange={(e) => setOpts((p) => ({ ...p, startPage: e.target.value }))}
              style={optStyles.input}
              placeholder="1"
            />
          </div>
          <div style={optStyles.inputGroup}>
            <label style={optStyles.inputLabel}>End Page</label>
            <input
              type="number"
              min={1}
              value={opts.endPage}
              onChange={(e) => setOpts((p) => ({ ...p, endPage: e.target.value }))}
              style={optStyles.input}
              placeholder="e.g. 5"
            />
          </div>
        </div>
      )}

      {opts.mode === "all-pages" && (
        <p style={optStyles.hint}>Each page will be extracted as a separate PDF and bundled into a ZIP file.</p>
      )}
    </div>
  );
}

function RotateOptions({ opts, setOpts }) {
  return (
    <div style={optStyles.panel}>
      <p style={optStyles.label}>Rotation Angle</p>
      <div style={optStyles.toggleRow}>
        {[
          { val: "90",  label: "90° →" },
          { val: "180", label: "180° ↩" },
          { val: "270", label: "270° ←" },
        ].map(({ val, label }) => (
          <button
            key={val}
            onClick={() => setOpts((p) => ({ ...p, degrees: val }))}
            style={{
              ...optStyles.toggleBtn,
              background: opts.degrees === val ? "#F7A94F" : "#1a1a1e",
              color: opts.degrees === val ? "#0D0D0F" : "#888",
              border: opts.degrees === val ? "1px solid #F7A94F" : "1px solid #2e2e33",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <p style={optStyles.label}>Which Pages?</p>
      <div style={optStyles.toggleRow}>
        {["all", "specific"].map((mode) => (
          <button
            key={mode}
            onClick={() => setOpts((p) => ({ ...p, pageMode: mode }))}
            style={{
              ...optStyles.toggleBtn,
              background: opts.pageMode === mode ? "#F0EDE6" : "#1a1a1e",
              color: opts.pageMode === mode ? "#0D0D0F" : "#888",
              border: opts.pageMode === mode ? "1px solid #F0EDE6" : "1px solid #2e2e33",
            }}
          >
            {mode === "all" ? "All Pages" : "Specific Pages"}
          </button>
        ))}
      </div>

      {opts.pageMode === "specific" && (
        <div style={optStyles.inputGroup}>
          <label style={optStyles.inputLabel}>Page numbers (comma-separated)</label>
          <input
            type="text"
            value={opts.pageTarget}
            onChange={(e) => setOpts((p) => ({ ...p, pageTarget: e.target.value }))}
            style={optStyles.input}
            placeholder="e.g. 1,3,5"
          />
        </div>
      )}
    </div>
  );
}

function ProtectOptions({ opts, setOpts }) {
  const [showPass, setShowPass] = useState(false);
  return (
    <div style={optStyles.panel}>
      <div style={optStyles.inputGroup}>
        <label style={optStyles.inputLabel}>🔑 Password (required)</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPass ? "text" : "password"}
            value={opts.userPassword}
            onChange={(e) => setOpts((p) => ({ ...p, userPassword: e.target.value }))}
            style={{ ...optStyles.input, paddingRight: 48 }}
            placeholder="Enter a strong password"
          />
          <button
            onClick={() => setShowPass((v) => !v)}
            style={optStyles.eyeBtn}
            title={showPass ? "Hide" : "Show"}
          >
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      <div style={optStyles.inputGroup}>
        <label style={optStyles.inputLabel}>🛡️ Owner Password <span style={{ color: "#444", fontWeight: 400 }}>(optional)</span></label>
        <input
          type="password"
          value={opts.ownerPassword}
          onChange={(e) => setOpts((p) => ({ ...p, ownerPassword: e.target.value }))}
          style={optStyles.input}
          placeholder="Leave blank to auto-generate"
        />
      </div>

      <p style={optStyles.hint}>
        The <strong style={{ color: "#F0EDE6" }}>user password</strong> is required to open the file.
        The <strong style={{ color: "#F0EDE6" }}>owner password</strong> controls editing permissions.
      </p>
    </div>
  );
}

 
function UnlockOptions({ opts, setOpts }) {
  const [showPass, setShowPass] = useState(false);
  return (
    <div style={optStyles.panel}>
      <div style={optStyles.inputGroup}>
        <label style={optStyles.inputLabel}>🔑 Current Password (if known)</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPass ? "text" : "password"}
            value={opts.password}
            onChange={(e) => setOpts((p) => ({ ...p, password: e.target.value }))}
            style={{ ...optStyles.input, paddingRight: 48 }}
            placeholder="Leave blank to try without password"
          />
          <button
            onClick={() => setShowPass((v) => !v)}
            style={optStyles.eyeBtn}
            title={showPass ? "Hide" : "Show"}
          >
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>
      </div>
      <p style={optStyles.hint}>
        If the PDF has an <strong style={{ color: "#F0EDE6" }}>owner password</strong> only (not a user password),
        we can remove it automatically without a password.
      </p>
    </div>
  );
}

// ── Option default state per tool ──────────────────────────────────────────
const defaultOpts = {
  "split-pdf":   { mode: "all-pages", startPage: "1", endPage: "" },
  "rotate-pdf":  { degrees: "90", pageMode: "all", pageTarget: "" },
  "protect-pdf": { userPassword: "", ownerPassword: "" },
  "unlock-pdf":  { password: "" },   // ← ADD THIS LINE
};

// Build the options object to send to the backend
function buildApiOptions(toolId, opts) {
  if (toolId === "split-pdf") {
    if (opts.mode === "range") {
      // Use split-pdf-range endpoint via toolId override isn't possible,
      // so we pass startPage + endPage — backend controller checks for these
      return { startPage: opts.startPage, endPage: opts.endPage };
    }
    return {}; // all-pages — no extra params needed
  }
  if (toolId === "rotate-pdf") {
    return {
      degrees: opts.degrees,
      pageTarget: opts.pageMode === "all" ? "all" : opts.pageTarget,
    };
  }
  if (toolId === "protect-pdf") {
    return {
      userPassword: opts.userPassword,
      ownerPassword: opts.ownerPassword || "",
    };
  }
  if (toolId === "unlock-pdf") {
    return { password: opts.password || "" };  // ← ADD THIS BLOCK
  }
  return {};
}

// Validation before convert
function validateOpts(toolId, opts) {
  if (toolId === "split-pdf" && opts.mode === "range") {
    if (!opts.startPage || !opts.endPage) return "Please enter both start and end page.";
    if (parseInt(opts.startPage) > parseInt(opts.endPage)) return "Start page must be ≤ end page.";
  }
  if (toolId === "protect-pdf") {
    if (!opts.userPassword) return "Please enter a password to protect the PDF.";
    if (opts.userPassword.length < 4) return "Password must be at least 4 characters.";
  }
  if (toolId === "rotate-pdf" && opts.pageMode === "specific" && !opts.pageTarget.trim()) {
    return "Please enter page numbers (e.g. 1,3,5).";
  }
  return null;
}

// ── Main ToolPage ──────────────────────────────────────────────────────────
export default function ToolPage() {
  const { toolId } = useParams();
  const tool = TOOLS.find((t) => t.id === toolId);

  const {
    files, progress, status, error, resultFilename,
    addFiles, removeFile, reset, convert,
  } = useConversion(tool);

  const [resultBlob, setResultBlob] = useState(null);
  const [opts, setOpts] = useState(defaultOpts[toolId] || {});
  const [optsError, setOptsError] = useState(null);

  // If toolId changes (user navigates between tools), reset opts
  const hasOptions = !!defaultOpts[toolId];

  const handleConvert = () => {
    if (hasOptions) {
      const err = validateOpts(toolId, opts);
      if (err) { setOptsError(err); return; }
      setOptsError(null);

      // split-pdf range → use different endpoint
      const apiOpts = buildApiOptions(toolId, opts);

      // For split-pdf range mode, we need to hit /split-pdf-range endpoint
      if (toolId === "split-pdf" && opts.mode === "range") {
        convert(apiOpts, "split-pdf-range");
      } else {
        convert(apiOpts);
      }
    } else {
      convert();
    }
  };

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
        input[type=number]::-webkit-inner-spin-button { opacity: 0.4; }
        input::placeholder { color: #444; }
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

        {/* ── Two column layout ──────────────────────────────────── */}
        <div style={styles.twoCol}>

          {/* MAIN CARD */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.card}>
              {status === "idle" || status === "error" ? (
                <>
                  <DropZone tool={tool} files={files} onAdd={addFiles} onRemove={removeFile} />

                  {/* ── Tool-specific options ── */}
                  {files.length > 0 && hasOptions && (
                    <div style={{ marginTop: 20 }}>
                      {toolId === "split-pdf"   && <SplitOptions   opts={opts} setOpts={setOpts} />}
                      {toolId === "rotate-pdf"  && <RotateOptions  opts={opts} setOpts={setOpts} />}
                      {toolId === "protect-pdf" && <ProtectOptions opts={opts} setOpts={setOpts} />}
                    </div>
                  )}

                  {/* Validation error */}
                  {optsError && (
                    <div style={styles.optsError}>⚠️ {optsError}</div>
                  )}

                  {files.length > 0 && status !== "error" && (
                    <button onClick={handleConvert} style={{ ...styles.convertBtn, background: tool.color === "#E85D4A" ? "#E85D4A" : "#F0EDE6", color: "#0D0D0F" }}>
                      {toolId === "protect-pdf" ? "🔒 Protect PDF →" :
                       toolId === "rotate-pdf"  ? "🔄 Rotate PDF →" :
                       toolId === "split-pdf"   ? "✂️ Split PDF →" :
                       `Convert to ${tool.to} →`}
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

            {/* AD BELOW CARD */}
            <div style={{ marginTop: 28 }}>
              <AdBanner slot="7777777777" format="horizontal" />
            </div>

            {/* HOW TO USE */}
            <div style={styles.howTo}>
              <h3 style={styles.subHeading}>How to {tool.label}</h3>
              <div style={styles.stepsRow}>
                {[
                  { n: "1", t: `Upload your ${tool.from}`, d: `Drag & drop or click to browse your ${tool.from} file.` },
                  { n: "2", t: "Click Convert",            d: `We process it instantly using our high-fidelity ${tool.label} engine.` },
                  { n: "3", t: `Download ${tool.to}`,      d: "Your converted file downloads automatically. Ready to use." },
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

          {/* SIDEBAR ADS */}
          <div style={styles.sidebar}>
            <AdBanner slot="8888888888" format="rectangle" />
            <div style={{ marginTop: 20 }}>
              <AdBanner slot="9999999999" format="rectangle" />
            </div>
          </div>
        </div>

        {/* BOTTOM AD */}
        <div style={{ marginTop: 48 }}>
          <AdBanner slot="1010101010" format="horizontal" />
        </div>
      </div>
    </div>
  );
}

// ── Option panel styles ────────────────────────────────────────────────────
const optStyles = {
  panel: {
    background: "#0f0f11",
    border: "1px solid #2a2a2e",
    borderRadius: 14,
    padding: "20px 22px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: "#888",
    fontFamily: "'DM Sans'",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    margin: 0,
  },
  toggleRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  toggleBtn: {
    borderRadius: 10,
    padding: "9px 18px",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'DM Sans'",
    cursor: "pointer",
    transition: "all 0.18s",
  },
  row: { display: "flex", gap: 14 },
  inputGroup: { display: "flex", flexDirection: "column", gap: 6, flex: 1 },
  inputLabel: { fontSize: 12, color: "#666", fontFamily: "'DM Sans'", fontWeight: 600 },
  input: {
    background: "#1a1a1e",
    border: "1px solid #2e2e33",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 14,
    color: "#F0EDE6",
    fontFamily: "'DM Sans'",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
  },
  hint: { fontSize: 12, color: "#444", fontFamily: "'DM Sans'", lineHeight: 1.6, margin: 0 },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    padding: 0,
  },
};

// ── Page styles (unchanged from original) ─────────────────────────────────
const styles = {
  page: { background: "#0D0D0F", minHeight: "100vh", paddingBottom: 80 },
  container: { maxWidth: 1100, margin: "0 auto", padding: "32px 24px" },
  twoCol: { display: "flex", gap: 28, alignItems: "flex-start" },
  sidebar: { width: 300, flexShrink: 0, position: "sticky", top: 100 },
  backBtn: { color: "#666", fontSize: 14, textDecoration: "none", fontFamily: "'DM Sans'", display: "inline-block", marginBottom: 32 },
  header: { display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 20 },
  iconBox: { width: 68, height: 68, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title: { fontSize: 34, fontWeight: 800, letterSpacing: "-1px", color: "#F0EDE6", fontFamily: "'Syne'", marginBottom: 8 },
  desc: { fontSize: 15, color: "#666", fontFamily: "'DM Sans'", lineHeight: 1.6 },
  breadcrumb: { display: "flex", alignItems: "center", gap: 10, marginBottom: 28 },
  breadTag: { display: "inline-block", background: "#1a1a1e", border: "1px solid #2e2e33", borderRadius: 8, padding: "4px 12px", fontSize: 12, fontFamily: "'DM Sans'", color: "#888", fontWeight: 600 },
  card: { background: "#141416", border: "1px solid #232326", borderRadius: 20, padding: 32 },
  convertBtn: { width: "100%", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne'", marginTop: 20 },
  optsError: { background: "#2a1212", border: "1px solid #5a2020", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#E85D4A", fontFamily: "'DM Sans'", marginTop: 12 },
  badges: { display: "flex", flexWrap: "wrap", gap: 16, marginTop: 16 },
  secBadge: { fontSize: 12, color: "#444", fontFamily: "'DM Sans'" },
  howTo: { marginTop: 48 },
  subHeading: { fontSize: 22, fontWeight: 800, color: "#F0EDE6", fontFamily: "'Syne'", letterSpacing: "-0.5px", marginBottom: 20 },
  stepsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 },
  step: { background: "#141416", border: "1px solid #232326", borderRadius: 14, padding: 22 },
  stepNum: { width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, fontFamily: "'Syne'", marginBottom: 14 },
  stepTitle: { fontSize: 14, fontWeight: 700, color: "#F0EDE6", fontFamily: "'Syne'", marginBottom: 6 },
  stepDesc: { fontSize: 13, color: "#666", fontFamily: "'DM Sans'", lineHeight: 1.6 },
  relatedGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14 },
  heading: { fontSize: 28, fontWeight: 800, color: "#F0EDE6", fontFamily: "'Syne'" },
  backLink: { color: "#4F8EF7", textDecoration: "none", fontFamily: "'DM Sans'", display: "inline-block", marginTop: 16 },
};