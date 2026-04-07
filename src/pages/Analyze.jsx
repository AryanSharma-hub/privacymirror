import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const mono = "'Courier New', Courier, monospace";
const sans = "system-ui, -apple-system, sans-serif";

function ToggleRow({ label, sublabel, checked, onChange, danger }) {
  return (
    <div onClick={onChange} style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 16px",
      border: "1px solid",
      borderColor: checked ? (danger ? "#ff4d4d30" : "#00ffc825") : "#ffffff08",
      background: checked ? (danger ? "#ff0a0a08" : "#00ffc808") : "#ffffff03",
      borderRadius: "3px",
      cursor: "pointer",
      transition: "all 0.2s",
      userSelect: "none",
    }}>
      <div>
        <div style={{ fontSize: "15px", color: checked ? (danger ? "#ff7070" : "#00ffc8") : "#8aafc8", fontFamily: sans, fontWeight: 500 }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: "12px", color: "#3a5a72", marginTop: "2px", fontFamily: mono }}>
            {sublabel}
          </div>
        )}
      </div>
      <div style={{
        width: "36px", height: "20px",
        background: checked ? (danger ? "#cc3333" : "#00b896") : "#1a2e3e",
        borderRadius: "10px",
        position: "relative",
        transition: "background 0.2s",
        border: "1px solid",
        borderColor: checked ? (danger ? "#ff4d4d50" : "#00ffc840") : "#ffffff10",
        flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: "2px",
          left: checked ? "18px" : "2px",
          width: "14px", height: "14px",
          background: "#fff",
          borderRadius: "50%",
          transition: "left 0.2s",
        }} />
      </div>
    </div>
  );
}

