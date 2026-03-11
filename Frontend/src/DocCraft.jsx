import { useState, useRef } from "react";

const tools = [
  { id: "pdf-to-word", icon: "📄➜📝", label: "PDF to Word", from: "PDF", to: "DOCX", color: "#4F8EF7" },
  { id: "word-to-pdf", icon: "📝➜📄", label: "Word to PDF", from: "DOCX", to: "PDF", color: "#E85D4A" },
  { id: "pdf-to-jpg", icon: "📄➜🖼️", label: "PDF to JPG", from: "PDF", to: "JPG", color: "#F7A94F" },
  { id: "jpg-to-pdf", icon: "🖼️➜📄", label: "JPG to PDF", from: "JPG", to: "PDF", color: "#5BBF7A" },
  { id: "merge-pdf", icon: "🔗", label: "Merge PDF", from: "PDFs", to: "PDF", color: "#A14FF7" },
  { id: "split-pdf", icon: "✂️", label: "Split PDF", from: "PDF", to: "PDFs", color: "#F74FAB" },
  { id: "compress-pdf", icon: "🗜️", label: "Compress PDF", from: "PDF", to: "PDF", color: "#4FC8F7" },
  { id: "pdf-to-excel", icon: "📄➜📊", label: "PDF to Excel", from: "PDF", to: "XLSX", color: "#5BBF7A" },
];

const steps = [
  { num: "01", title: "Upload", desc: "Drag & drop or browse your files. We support PDF, DOCX, JPG, PNG, and more." },
  { num: "02", title: "Convert", desc: "Our engine processes your file instantly with high fidelity and accuracy." },
  { num: "03", title: "Download", desc: "Your converted file is ready. Download it or save to cloud storage." },
];

