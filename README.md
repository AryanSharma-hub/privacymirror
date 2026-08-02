# PrivacyMirror

**Expose your digital shadow.** PrivacyMirror is a full-stack privacy exposure analyzer that scans an email address against known data breaches, evaluates password strength and common risk behaviors, and generates an animated, visual privacy risk report — all in a dark, terminal-inspired UI.

---

## 1. Overview

PrivacyMirror asks a few simple questions — your email, password (checked locally, never transmitted), and a handful of yes/no security habits — and turns them into a single, easy-to-read **Privacy Score** out of 100, backed by a real breach-database lookup.

**Live analysis includes:**
- 🔓 **Breach Detection** — checks your email against the [XposedOrNot](https://xposedornot.com) breach database via a backend API call
- 🔑 **Password Strength Scoring** — real-time strength meter based on length, casing, digits, and special characters
- ⚠️ **Risk Factor Assessment** — flags password reuse, public social profiles, use of public Wi-Fi, and disabled two-factor authentication
- 📊 **Visual Threat Report** — an animated circular score ring plus a radar chart breaking down risk across categories
- 📄 **Downloadable Report** — generates a plain-text security summary with detected risks and recommendations

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, React Router 7 |
| Styling / Animation | Tailwind CSS, Framer Motion |
| Data Visualization | Recharts (radar chart, animated score ring) |
| Icons | Lucide React |
| Backend | Node.js, Express |
| HTTP Client | Axios |
| Breach Data Source | [XposedOrNot Breach API](https://xposedornot.com) |

> Note: this project uses a JavaScript/React stack end-to-end (not Python/Streamlit).

---

## 3. How It Works

1. **Home** — landing page introducing the tool and its three core capabilities (breach detection, risk scoring, threat mapping).
2. **Analyze** — the user enters an email and optionally a password (scored locally in the browser — never sent anywhere), and toggles four risk factors:
   - Password reuse across sites
   - Public/exposed social profiles
   - Regular use of public Wi-Fi
   - Two-factor authentication disabled

   On submit, the frontend calls the backend's `/check-breach` endpoint with the email. The backend queries the XposedOrNot API and returns whether the email appears in known breaches, plus a breach count and list.

3. **Score Calculation** — a composite score starts at 100 and is reduced based on:
   - Password reuse (−35)
   - Public profile exposure (−15)
   - Public Wi-Fi usage (−10)
   - No 2FA (−25)
   - Confirmed breaches (up to −40, scaled by breach count)

4. **Dashboard** — displays the final score in an animated ring, a radar chart visualizing risk across categories, a risk level badge (Low / Medium / High), and a downloadable text report with tailored recommendations.

---

## 4. Project Structure

```
privacymirror/
  index.html
  package.json                 Frontend dependencies (React, Vite, Tailwind, Recharts...)
  vite.config.js
  tailwind.config.js
  postcss.config.js
  src/
    main.jsx                   App entry point
    App.jsx                    Route definitions (Home / Analyze / Dashboard)
    index.css                  Tailwind base styles
    pages/
      Home.jsx                 Landing page
      Analyze.jsx               Email/password input + risk toggles + scan trigger
      Dashboard.jsx              Score ring, radar chart, report generation
    assets/                     Images / badges used in the risk report
  server/
    index.js                   Express server — /check-breach endpoint (XposedOrNot integration)
    package.json                Backend dependencies (express, cors, axios, dotenv)
```

---

## 5. Installation & Running Locally

**Requirements:** Node.js 18+

### Start the frontend (React)

```bash
cd privacymirror
npm install
npm run dev
```

Open your browser at:

```
http://localhost:5173
```

### Start the backend (in a separate terminal)

```bash
cd server
npm install
node index.js
```

You should see:

```
Server running on http://localhost:5000
```

> Both the frontend and backend must be running simultaneously — the frontend calls the backend at `http://localhost:5000/check-breach`.

---

## 6. Privacy Notes

- Passwords are scored **entirely client-side** and are never transmitted to the backend or any external API.
- Only the email address is sent to the backend, which forwards it to the XposedOrNot public breach-check API to determine breach exposure.
- No user data is persisted — each scan is a stateless, in-memory analysis.

---

## 7. Future Improvements

- Persist scan history (with user consent) to track privacy posture over time
- Add breached-site detail expansion (dates, data types exposed)
- Support additional breach data sources for broader coverage
- Add a "fix it" action checklist linked to each detected risk factor

---

## 8. License

MIT — do whatever you like with this project.
