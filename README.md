# NMPB Portal — Project Repository

A web portal for the **National Medicinal Plants Board (NMPB)** to centrally view, filter, and manage all sanctioned research and cultivation projects across India.

## ✨ Features

- 🗺️ **Interactive India map** with state boundaries and clickable city dots
- 🔎 **Smart filters** — year, state, category, fund range, status, plant
- 🔐 **Role-based access** — NMPB admin sees all India; State Boards see only their state
- 📊 **Analytics dashboard** with charts (year-wise, fund distribution)
- 📥 **CSV export** of filtered data
- 🌿 **Custom design** — distinctive serif/sans pairing, NMPB-themed palette

---

## 🚀 Setup (for beginners)

### Step 1 — Install Node.js (one-time)
Download the **LTS version** from https://nodejs.org and install with default settings.

Verify:
```bash
node --version
npm --version
```

### Step 2 — Install dependencies
Open a terminal **inside the project folder** and run:
```bash
npm install
```
Takes 1–3 minutes the first time.

### Step 3 — Add the India map data file ⚠️ IMPORTANT
The interactive map needs a TopoJSON file of India's state boundaries.

1. Open this URL in your browser:
   **https://raw.githubusercontent.com/udit-001/india-maps-data/main/topojson/india.json**
2. Right-click → **Save As** → save it as `india-states.json` inside the **`public/`** folder of this project.

The final path should be: `nmpb-portal/public/india-states.json`

> If the link above is unreachable, alternative sources include:
> - https://github.com/Subhash9325/GeoJson-Data-of-Indian-States
> - https://github.com/geohacker/india (use `state/india_state.geojson`)
>
> Save as `india-states.json` in the `public/` folder either way.

### Step 4 — Run the development server
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

### Step 5 — Login
Click any demo credential row to autofill, then **Sign in**:

| Role | Username | Password | Access |
|---|---|---|---|
| NMPB Admin | `admin` | `nmpb@2025` | All India |
| MP State Board | `mp_smpb` | `mp@2025` | Madhya Pradesh only |
| Kerala State Board | `kerala_smpb` | `kl@2025` | Kerala only |
| Uttarakhand State Board | `uk_smpb` | `uk@2025` | Uttarakhand only |
| Public Viewer | `public` | `public` | All India (read-only) |

---

## 🧭 How to use

- **Dashboard** — Overview map, KPI cards, year-wise & fund-distribution charts. Click any dot on the map to see all projects in that city.
- **Projects** — Sortable table with smart filters in the sidebar. Use the search bar above the table for quick text searches. Export filtered results as CSV.
- **Project detail** — Click any project row to see full details, plus related projects.
- **Analytics & Reports** — Coming next.

---

## 📁 Project structure

```
nmpb-portal/
├── public/
│   └── india-states.json      ← YOU NEED TO ADD THIS (Step 3 above)
├── src/
│   ├── data/                  → Mock database
│   ├── context/               → Auth & role-based access
│   ├── components/
│   │   ├── layout/            → Navbar, Footer
│   │   ├── dashboard/         → Map, charts, modal
│   │   ├── projects/          → Filter panel, table
│   │   ├── common/            → Search, badges, loader
│   │   └── auth/              → Protected route
│   ├── pages/                 → Page components
│   ├── utils/                 → Formatters, filters, exports
│   ├── hooks/                 → useFilters
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🛠️ Tech stack

- **React 18** + **Vite** — fast dev server
- **Tailwind CSS** — styling
- **React Router** — page navigation
- **Recharts** — charts
- **react-simple-maps** — interactive India map
- **Lucide React** — icons
- **PapaParse** — CSV export

---

## 🚢 Building for production
```bash
npm run build
```
Output goes to `dist/` — deploy to Netlify, Vercel, or any static host.

---

## ⚠️ Production checklist

This is a **frontend-only demo**. For real deployment:
- [ ] Replace mock data with a real backend (Node.js/Django/etc.)
- [ ] Use proper authentication (JWT, OAuth) — never store passwords in plain text
- [ ] Add HTTPS, rate limiting, audit logs
- [ ] Add server-side filtering for large datasets
- [ ] Configure CORS, CSP headers