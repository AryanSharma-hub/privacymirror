import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});
app.post("/check-breach", async (req, res) => {
  const { email } = req.body;

  try {
    const response = await axios.get(
      `https://api.xposedornot.com/v1/check-email/${email}`,
      {
      headers:{
        "User-Agent":"privacymirror-app",
        "Accept":"application/json"
      }
    }
    );

    console.log("API RESPONSE:", response.data);

    const breachesRaw = response.data?.breaches || [];

    // flatten nested array
    const flatBreaches = breachesRaw.flat();

    // convert to objects
    const formattedBreaches = flatBreaches.map((name) => ({
      name,
    }));

    console.log("Formatted:", formattedBreaches);

    res.json({
      breached: flatBreaches.length > 0,
      count: flatBreaches.length,
      details: formattedBreaches,
    });

  } catch (error) {
    console.log("API ERROR:", error.message);

    res.json({
      breached: false,
      count: 0,
    });
  }
});
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});