import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Analyze() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [reusePassword, setReusePassword] = useState(false);
  const [publicProfile, setPublicProfile] = useState(false);
  const [publicWifi, setPublicWifi] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleScan = async () => {
  setScanning(true);

  let score = 100;

  
  if (reusePassword) score -= 30;
  if (publicProfile) score -= 25;
  if (publicWifi) score -= 20;

  
  let breached = false;

  try {
    const res = await fetch("http://localhost:5000/check-breach", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
console.log("Frontend received:",data);
    if (data.breached) {
      breached = true;
      score -= 30;
    }

  } catch (err) {
    console.log("Breach check failed",err);
  }

  
  if (score < 0) score = 0;

  setTimeout(() => {
    navigate("/dashboard", {
      state: {
        score,
        reusePassword,
        publicProfile,
        publicWifi,
        breached,
      },
    });
  }, 1500);
};
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">

      <h1 className="text-4xl font-bold text-cyan-400 mb-8">
        Privacy Analysis
      </h1>

      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-lg shadow-lg">

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 mb-6"
        />

        <div className="space-y-3 text-gray-300">

          <label className="flex gap-3">
            <input
              type="checkbox"
              onChange={() => setReusePassword(!reusePassword)}
            />
            I reuse passwords across websites
          </label>

          <label className="flex gap-3">
            <input
              type="checkbox"
              onChange={() => setPublicProfile(!publicProfile)}
            />
            My social media profiles are public
          </label>

          <label className="flex gap-3">
            <input
              type="checkbox"
              onChange={() => setPublicWifi(!publicWifi)}
            />
            I frequently use public WiFi
          </label>

        </div>

        <button
          onClick={handleScan}
          className="mt-8 w-full py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold"
        >
          Analyze Privacy
        </button>

      </div>

      {scanning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-cyan-400 text-lg"
        >
          🔍 Scanning Digital Footprint...
        </motion.div>
      )}
    </div>
  );
}