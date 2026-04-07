import secureImg from "../assets/secure.png";
import vulnerableImg from "../assets/vulnerable.png";
import criticalImg from "../assets/critical.png";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";

const mono = "'Courier New', Courier, monospace";
const sans = "system-ui, -apple-system, sans-serif";

function RiskTag({ level }) {
  const config = {
    Low: { color: "#00ffc8", bg: "#00ffc810", border: "#00ffc830", label: "LOW RISK" },
    Medium: { color: "#f5a623", bg: "#f5a62310", border: "#f5a62330", label: "MEDIUM RISK" },
    High: { color: "#ff4d4d", bg: "#ff4d4d10", border: "#ff4d4d30", label: "HIGH RISK" },
  };
  const c = config[level];
  return (
    <span style={{
      fontFamily: mono, fontSize: "13px", letterSpacing: "0.15em",
      color: c.color, background: c.bg, border: `1px solid ${c.border}`,
      padding: "4px 12px", borderRadius: "2px",
    }}>
      {c.label}
    </span>
  );
}

function InfoRow({ icon, text, color }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "12px",
      padding: "12px 0",
      borderBottom: "1px solid #ffffff06",
    }}>
      <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
      <span style={{ fontSize: "15px", color: color || "#8aafc8", fontFamily: sans, lineHeight: 1.6 }}>{text}</span>
    </div>
  );
}

