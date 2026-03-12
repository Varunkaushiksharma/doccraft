import { useState } from "react";
import { Link } from "react-router-dom";
import { TOOLS } from "../utils/theme";

export default function ToolsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = TOOLS.filter((t) => {
    const matchSearch = t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || t.category === category;
    return matchSearch && matchCat;
  });

  const categories = ["all", ...new Set(TOOLS.map(t => t.category))];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 60px 100px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .tool-card { background: #141416; border: 1px solid #232326; border-radius: 16px; padding: 26px 22px; cursor: pointer; transition: all 0.22s; text-decoration: none; display: block; }
        .tool-card:hover { border-color: #3a3a3f; transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.5); }
        .search-input:focus { outline: none; border-color: #4F8EF7; }
        .cat-btn { background: transparent; border: 1px solid #232326; border-radius: 100px; padding: 7px 18px; font-size: 13px; cursor: pointer; font-family: 'DM Sans'; transition: all 0.2s; }
        .cat-btn.active { background: #F0EDE6; color: #0D0D0F; border-color: #F0EDE6; font-weight: 600; }
        .cat-btn:not(.active) { color: #888; }
        .cat-btn:not(.active):hover { border-color: #444; color: #F0EDE6; }
      `}</style>

      <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-1.5px", fontFamily: "'Syne'", color: "#F0EDE6", marginBottom: 8 }}>
        All Tools
      </h1>
      <p style={{ fontFamily: "'DM Sans'", color: "#555", marginBottom: 36 }}>
        {TOOLS.length} tools to convert, organize, and edit your documents.
      </p>

      {/* SEARCH + FILTER */}
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 32, flexWrap: "wrap" }}>
        <input
          className="search-input"
          type="text"
          placeholder="Search tools…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: "#141416",
            border: "1px solid #232326",
            borderRadius: 12,
            padding: "11px 18px",
            fontSize: 14,
            color: "#F0EDE6",
            fontFamily: "'DM Sans'",
            width: 280,
            transition: "border-color 0.2s",
          }}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-btn${category === cat ? " active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", color: "#444", fontFamily: "'DM Sans'" }}>
          No tools found for "{search}"
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {filtered.map((tool) => (
            <Link key={tool.id} to={`/tool/${tool.id}`} className="tool-card">
              <div style={{ position: "absolute", top: 16, right: 16, width: 8, height: 8, borderRadius: "50%", background: tool.color, opacity: 0.8 }} />
              <div style={{ fontSize: 28, marginBottom: 14, position: "relative" }}>
                {tool.icon}
                <span style={{ fontSize: 14, margin: "0 4px", color: "#444" }}>→</span>
                {tool.iconTo}
              </div>
              <p style={{ fontWeight: 700, fontSize: 15, color: "#F0EDE6", fontFamily: "'Syne'", marginBottom: 6 }}>{tool.label}</p>
              <p style={{ fontSize: 13, color: "#666", fontFamily: "'DM Sans'", lineHeight: 1.6 }}>{tool.desc}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}