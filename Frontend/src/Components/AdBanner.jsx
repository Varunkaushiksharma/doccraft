import { useEffect, useRef } from "react";

/**
 * AdBanner — reusable ad slot component
 *
 * Usage:
 *   <AdBanner slot="1234567890" format="horizontal" />
 *   <AdBanner slot="0987654321" format="rectangle" />
 *   <AdBanner slot="1122334455" format="vertical" />
 *
 * To activate real ads:
 *   1. Sign up at https://adsense.google.com
 *   2. Replace YOUR_ADSENSE_CLIENT_ID below with your ca-pub-XXXXXXXXXXXXXXXX
 *   3. Replace slot prop values with your actual ad unit slot IDs
 *   4. Uncomment the <script> tag in index.html (see comment below)
 *
 * index.html — add inside <head>:
 *   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
 */

const AD_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX"; // ← Replace with your AdSense ID

const FORMATS = {
  horizontal: { width: "100%", height: 90, label: "728×90 — Leaderboard" },
  rectangle:  { width: 300,    height: 250, label: "300×250 — Medium Rectangle" },
  vertical:   { width: 160,    height: 600, label: "160×600 — Wide Skyscraper" },
  responsive: { width: "100%", height: 100, label: "Responsive Ad" },
};

export default function AdBanner({ slot, format = "horizontal", style: extraStyle = {} }) {
  const adRef = useRef(null);
  const fmt = FORMATS[format] || FORMATS.horizontal;

  useEffect(() => {
    // Push ad to AdSense queue when component mounts
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // AdSense not loaded yet — placeholder shown instead
    }
  }, []);

  const isAdSenseReady = AD_CLIENT !== "ca-pub-XXXXXXXXXXXXXXXX";

  return (
    <div style={{ ...styles.wrapper, width: fmt.width, ...extraStyle }}>
      {isAdSenseReady ? (
        // ── Real AdSense Ad ──────────────────────────────────────────
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", width: fmt.width, height: fmt.height }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format === "responsive" ? "auto" : undefined}
          data-full-width-responsive={format === "responsive" ? "true" : undefined}
        />
      ) : (
        // ── Placeholder (shown until AdSense is configured) ──────────
        <div style={{ ...styles.placeholder, height: fmt.height, width: fmt.width }}>
          <div style={styles.placeholderInner}>
            <span style={styles.adLabel}>Advertisement</span>
            <span style={styles.adSize}>{fmt.label}</span>
            <span style={styles.adHint}>Configure AdSense in AdBanner.jsx</span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
  },
  placeholder: {
    background: "#111114",
    border: "1px dashed #2a2a2e",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  placeholderInner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  adLabel: {
    fontSize: 10,
    color: "#444",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    fontFamily: "'DM Sans', sans-serif",
  },
  adSize: {
    fontSize: 12,
    color: "#333",
    fontFamily: "monospace",
  },
  adHint: {
    fontSize: 10,
    color: "#2a2a2e",
    fontFamily: "'DM Sans', sans-serif",
    marginTop: 2,
  },
};