// Animated score ring
function ScoreRing({ score, riskColor }) {
  const radius = 72;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      {/* Track */}
      <circle cx="90" cy="90" r={radius} fill="none" stroke="#0d1e2e" strokeWidth="10" />
      {/* Progress */}
      <motion.circle
        cx="90" cy="90" r={radius}
        fill="none" stroke={riskColor} strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
      />
      {/* Center text */}
      <text x="90" y="82" textAnchor="middle" fill={riskColor} fontSize="32" fontWeight="700" fontFamily={mono}>
        {score}
      </text>
      <text x="90" y="104" textAnchor="middle" fill="#3a6a82" fontSize="14" fontFamily={mono}>
        / 100
      </text>
    </svg>
  );
}

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const breached = location.state?.breached;
  const breachCount = location.state?.breachCount ?? 0;
  const breachDetails = location.state?.breachDetails || [];
  const finalScore = location.state?.score ?? 75;
  const reusePassword = location.state?.reusePassword;
  const publicProfile = location.state?.publicProfile;
  const publicWifi = location.state?.publicWifi;
  const twoFA = location.state?.twoFA;
  const password = location.state?.password;

  const [score, setScore] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      setScore(start);
      start += 1;
      if (start > finalScore) clearInterval(interval);
    }, 15);
  }, [finalScore]);

  let riskLevel = "Low";
  let riskColor = "#00ffc8";
  let badgeImage = secureImg;

  if (score < 70) { riskLevel = "Medium"; riskColor = "#f5a623"; badgeImage = vulnerableImg; }
  if (score < 40) { riskLevel = "High"; riskColor = "#ff4d4d"; badgeImage = criticalImg; }

  const handleDownload = () => {
    let detectedRisks = "";
    let recommendations = "";
    if (reusePassword) { detectedRisks += " - Password reuse detected\n"; recommendations += " - Use unique passwords for every account.\n"; }
    if (publicProfile) { detectedRisks += " - Public profile exposure\n"; recommendations += " - Restrict public visibility of social accounts.\n"; }
    if (publicWifi) { detectedRisks += " - Public WiFi usage risk\n"; recommendations += " - Avoid sensitive logins over public WiFi.\n"; }
    if (!twoFA) { detectedRisks += " - Two-Factor Authentication not enabled\n"; recommendations += " - Enable 2FA for all important accounts.\n"; }
    if (breached) { detectedRisks += " - Email found in known data breaches\n"; recommendations += " - Change compromised passwords immediately.\n - Enable 2FA.\n"; }
    if (!reusePassword && !publicProfile && !publicWifi && !breached && twoFA) {
      detectedRisks = " No major risks detected.\n";
      recommendations = " Maintain strong digital hygiene and continue safe practices.\n";
    }
    const report = `PrivacyMirror Security Report\n-----------------------------------\nPrivacy Score: ${score}/100\nRisk Level: ${riskLevel}\n\nDetected Risk Factors:\n${detectedRisks}\nRecommendations:\n${recommendations}`;
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "privacy-report.txt"; link.click();
    URL.revokeObjectURL(url);
  };

  const data = [
    { subject: "Password Risk", value: reusePassword ? 80 : 0 },
    { subject: "Public Exposure", value: publicProfile ? 70 : 0 },
    { subject: "WiFi Risk", value: publicWifi ? 60 : 0 },
    { subject: "Breach Exposure", value: breached ? 90 : 0 },
    { subject: "No 2FA", value: !twoFA ? 80 : 0 },
  ];

  const Card = ({ children, style = {} }) => (
    <div style={{
      background: "#080f1a",
      border: "1px solid #00ffc812",
      borderRadius: "4px",
      padding: "1.5rem",
      marginBottom: "1rem",
      ...style,
    }}>
      {children}
    </div>
  );

  const SectionLabel = ({ children }) => (
    <div style={{ fontFamily: mono, fontSize: "13px", color: "#2a5a72", letterSpacing: "0.2em", marginBottom: "1rem" }}>
      {children}
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050b14",
      color: "#e2eaf4",
      fontFamily: sans,
      padding: "2rem 1.5rem",
      position: "relative",
    }}>

      {/* Grid bg */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `linear-gradient(rgba(0,255,200,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,200,0.02) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <div style={{ maxWidth: "720px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <button
            onClick={() => navigate("/analyze")}
            style={{
              background: "none", border: "1px solid #ffffff10",
              color: "#3a6a82", fontFamily: mono, fontSize: "13px",
              letterSpacing: "0.1em", cursor: "pointer",
              padding: "6px 14px", borderRadius: "2px",
            }}
          >
            ← BACK
          </button>
          <div style={{ fontFamily: mono, fontSize: "13px", color: "#1e3a52", letterSpacing: "0.15em" }}>
            PRIVACYMIRROR · REPORT
          </div>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: mono, fontSize: "13px", color: "#00ffc860", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
            PRIVACY EXPOSURE DASHBOARD
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>
            Threat <span style={{ color: "#00ffc8" }}>Report</span>
          </h1>
        </div>

        {/* Score Card */}
        <Card>
          <SectionLabel>PRIVACY SCORE</SectionLabel>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ flexShrink: 0 }}>
              <ScoreRing score={score} riskColor={riskColor} />
            </div>
            <div style={{ flex: 1, minWidth: "180px" }}>
              <img src={badgeImage} alt="Risk Badge" style={{ width: "56px", height: "56px", marginBottom: "1rem", display: "block" }} />
              <div style={{ marginBottom: "0.75rem" }}>
                <RiskTag level={riskLevel} />
              </div>
              {breached ? (
                <div style={{ marginTop: "0.5rem" }}>
                  <div style={{ fontSize: "14px", color: "#ff6060", fontFamily: mono, letterSpacing: "0.05em" }}>
                    ⚠ EMAIL FOUND IN {breachCount} BREACH{breachCount !== 1 ? "ES" : ""}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: "14px", color: "#00ffc870", fontFamily: mono }}>
                  ✓ NO BREACH EXPOSURE
                </div>
              )}
            </div>
          </div>

          {/* Score breakdown toggle */}
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            style={{
              marginTop: "1.25rem",
              background: "none", border: "none",
              color: "#3a6a82", fontFamily: mono, fontSize: "13px",
              letterSpacing: "0.1em", cursor: "pointer", padding: "0",
            }}
          >
            {showBreakdown ? "[ − HIDE BREAKDOWN ]" : "[ + HOW IS THIS CALCULATED? ]"}
          </button>

          {showBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              style={{ marginTop: "1rem", overflow: "hidden" }}
            >
              <div style={{ borderTop: "1px solid #ffffff06", paddingTop: "1rem" }}>
                {reusePassword && <InfoRow icon="🔐" text="Password reuse: −35 pts — Reusing passwords enables credential stuffing attacks across multiple accounts." color="#ff7070" />}
                {publicProfile && <InfoRow icon="🌐" text="Public profile: −15 pts — Public social media exposes personal data to social engineering." color="#f5a623" />}
                {publicWifi && <InfoRow icon="📡" text="Public WiFi: −10 pts — Unsecured networks risk data interception via MITM attacks." color="#f5a623" />}
                {!twoFA && <InfoRow icon="🔓" text="No 2FA: −25 pts — Without two-factor auth, accounts are significantly easier to compromise." color="#ff7070" />}
                {breached && <InfoRow icon="🚨" text={`Data breach: −${Math.min(40, 15 + breachCount * 5)} pts — Email appears in known breach databases, increasing attack likelihood.`} color="#ff4d4d" />}
                {!reusePassword && !publicProfile && !publicWifi && twoFA && !breached && (
                  <InfoRow icon="✓" text="No major risk factors detected. Score reflects clean security posture." color="#00ffc8" />
                )}
                <div style={{ fontFamily: mono, fontSize: "13px", color: "#2a4a5e", marginTop: "0.75rem" }}>
                  FINAL SCORE: {score}/100
                </div>
              </div>
            </motion.div>
          )}
        </Card>

        {/* Radar Chart */}
        <Card>
          <SectionLabel>ATTACK SURFACE RADAR</SectionLabel>
          <div style={{ width: "100%", height: "320px" }}>
            <ResponsiveContainer>
              <RadarChart data={data}>
                <PolarGrid stroke="#0d1e2e" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#3a6a82", fontSize: 13, fontFamily: mono }}
                />
                <Radar
                  name="Risk"
                  dataKey="value"
                  stroke="#00ffc8"
                  fill="#00ffc8"
                  fillOpacity={0.15}
                  strokeWidth={1.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Risk Summary */}
        <Card>
          <SectionLabel>RISK ANALYSIS SUMMARY</SectionLabel>
          <div>
            {reusePassword && <InfoRow icon="🔐" text="Password reuse increases credential stuffing vulnerability across all shared accounts." color="#ff7070" />}
            {publicProfile && <InfoRow icon="🌐" text="Public profiles increase exposure to social engineering and targeted phishing attacks." color="#f5a623" />}
            {publicWifi && <InfoRow icon="📡" text="Public WiFi usage increases risk of Man-in-the-Middle (MITM) interception." color="#f5a623" />}
            {!twoFA && <InfoRow icon="🔓" text="Two-Factor Authentication is not enabled — account compromise risk is significantly elevated." color="#ff4d4d" />}
            {password && password.length < 8 && <InfoRow icon="🔑" text="Weak password detected. Increase length and add special characters, numbers, and uppercase letters." color="#ff4d4d" />}
            {breached && <InfoRow icon="🚨" text="Email detected in known data breaches. Credentials may already be compromised — change passwords immediately." color="#ff4d4d" />}
            {!reusePassword && !publicProfile && !publicWifi && !breached && twoFA && (
              <InfoRow icon="✓" text="No major exposure risks detected. Continue maintaining strong digital hygiene." color="#00ffc8" />
            )}
          </div>
        </Card>

        {/* Breach Details */}
        {breached && breachDetails.length > 0 && (
          <Card style={{ borderColor: "#ff4d4d20" }}>
            <SectionLabel>BREACH SOURCES</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {breachDetails.map((b, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "8px 12px",
                  background: "#ff0a0a06",
                  border: "1px solid #ff4d4d15",
                  borderRadius: "2px",
                }}>
                  <span style={{ color: "#ff4d4d", fontFamily: mono, fontSize: "13px" }}>◆</span>
                  <span style={{ fontFamily: sans, fontSize: "15px", color: "#c89898" }}>{b.name}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Download */}
        <div style={{ textAlign: "center", marginTop: "1.5rem", paddingBottom: "2rem" }}>
          <button
            onClick={handleDownload}
            style={{
              padding: "13px 36px",
              background: "#00ffc810",
              border: "1px solid #00ffc8",
              color: "#00ffc8",
              fontFamily: mono,
              fontSize: "13px",
              letterSpacing: "0.18em",
              cursor: "pointer",
              borderRadius: "2px",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#00ffc820"}
            onMouseLeave={e => e.currentTarget.style.background = "#00ffc810"}
          >
            [ DOWNLOAD SECURITY REPORT ]
          </button>
        </div>
      </div>
    </div>
  );
}
