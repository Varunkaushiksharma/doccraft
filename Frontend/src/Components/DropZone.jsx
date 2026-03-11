import { useRef, useState } from "react";

export default function DropZone({ tool, files, onAdd, onRemove }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length) onAdd(dropped);
  };

  const handleInput = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length) onAdd(selected);
    e.target.value = "";
  };

  const hasFiles = files.length > 0;

  return (
    <div>
      <div
        style={{
          ...styles.zone,
          borderColor: dragOver ? "#4F8EF7" : hasFiles ? "#2e2e3a" : "#2e2e33",
          background: dragOver
            ? "rgba(79,142,247,0.04)"
            : hasFiles
            ? "#0f0f12"
            : "#111114",
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !hasFiles && inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={tool.accept}
          multiple={tool.multi}
          style={{ display: "none" }}
          onChange={handleInput}
        />

        {!hasFiles ? (
          <div style={{ textAlign: "center" }}>
            <div style={styles.uploadIcon}>
              <span style={{ fontSize: 32 }}>☁️</span>
            </div>
            <p style={styles.uploadTitle}>
              Drop your {tool.from} {tool.multi ? "files" : "file"} here
            </p>
            <p style={styles.uploadSub}>or click to browse from your computer</p>
            <div style={{ marginTop: 20, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <span style={styles.badge}>Max 50MB</span>
              <span style={styles.badge}>{tool.accept.toUpperCase().replace(/\./g, "").replace(/,/g, " / ")}</span>
            </div>
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            {files.map((f, i) => (
              <div key={i} style={styles.fileRow}>
                <div style={styles.fileIcon}>{tool.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={styles.fileName}>{f.name}</p>
                  <p style={styles.fileSize}>{(f.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                  style={styles.removeBtn}
                >
                  ✕
                </button>
              </div>
            ))}
            {tool.multi && (
              <button
                style={styles.addMoreBtn}
                onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}
              >
                + Add more files
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  zone: {
    border: "2px dashed #2e2e33",
    borderRadius: 20,
    padding: "48px 32px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.25s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 220,
  },
  uploadIcon: {
    width: 72,
    height: 72,
    background: "#1a1a1e",
    border: "1px solid #2e2e33",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#F0EDE6",
    fontFamily: "'Syne', sans-serif",
    marginBottom: 8,
  },
  uploadSub: {
    fontSize: 14,
    color: "#666",
    fontFamily: "'DM Sans', sans-serif",
  },
  badge: {
    display: "inline-block",
    background: "#1e1e22",
    border: "1px solid #2e2e35",
    borderRadius: 100,
    padding: "4px 12px",
    fontSize: 11,
    fontFamily: "'DM Sans'",
    color: "#888",
    letterSpacing: "0.5px",
  },
  fileRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#1a1a1e",
    border: "1px solid #2e2e33",
    borderRadius: 12,
    padding: "14px 16px",
    marginBottom: 10,
    cursor: "default",
  },
  fileIcon: {
    fontSize: 24,
    width: 44,
    height: 44,
    background: "#222226",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  fileName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#F0EDE6",
    fontFamily: "'DM Sans'",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  fileSize: {
    fontSize: 12,
    color: "#666",
    fontFamily: "'DM Sans'",
    marginTop: 2,
  },
  removeBtn: {
    background: "transparent",
    border: "none",
    color: "#555",
    cursor: "pointer",
    fontSize: 14,
    padding: "4px 8px",
    borderRadius: 6,
    transition: "color 0.2s",
  },
  addMoreBtn: {
    width: "100%",
    background: "transparent",
    border: "1px dashed #2e2e33",
    color: "#666",
    borderRadius: 12,
    padding: "12px",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "'DM Sans'",
    transition: "all 0.2s",
    marginTop: 4,
  },
};