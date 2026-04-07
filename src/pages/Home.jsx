import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    { icon: "⬡", label: "Breach Detection", desc: "Cross-reference against known data leaks" },
    { icon: "◈", label: "Risk Scoring", desc: "Real-time privacy exposure analysis" },
    { icon: "⬢", label: "Threat Mapping", desc: "Visual breakdown of your attack surface" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050b14",
      color: "#e2eaf4",
      fontFamily: "'Courier New', Courier, monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,200,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,200,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      {/* Top status bar */}
      <div style={{
        position: "absolute", top: "1.5rem", left: "1.5rem", right: "1.5rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: "13px", color: "#00ffc840", letterSpacing: "0.12em",
      }}>
        <span>PRIVACYMIRROR v2.0</span>
        <span style={{ color: "#00ffc8", opacity: 0.6 }}>● SYSTEM ONLINE</span>
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{ textAlign: "center", maxWidth: "640px", zIndex: 1 }}
      >

        {/* Badge */}
        <div style={{
          display: "inline-block",
          border: "1px solid #00ffc830",
          background: "#00ffc808",
          color: "#00ffc8",
          fontSize: "13px",
          letterSpacing: "0.2em",
          padding: "6px 16px",
          borderRadius: "2px",
          marginBottom: "2rem",
        }}>
          DIGITAL FOOTPRINT ANALYZER
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: "clamp(3rem, 8vw, 5.5rem)",
          fontWeight: "700",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          marginBottom: "1.5rem",
          fontFamily: "'Courier New', monospace",
          color: "#fff",
        }}>
          Privacy<span style={{ color: "#00ffc8" }}>Mirror</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: "1.125rem",
          color: "#7a9bb5",
          lineHeight: 1.7,
          maxWidth: "480px",
          margin: "0 auto 2.5rem",
          fontFamily: "system-ui, sans-serif",
        }}>
          Expose your digital shadow. Visualize breach exposure, password
          vulnerabilities, and privacy risks in one unified threat report.
        </p>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/analyze")}
          style={{
            padding: "14px 40px",
            background: "transparent",
            border: "1px solid #00ffc8",
            color: "#00ffc8",
            fontSize: "15px",
            letterSpacing: "0.15em",
            fontFamily: "'Courier New', monospace",
            cursor: "pointer",
            borderRadius: "2px",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#00ffc815";
            e.currentTarget.style.boxShadow = "0 0 24px #00ffc820";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          [ SCAN MY FOOTPRINT ]
        </motion.button>

      </motion.div>

      {/* Feature cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1px",
          maxWidth: "640px",
          width: "100%",
          marginTop: "4rem",
          border: "1px solid #00ffc815",
          background: "#00ffc815",
          zIndex: 1,
        }}
      >
        {features.map((f, i) => (
          <div key={i} style={{
            background: "#050b14",
            padding: "1.5rem",
            textAlign: "left",
          }}>
            <div style={{ fontSize: "22px", color: "#00ffc8", marginBottom: "8px" }}>{f.icon}</div>
            <div style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "0.1em", color: "#c8dbe8", marginBottom: "6px", fontFamily: "'Courier New', monospace" }}>
              {f.label.toUpperCase()}
            </div>
            <div style={{ fontSize: "14px", color: "#4a6d85", lineHeight: 1.5, fontFamily: "system-ui, sans-serif" }}>
              {f.desc}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Bottom bar */}
      <div style={{
        position: "absolute", bottom: "1.5rem",
        fontSize: "10px", color: "#1e3448", letterSpacing: "0.1em",
      }}>
        ALL ANALYSIS PERFORMED LOCALLY — NO DATA STORED
      </div>
    </div>
  );
}
