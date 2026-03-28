import {useEffect,useState} from "react";
import { useNavigate,useLocation } from "react-router-dom";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const location = useLocation();
  const breached=location.state?.breached;
  const navigate=useNavigate();
  const finalScore = location.state?.score || 75;
  const reusePassword = location.state?.reusePassword;
const publicProfile = location.state?.publicProfile;
const publicWifi = location.state?.publicWifi;
const [score, setScore] = useState(0);

useEffect(() => {
  let start = 0;
  const interval = setInterval(() => {
    start += 1;
    setScore(start);
    if (start >= finalScore) clearInterval(interval);
  }, 15);
}, [finalScore]);

  let riskLevel = "Low";
  let riskColor = "text-green-400";

  if (score < 70) {
    riskLevel = "Medium";
    riskColor = "text-yellow-400";
  }

  if (score < 40) {
    riskLevel = "High";
    riskColor = "text-red-500";
  }
const handleDownload = () => {
  let detectedRisks = "";
  let recommendations = "";

  if (reusePassword) {
    detectedRisks += "- Password reuse detected\n";
    recommendations += "- Use unique passwords for every account.\n";
  }

  if (publicProfile) {
    detectedRisks += "- Public profile exposure\n";
    recommendations += "- Restrict public visibility of social accounts.\n";
  }

  if (publicWifi) {
    detectedRisks += "- Public WiFi usage risk\n";
    recommendations += "- Avoid sensitive logins over public WiFi.\n";
  }

  if (breached) {
    detectedRisks += "- Email found in known data breaches\n";
    recommendations += "- Change compromised passwords immediately.\n";
    recommendations += "- Enable Two-Factor Authentication (2FA).\n";
  }

  if (!reusePassword && !publicProfile && !publicWifi && !breached) {
    detectedRisks = "No major risks detected.\n";
    recommendations =
      "Maintain strong digital hygiene and continue safe practices.\n";
  }

  const report = `
PrivacyMirror Security Report
-----------------------------------
Privacy Score: ${score}/100
Risk Level: ${riskLevel}

Detected Risk Factors:
${detectedRisks}

Recommendations:
${recommendations}
`;

  const blob = new Blob([report], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "privacy-report.txt";
  link.click();

  URL.revokeObjectURL(url);
};
  const data = [
  {
    subject: "Password Risk",
    value: reusePassword ? 80 : 0,
  },
  {
    subject: "Public Exposure",
    value: publicProfile ? 70 : 0,
  },
  {
    subject: "WiFi Risk",
    value: publicWifi ? 60 : 0,
  },
  {
    subject: "Breach Exposure",
    value: breached ? 90 : 0,
  },
];
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
        <button
      onClick={() => navigate("/analyze")}
      className="mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded"
    >
      ← Back
    </button>
      <h1 className="text-4xl font-bold text-cyan-400 mb-8 text-center">
        Privacy Exposure Dashboard
      </h1>

      
      <div className="bg-gray-900 p-8 rounded-xl text-center mb-10 shadow-lg">
        <h2 className="text-6xl font-bold">{score}/100</h2>
        {breached && (
  <p className="text-red-400 mt-4 font-semibold">
    ⚠️ Email found in known data breaches
  </p>
)}
{!breached && (
  <p className="text-green-400 mt-4">
    ✅ No known breach exposure detected
  </p>
)}
        <p className={`mt-4 text-xl font-semibold ${riskColor}`}>
          Risk Level: {riskLevel}
        </p>
      </div>

      
        <div className="bg-gray-900 p-8 rounded-xl text-center mb-10 
shadow-lg shadow-cyan-500/10 border border-cyan-500/20">
        <h3 className="text-2xl mb-4 text-center text-gray-300">
          Exposure Breakdown
        </h3>

        <div className="w-full h-96">
          <ResponsiveContainer>
            <RadarChart data={data}>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis dataKey="subject" stroke="#aaa" />
              <Radar
                name="Risk"
                dataKey="value"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    
<div className="bg-gray-900 p-6 rounded-xl mt-10 shadow-lg">
  <h3 className="text-2xl mb-4 text-cyan-400">
    Risk Analysis Summary
  </h3>

  <ul className="space-y-3 text-gray-300">

    {reusePassword && (
      <li>
        🔐 Password reuse increases credential stuffing vulnerability.
      </li>
    )}

    {publicProfile && (
      <li>
        🌐 Public profiles increase exposure to social engineering attacks.
      </li>
    )}

    {publicWifi && (
      <li>
        📡 Public WiFi usage increases risk of Man-in-the-Middle attacks.
      </li>
    )}

    {breached && (
      <li className="text-red-400">
        🚨 Email detected in known data breaches. Credentials may be compromised.
      </li>
    )}

    {!reusePassword && !publicProfile && !publicWifi && !breached && (
      <li className="text-green-400">
        ✅ No major exposure risks detected.
      </li>
    )}

  </ul>
</div>
<div className="mt-8 text-center">
  <button
    onClick={handleDownload}
    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold shadow-lg shadow-cyan-500/20"
  >
    Download Security Report
  </button>
</div>
    </div>
  );
}