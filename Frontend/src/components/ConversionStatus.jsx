export default function ConversionStatus({ status, progress, error, tool, resultFilename, onReset, onDownload }) {
  if (status === "idle") return null;

  if (status === "uploading" || status === "converting") {
    return (
      <div style={styles.card}>
        <div style={styles.spinner} />
        <p style={styles.statusText}>
          {status === "uploading"
            ? `Uploading… ${progress?.percent ?? 0}%`
            : "Converting your file…"}
        </p>
        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: status === "converting" ? "100%" : `${progress?.percent ?? 0}%`,
              background: `linear-gradient(90deg, ${tool.color}, #A14FF7)`,
              transition: status === "converting" ? "width 2s ease" : "width 0.3s",
            }}
          />
        </div>
        <p style={styles.subText}>
          {status === "uploading"
            ? "Sending file to server securely…"
            : "Processing with our conversion engine…"}
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ ...styles.card, borderColor: "#3a1818", background: "#160e0e" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <p style={{ ...styles.statusText, color: "#E85D4A" }}>Conversion Failed</p>
        <p style={styles.subText}>{error}</p>
        <button onClick={onReset} style={styles.btnPrimary}>Try Again</button>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div style={{ ...styles.card, borderColor: "#1f3627", background: "#0e1a12" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <p style={{ ...styles.statusText, color: "#5BBF7A" }}>Conversion Complete!</p>
        <p style={styles.subText}>
          Your {tool.to} file is ready.{" "}
          {resultFilename && <span style={{ color: "#F0EDE6" }}>{resultFilename}</span>}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
          <button
            onClick={onDownload}
            style={{ ...styles.btnPrimary, background: "#5BBF7A", color: "#0D0D0F" }}
          >
            ⬇ Download {tool.to}
          </button>
          <button onClick={onReset} style={styles.btnOutline}>
            Convert another file
          </button>
        </div>
        <p style={{ ...styles.subText, marginTop: 20, fontSize: 12 }}>
          🔒 File will be automatically deleted from our servers in 1 hour
        </p>
      </div>
    );
  }

  return null;
}

const styles = {
  card: {
    background: "#141416",
    border: "1px solid #232326",
    borderRadius: 20,
    padding: "44px 40px",
    textAlign: "center",
    marginTop: 24,
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid #222",
    borderTopColor: "#F0EDE6",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto 20px",
  },
  statusText: {
    fontSize: 20,
    fontWeight: 700,
    color: "#F0EDE6",
    fontFamily: "'Syne', sans-serif",
    marginBottom: 16,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "'DM Sans', sans-serif",
    marginTop: 12,
  },
  progressTrack: {
    height: 4,
    background: "#222",
    borderRadius: 2,
    overflow: "hidden",
    maxWidth: 400,
    margin: "0 auto",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    width: "0%",
  },
  btnPrimary: {
    background: "#F0EDE6",
    color: "#0D0D0F",
    border: "none",
    borderRadius: 10,
    padding: "13px 28px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Syne', sans-serif",
    marginTop: 8,
  },
  btnOutline: {
    background: "transparent",
    color: "#F0EDE6",
    border: "1px solid #333",
    borderRadius: 10,
    padding: "12px 24px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Syne', sans-serif",
    marginTop: 8,
  },
};