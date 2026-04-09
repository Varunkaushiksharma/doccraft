// src/pages/HistoryPage.jsx  — responsive version
// Changes vs original:
//   • container padding: 48px 40px → 24px 16px on mobile
//   • mainLayout: stacks vertically on mobile, sidebar hidden on mobile
//   • record-row: wraps on mobile, filename truncation preserved
//   • format badge stacks better on small screens

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { historyAPI } from "../services/api";
import AdBanner from "../components/AdBanner";
import { useBreakpoint } from "../hooks/useBreakpoint";

const STATUS_COLORS = {
  SUCCESS: { bg: "#0e1a12", border: "#1f3627", color: "#5BBF7A" },
  FAILED:  { bg: "#160e0e", border: "#3a1818", color: "#E85D4A" },
  PENDING: { bg: "#141410", border: "#2e2a18", color: "#F7A94F" },
};

export default function HistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useBreakpoint(768);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchHistory();
  }, [user, page]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await historyAPI.getAll(page, 10);
      setRecords(res.data.records);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await historyAPI.deleteById(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div style={{ background: "#0D0D0F", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .record-row { background: #141416; border: 1px solid #232326; border-radius: 14px; padding: 18px 22px; transition: border-color 0.2s; }
        .record-row:hover { border-color: #3a3a3f; }
        .del-btn:hover { color: #E85D4A !important; border-color: #E85D4A !important; }
        .page-btn { background: transparent; border: 1px solid #232326; border-radius: 8px; padding: 7px 14px; color: #888; cursor: pointer; font-family: 'DM Sans'; font-size: 13px; transition: all 0.2s; }
        .page-btn:hover:not(:disabled) { border-color: #444; color: #F0EDE6; }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .page-btn.active { background: #F0EDE6; color: #0D0D0F; border-color: #F0EDE6; font-weight: 700; }
      `}</style>

      <div style={{ ...styles.container, padding: isMobile ? "24px 16px 60px" : "48px 40px 80px" }} className="fade-up">

        {/* <div style={{ marginBottom: 32 }}>
          <AdBanner slot="1111111111" format="horizontal" />
        </div> */}

        <div style={{ ...styles.header, flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "flex-start" }}>
          <div>
            <h1 style={{ ...styles.title, fontSize: isMobile ? 24 : 32 }}>Conversion History</h1>
            <p style={styles.sub}>All your past conversions in one place.</p>
          </div>
          <Link to="/tools" style={styles.btnPrimary}>+ New Conversion</Link>
        </div>

        {/* Main layout — stacks on mobile */}
        <div style={{ ...styles.mainLayout, flexDirection: isMobile ? "column" : "row" }}>

          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div style={styles.emptyBox}>
                <div style={styles.spinner} />
                <p style={styles.emptyText}>Loading history…</p>
              </div>
            ) : records.length === 0 ? (
              <div style={styles.emptyBox}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                <p style={styles.emptyTitle}>No conversions yet</p>
                <p style={styles.emptyText}>Your conversion history will appear here.</p>
                <Link to="/tools" style={{ ...styles.btnPrimary, marginTop: 20, display: "inline-block" }}>Start Converting</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {records.map((r) => {
                  const sc = STATUS_COLORS[r.status] || STATUS_COLORS.PENDING;
                  return (
                    <div key={r.id} className="record-row">
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <div style={styles.formatBadge}>
                          <span style={{ color: "#888", fontSize: 13 }}>{r.fromFormat}</span>
                          <span style={{ color: "#333", fontSize: 12 }}>→</span>
                          <span style={{ color: "#4F8EF7", fontSize: 13, fontWeight: 700 }}>{r.toFormat}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: isMobile ? "100%" : 0 }}>
                          <p style={styles.filename}>{r.originalFilename}</p>
                          <p style={styles.meta}>{r.fileSizeKb} KB · {formatDate(r.createdAt)}</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ ...styles.statusBadge, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
                            {r.status}
                          </div>
                          <button className="del-btn" onClick={() => handleDelete(r.id)} disabled={deleting === r.id} style={styles.delBtn}>
                            {deleting === r.id ? "…" : "✕"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* {records.length >= 5 && (
                  <div style={{ margin: "8px 0" }}>
                    <AdBanner slot="2222222222" format="horizontal" />
                  </div>
                )} */}
              </div>
            )}

            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 0}>← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} className={`page-btn${page === i ? " active" : ""}`} onClick={() => setPage(i)}>{i + 1}</button>
                ))}
                <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages - 1}>Next →</button>
              </div>
            )}
          </div>

          {/* Sidebar — hidden on mobile */}
          {/* {!isMobile && (
            <div style={styles.sidebar}>
              <AdBanner slot="3333333333" format="rectangle" />
              <div style={{ marginTop: 20 }}>
                <AdBanner slot="4444444444" format="rectangle" />
              </div>
            </div>
          )} */}
        </div>

        {/* <div style={{ marginTop: 40 }}>
          <AdBanner slot="5555555555" format="horizontal" />
        </div> */}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1100, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: 32, gap: 16 },
  title: { fontWeight: 800, letterSpacing: "-1px", color: "#F0EDE6", fontFamily: "'Syne'", marginBottom: 6 },
  sub: { fontSize: 14, color: "#555", fontFamily: "'DM Sans'" },
  btnPrimary: { background: "#F0EDE6", color: "#0D0D0F", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne'", textDecoration: "none", display: "inline-block", flexShrink: 0 },
  mainLayout: { display: "flex", gap: 28, alignItems: "flex-start" },
  sidebar: { width: 300, flexShrink: 0, position: "sticky", top: 100 },
  emptyBox: { background: "#141416", border: "1px solid #232326", borderRadius: 20, padding: "60px 40px", textAlign: "center" },
  emptyTitle: { fontSize: 20, fontWeight: 700, color: "#F0EDE6", fontFamily: "'Syne'", marginBottom: 8 },
  emptyText: { fontSize: 14, color: "#555", fontFamily: "'DM Sans'" },
  spinner: { width: 36, height: 36, border: "3px solid #222", borderTopColor: "#F0EDE6", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" },
  formatBadge: { display: "flex", alignItems: "center", gap: 6, background: "#1a1a1e", border: "1px solid #2e2e33", borderRadius: 8, padding: "6px 12px", flexShrink: 0, fontFamily: "'DM Sans'" },
  filename: { fontSize: 14, fontWeight: 600, color: "#F0EDE6", fontFamily: "'DM Sans'", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  meta: { fontSize: 12, color: "#555", fontFamily: "'DM Sans'", marginTop: 3 },
  statusBadge: { fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", borderRadius: 6, padding: "4px 10px", fontFamily: "'DM Sans'", flexShrink: 0 },
  delBtn: { background: "transparent", border: "1px solid #2e2e33", color: "#555", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans'", flexShrink: 0, transition: "all 0.2s" },
  pagination: { display: "flex", gap: 8, justifyContent: "center", marginTop: 28, flexWrap: "wrap" },
};