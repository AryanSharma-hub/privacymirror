import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
      
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-bold text-cyan-400 text-center"
      >
        PrivacyMirror
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-gray-400 text-lg text-center max-w-xl"
      >
        Visualize your digital footprint and understand your privacy exposure
        through interactive cybersecurity analytics.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/analyze")}
        className="mt-10 px-8 py-3 bg-cyan-500 hover:bg-cyan-600 transition rounded-lg text-lg font-semibold shadow-lg shadow-cyan-500/20"
      >
        Analyze My Privacy
      </motion.button>

    </div>
  );
}