export default function Analyze() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [reusePassword, setReusePassword] = useState(false);
  const [publicProfile, setPublicProfile] = useState(false);
  const [publicWifi, setPublicWifi] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  let passwordScore = 0;
  if (password) {
    passwordScore += Math.min(40, password.length * 4);
    if (/[0-9]/.test(password)) passwordScore += 15;
    if (/[!@#$%^&*]/.test(password)) passwordScore += 15;
    if (/[A-Z]/.test(password)) passwordScore += 15;
    if (/[a-z]/.test(password)) passwordScore += 15;
    if (passwordScore > 100) passwordScore = 100;
  }

  const strengthLabel = passwordScore === 100 ? "VERY STRONG" : passwordScore < 40 ? "WEAK" : passwordScore < 70 ? "MODERATE" : "STRONG";
  const strengthColor = passwordScore === 100 ? "#00ffc8" : passwordScore < 40 ? "#ff4d4d" : passwordScore < 70 ? "#f5a623" : "#4ade80";

  const handleScan = async () => {
    if (!isValidEmail) { setError("Invalid email address format"); return; }
    setError("");
    setScanning(true);
    let score = 100;
    if (reusePassword) score -= 35;
    if (publicProfile) score -= 15;
    if (publicWifi) score -= 10;
    if (!twoFA) score -= 25;

    let breached = false, breachCount = 0, breachDetails = [];
    try {
      const res = await fetch("http://localhost:5000/check-breach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.breached) {
        breached = true;
        breachCount = data.count;
        breachDetails = data.details || [];
        score -= Math.min(40, 15 + breachCount * 5);
      }
    } catch (err) {
      console.log("Breach check failed", err);
    }
    if (score < 0) score = 0;

    setTimeout(() => {
      navigate("/dashboard", {
        state: { score, reusePassword, publicProfile, publicWifi, twoFA, breached, breachCount, breachDetails, password },
      });
    }, 1500);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050b14",
      color: "#e2eaf4",
      fontFamily: sans,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      position: "relative",
    }}>

      {/* Grid bg */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(0,255,200,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,200,0.025) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      {/* Back nav */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute", top: "1.5rem", left: "1.5rem",
          background: "none", border: "none", color: "#3a6a82",
          fontFamily: mono, fontSize: "13px", letterSpacing: "0.1em",
          cursor: "pointer", padding: "4px 0",
        }}
      >
        ← HOME
      </button>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem", zIndex: 1 }}>
        <div style={{ fontFamily: mono, fontSize: "13px", color: "#00ffc860", letterSpacing: "0.2em", marginBottom: "0.75rem" }}>
          THREAT ASSESSMENT MODULE
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>
          Privacy <span style={{ color: "#00ffc8" }}>Analysis</span>
        </h1>
      </div>

      {/* Card */}
      <div style={{
        background: "#080f1a",
        border: "1px solid #00ffc815",
        borderRadius: "4px",
        padding: "2rem",
        width: "100%",
        maxWidth: "500px",
        zIndex: 1,
      }}>

        {/* Email field */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontFamily: mono, fontSize: "12px", color: "#3a6a82", letterSpacing: "0.15em", marginBottom: "6px" }}>
            TARGET EMAIL ADDRESS
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontFamily: mono, fontSize: "13px", color: "#00ffc850" }}>
              &gt;
            </span>
            <input
              type="email"
              placeholder="user@domain.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "12px 12px 12px 30px",
                background: "#030810",
                border: "1px solid",
                borderColor: error ? "#ff4d4d40" : isValidEmail ? "#00ffc840" : "#ffffff10",
                borderRadius: "3px",
                color: "#c8dbe8",
                fontFamily: mono,
                fontSize: "15px",
                outline: "none",
              }}
            />
          </div>
          {error && <p style={{ color: "#ff6060", fontSize: "13px", marginTop: "5px", fontFamily: mono }}>{error}</p>}
        </div>

        {/* Password toggle */}
        <button
          onClick={() => setShowPasswordInput(!showPasswordInput)}
          style={{
            background: "none", border: "none",
            color: "#00ffc870", fontFamily: mono, fontSize: "13px",
            letterSpacing: "0.1em", cursor: "pointer",
            padding: "0 0 1rem", display: "block",
          }}
        >
          {showPasswordInput ? "[ − HIDE PASSWORD ANALYSIS ]" : "[ + ANALYZE PASSWORD STRENGTH ]"}
        </button>

        {showPasswordInput && (
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontFamily: mono, fontSize: "12px", color: "#3a6a82", letterSpacing: "0.15em", marginBottom: "6px" }}>
              PASSWORD (OPTIONAL)
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "12px 40px 12px 12px",
                  background: "#030810",
                  border: "1px solid #ffffff10",
                  borderRadius: "3px",
                  color: "#c8dbe8",
                  fontFamily: mono,
                  fontSize: "15px",
                  outline: "none",
                }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#3a6a82", cursor: "pointer", fontSize: "14px",
                }}
              >
                {showPassword ? "○" : "●"}
              </button>
            </div>

            {password && (
              <div style={{ marginTop: "10px" }}>
                <div style={{ width: "100%", height: "3px", background: "#0d1e2e", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${passwordScore}%`,
                    background: strengthColor,
                    transition: "width 0.4s ease, background 0.3s",
                    borderRadius: "2px",
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                  <span style={{ fontFamily: mono, fontSize: "12px", color: strengthColor }}>{strengthLabel}</span>
                  <span style={{ fontFamily: mono, fontSize: "12px", color: "#2a4a5e" }}>{passwordScore}/100</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        <div style={{ borderTop: "1px solid #ffffff06", margin: "0.5rem 0 1.25rem", fontFamily: mono, fontSize: "10px", color: "#1e3448", paddingTop: "1rem", letterSpacing: "0.15em" }}>
          BEHAVIORAL RISK FACTORS
        </div>

        {/* Toggles */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1.75rem" }}>
          <ToggleRow
            label="I reuse passwords across websites"
            sublabel="HIGH RISK · −35 pts"
            checked={reusePassword}
            onChange={() => setReusePassword(!reusePassword)}
            danger={true}
          />
          <ToggleRow
            label="Two-Factor Authentication enabled"
            sublabel="SECURITY CONTROL · +25 pts protection"
            checked={twoFA}
            onChange={() => setTwoFA(!twoFA)}
            danger={false}
          />
          <ToggleRow
            label="My social media profiles are public"
            sublabel="MEDIUM RISK · −15 pts"
            checked={publicProfile}
            onChange={() => setPublicProfile(!publicProfile)}
            danger={true}
          />
          <ToggleRow
            label="I frequently use public WiFi"
            sublabel="LOW RISK · −10 pts"
            checked={publicWifi}
            onChange={() => setPublicWifi(!publicWifi)}
            danger={true}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleScan}
          disabled={!isValidEmail || scanning}
          style={{
            width: "100%",
            padding: "14px",
            background: isValidEmail && !scanning ? "#00ffc810" : "transparent",
            border: "1px solid",
            borderColor: isValidEmail && !scanning ? "#00ffc8" : "#1a2e3e",
            color: isValidEmail && !scanning ? "#00ffc8" : "#2a4a5e",
            fontFamily: mono,
            fontSize: "12px",
            letterSpacing: "0.2em",
            cursor: isValidEmail && !scanning ? "pointer" : "not-allowed",
            borderRadius: "3px",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => isValidEmail && !scanning && (e.currentTarget.style.background = "#00ffc820")}
          onMouseLeave={e => e.currentTarget.style.background = isValidEmail && !scanning ? "#00ffc810" : "transparent"}
        >
          {scanning ? "[ SCANNING... ]" : "[ INITIATE SCAN ]"}
        </button>
      </div>

      {/* Scanning overlay */}
      {scanning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: "1.5rem",
            fontFamily: mono,
            fontSize: "12px",
            color: "#00ffc8",
            letterSpacing: "0.15em",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            ◉ SCANNING DIGITAL FOOTPRINT...
          </motion.span>
        </motion.div>
      )}
    </div>
  );
}