export default function DocCraft() {
  const [activeTool, setActiveTool] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [done, setDone] = useState(false);
  const [page, setPage] = useState("home");
  const fileRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); setDone(false); }
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setDone(false); }
  };

  const handleConvert = () => {
    if (!file) return;
    setConverting(true);
    setTimeout(() => { setConverting(false); setDone(true); }, 2200);
  };

  const openTool = (tool) => {
    setActiveTool(tool);
    setFile(null);
    setDone(false);
    setConverting(false);
    setPage("tool");
  };

  return (
    <div style={{ fontFamily: "'Syne', 'Clash Display', sans-serif", minHeight: "100vh", background: "#0D0D0F", color: "#F0EDE6" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0D0D0F; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        .nav-link { color: #999; font-size: 14px; cursor: pointer; transition: color 0.2s; font-family: 'DM Sans', sans-serif; }
        .nav-link:hover { color: #F0EDE6; }
        .tool-card { background: #141416; border: 1px solid #232326; border-radius: 16px; padding: 28px 24px; cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden; }
        .tool-card::before { content: ''; position: absolute; inset: 0; opacity: 0; transition: opacity 0.25s; }
        .tool-card:hover { border-color: #3a3a3f; transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.5); }
        .tool-card:hover::before { opacity: 1; }
        .btn-primary { background: #F0EDE6; color: #0D0D0F; border: none; border-radius: 10px; padding: 14px 32px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Syne', sans-serif; letter-spacing: 0.3px; transition: all 0.2s; }
        .btn-primary:hover { background: #fff; transform: scale(1.02); }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .btn-outline { background: transparent; color: #F0EDE6; border: 1px solid #333; border-radius: 10px; padding: 12px 28px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Syne', sans-serif; transition: all 0.2s; }
        .btn-outline:hover { border-color: #666; background: #1a1a1d; }
        .drop-zone { border: 2px dashed #2e2e33; border-radius: 20px; padding: 60px 40px; text-align: center; cursor: pointer; transition: all 0.25s; background: #111114; }
        .drop-zone.over { border-color: #4F8EF7; background: rgba(79,142,247,0.05); }
        .drop-zone:hover { border-color: #444; background: #131316; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{ transform: scale(1); } 50%{ transform: scale(1.05); } }
        .animate-fade-up { animation: fadeUp 0.5s ease forwards; }
        .spinner { width: 36px; height: 36px; border: 3px solid #222; border-top-color: #F0EDE6; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
        .badge { display: inline-block; background: #1e1e22; border: 1px solid #2e2e35; border-radius: 100px; padding: 5px 14px; font-size: 12px; font-family: 'DM Sans'; color: #aaa; letter-spacing: 0.5px; }
        .grid-tools { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .stat-box { background: #141416; border: 1px solid #232326; border-radius: 14px; padding: 24px; }
        .progress-bar { height: 3px; background: #222; border-radius: 2px; overflow: hidden; margin-top: 8px; }
        .progress-fill { height: 100%; border-radius: 2px; animation: progress 2.2s ease forwards; }
        @keyframes progress { from { width: 0%; } to { width: 100%; } }
        .step-line { width: 1px; height: 40px; background: linear-gradient(to bottom, #333, transparent); margin: 0 auto; }
      `}</style>

      {/* NAV */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 60px", borderBottom: "1px solid #191919", position: "sticky", top: 0, background: "rgba(13,13,15,0.92)", backdropFilter: "blur(16px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("home")}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#4F8EF7,#A14FF7)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" }}>DocCraft</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Tools", "Features", "Pricing", "API"].map(l => <span key={l} className="nav-link">{l}</span>)}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-outline" style={{ padding: "9px 20px", fontSize: 13 }}>Sign in</button>
          <button className="btn-primary" style={{ padding: "9px 20px", fontSize: 13 }}>Get Started Free</button>
        </div>
      </nav>

      {page === "home" ? (
        <div>
          {/* HERO */}
          <section style={{ textAlign: "center", padding: "100px 60px 80px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse at center, rgba(79,142,247,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
            <span className="badge" style={{ marginBottom: 24, display: "inline-block" }}>✦ Free Document Converter</span>
            <h1 style={{ fontSize: "clamp(42px, 6vw, 80px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 24, maxWidth: 800, margin: "0 auto 24px" }}>
              Convert documents<br />
              <span style={{ background: "linear-gradient(135deg, #4F8EF7, #A14FF7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>without the hassle.</span>
            </h1>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 18, color: "#888", maxWidth: 520, margin: "0 auto 44px", lineHeight: 1.7 }}>
              PDF, DOCX, JPG — convert, compress, merge & split files in seconds. No installs. No sign-up required.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => openTool(tools[0])}>Try PDF to Word →</button>
              <button className="btn-outline">See all tools</button>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 64, flexWrap: "wrap" }}>
              {[["50M+","Files Converted"], ["4.9★","User Rating"], ["128-bit","Encryption"], ["99.9%","Uptime"]].map(([v, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px" }}>{v}</div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#666", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </section>

          {/* TOOLS GRID */}
          <section style={{ padding: "0 60px 100px", maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px" }}>All tools</h2>
              <p style={{ fontFamily: "'DM Sans'", color: "#666", marginTop: 8 }}>Everything you need to work with documents.</p>
            </div>
            <div className="grid-tools">
              {tools.map(tool => (
                <div key={tool.id} className="tool-card" onClick={() => openTool(tool)}>
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{tool.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{tool.label}</div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#666" }}>{tool.from} → {tool.to}</div>
                  <div style={{ position: "absolute", top: 16, right: 16, width: 8, height: 8, borderRadius: "50%", background: tool.color, opacity: 0.7 }} />
                </div>
              ))}
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section style={{ padding: "80px 60px", background: "#0a0a0c", borderTop: "1px solid #191919", borderBottom: "1px solid #191919" }}>
            <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
              <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px", marginBottom: 60 }}>How it works</h2>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                {steps.map((s, i) => (
                  <div key={s.num}>
                    <div style={{ display: "flex", gap: 24, alignItems: "flex-start", textAlign: "left", padding: "4px 0" }}>
                      <div style={{ fontFamily: "monospace", fontSize: 12, color: "#444", minWidth: 28, paddingTop: 4 }}>{s.num}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{s.title}</div>
                        <div style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#666", lineHeight: 1.7 }}>{s.desc}</div>
                      </div>
                    </div>
                    {i < steps.length - 1 && <div className="step-line" style={{ marginLeft: 14 }} />}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer style={{ padding: "40px 60px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #191919" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 26, height: 26, background: "linear-gradient(135deg,#4F8EF7,#A14FF7)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>⚡</div>
              <span style={{ fontWeight: 700, fontSize: 15 }}>DocCraft</span>
            </div>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#555" }}>© 2026 DocCraft. Built with React + Spring Boot.</p>
          </footer>
        </div>
      ) : (
        // TOOL PAGE
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px", animation: "fadeUp 0.4s ease" }} className="animate-fade-up">
          <button className="btn-outline" style={{ marginBottom: 32, fontSize: 13, padding: "8px 18px" }} onClick={() => setPage("home")}>← Back</button>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 36 }}>{activeTool?.icon}</div>
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-1px" }}>{activeTool?.label}</h2>
              <p style={{ fontFamily: "'DM Sans'", color: "#666", fontSize: 14 }}>Convert {activeTool?.from} → {activeTool?.to} instantly</p>
            </div>
          </div>

          {!done ? (
            <>
              <div
                className={`drop-zone${dragOver ? " over" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current.click()}
                style={{ marginTop: 32 }}
              >
                <input ref={fileRef} type="file" style={{ display: "none" }} onChange={handleFile} />
                {file ? (
                  <div>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📎</div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{file.name}</div>
                    <div style={{ fontFamily: "'DM Sans'", color: "#666", fontSize: 13, marginTop: 6 }}>
                      {(file.size / 1024).toFixed(1)} KB · Click to change
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
                    <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Drop your {activeTool?.from} here</div>
                    <div style={{ fontFamily: "'DM Sans'", color: "#666", fontSize: 14 }}>or click to browse files</div>
                    <div style={{ marginTop: 20 }}>
                      <span className="badge">Max 50MB</span>
                    </div>
                  </div>
                )}
              </div>

              {converting && (
                <div style={{ marginTop: 32, background: "#141416", border: "1px solid #232326", borderRadius: 14, padding: 28, textAlign: "center" }}>
                  <div className="spinner" />
                  <div style={{ fontFamily: "'DM Sans'", color: "#888", fontSize: 14, marginTop: 16 }}>Converting your file…</div>
                  <div className="progress-bar" style={{ marginTop: 20 }}>
                    <div className="progress-fill" style={{ background: `linear-gradient(90deg, ${activeTool?.color}, #A14FF7)` }} />
                  </div>
                </div>
              )}

              {!converting && (
                <button className="btn-primary" onClick={handleConvert} disabled={!file} style={{ width: "100%", marginTop: 24, padding: 16, fontSize: 16 }}>
                  Convert to {activeTool?.to} →
                </button>
              )}
            </>
          ) : (
            <div style={{ marginTop: 32, background: "#0e1a12", border: "1px solid #1f3627", borderRadius: 20, padding: 48, textAlign: "center" }} className="animate-fade-up">
              <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Conversion complete!</h3>
              <p style={{ fontFamily: "'DM Sans'", color: "#666", fontSize: 14, marginBottom: 32 }}>
                Your {activeTool?.to} file is ready to download.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn-primary" style={{ background: "#5BBF7A", color: "#0D0D0F" }}>
                  ⬇ Download {activeTool?.to}
                </button>
                <button className="btn-outline" onClick={() => { setFile(null); setDone(false); }}>
                  Convert another
                </button>
              </div>
            </div>
          )}

          {/* SECURITY NOTE */}
          <div style={{ marginTop: 32, display: "flex", gap: 24, flexWrap: "wrap" }}>
            {["🔒 Files auto-deleted after 1hr", "🛡️ 128-bit SSL encryption", "🚫 Never shared with third parties"].map(t => (
              <div key={t} style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#555" }}>{t}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
