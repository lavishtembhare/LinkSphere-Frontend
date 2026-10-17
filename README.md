# 🌐 LinkSphere — Frontend Console & Telemetry Client

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**LinkSphere** is a high-throughput link management and traffic intelligence platform. This repository houses the client-side single-page application (SPA), built with **React 18**, **Vite**, **Tailwind CSS**, and **Three.js**. It features real-time click telemetry, interactive 3D WebGL visualizations, AI-assisted natural-language link discovery, and resilient session management with automated silent token renewal.

---

## ⚡ Core Feature Matrix

### 1. 🌌 3D Interactive WebGL Surface
* **Three.js Constellation Sphere:** Custom particle cloud with dynamic Delaunay-style line linking, orbital rings, and cursor-reactive parallax interpolation (`ThreeCanvas.jsx`).
* **Optimized Rendering Loop:** Runs on `requestAnimationFrame` with auto-resizing observers, zero frame drops, and clean teardown on route transitions.

### 2. 📊 Command Center & Visual Telemetry
* **Rolling Velocity Charts:** Interactive temporal analytics via Chart.js with responsive time-slice windows (**7D**, **14D**, **25D**, **30D**).
* **Plain-English AI Click Intelligence:** Directly queries LLM endpoints (`/api/urls/totalClicks/summary`) to convert raw click data into concise performance summaries.
* **Instant KPI Aggregators:** Live calculation of account-wide click totals and active link inventories.

### 3. 🔍 Smart Link Inventory & Semantic Search
* **Status Filter Tabs:** Real-time inventory partitioning across **All**, **Active**, and **Disabled** links with live badge counts.
* **Dual-Mode Search:**
  * **Fuzzy Keyword Match:** In-memory client search across vanity slugs, target URLs, and metadata titles.
  * **AI Semantic Search:** Conversational queries (e.g., *"links related to documentation"*) routed through backend LLM filters.
* **Manual Kill-Switch:** Optimistic `PATCH` toggling allowing link owners to immediately enable or disable vanity routing.

### 4. 🛡️ Abuse Interception & DDoS Shield UI
* **Suspended Route Handling:** Custom error screen (`ErrorPage.jsx`) that catches `403 Forbidden` redirects triggered by backend DDoS burst circuit breakers (> 20 requests in 30 seconds).
* **Diagnostic Audit Feed:** Displays automated AI threat assessments directly to link visitors and owners.

### 5. 🔐 Cryptographic Session & Account Security
* **Automated Silent Refresh:** Custom Axios response interceptor that halts failed `401 Unauthorized` requests, executes a mutex-locked call to `/api/auth/public/refresh`, and replays requests without user interruption.
* **Profile Management:**
  * **Username Rotation:** Immediately recalculates and bakes new JWT credentials into storage.
  * **Password-Guarded Email Changes:** Strict credential confirmation before modifying mailbox records.
  * **Account Termination:** Password-authenticated cascade purge of account data, links, telemetry, and active tokens.
* **Streamlined Password Reset:** Direct identity-verified credentials recovery via username and email confirmation.

---

## 📂 Project Structure

```text
src/
├── api/
│   └── api.js                       # Axios instance with silent refresh interceptors
├── assets/
│   └── logo.svg                     # LinkSphere vector branding
├── components/
│   ├── Dashboard/                   # Telemetry & link management deck
│   │   ├── AccountSettingsModal.jsx # Username, email & account deletion modal
│   │   ├── CreateNewShorten.jsx
│   │   ├── DashboardLayout.jsx      # Metrics overview & filter bar container
│   │   ├── Graph.jsx                # Chart.js velocity graphs
│   │   ├── ShortenItem.jsx          # Individual link card with toggle & actions
│   │   ├── ShortenPopUp.jsx         # Modal for creating shortened URLs
│   │   ├── ShortenUrlList.jsx       # Managed links list with filter tabs & search
│   │   └── UrlDetailsPopUp.jsx      # Metadata inspection popup
│   ├── AboutPage.jsx                # Platform specifications & architecture
│   ├── Card.jsx                     # Reusable feature glass card
│   ├── ErrorPage.jsx                # Security block & 404 response page
│   ├── FeaturesPage.jsx             # Technical feature comparison & benchmarks
│   ├── Footer.jsx                   # Global application footer
│   ├── ForgotPasswordModal.jsx      # Pop-up password reset dialog
│   ├── HowItWorksPage.jsx           # Pipeline dataflow & code terminals
│   ├── LandingPage.jsx              # Hero section with live typing terminal demo
│   ├── Loader.jsx                   # Full-screen telemetry bootstrap loader
│   ├── Login.jsx                    # Sign-in portal with password reveal
│   ├── NavBar.jsx                   # Navigation bar with session actions
│   ├── PrivacyPolicy.jsx
│   ├── RegisterPage.jsx             # Account creation with validation
│   ├── ShortenUrlPage.jsx           # Subdomain vanity link resolver
│   ├── TermsOfService.jsx
│   ├── TextField.jsx                # Reusable form field with show/hide password toggle
│   └── ThreeCanvas.jsx              # Three.js 3D constellation canvas component
├── contextApi/
│   └── contextApi.jsx               # Global token state, storage cleanup & logout actions
├── hooks/
│   ├── useAnimations.js             # Intersection Observer reveal hooks
│   └── useQuery.js                  # TanStack Query hooks (queries, mutations, invalidations)
├── utils/
│   └── helper.js                    # Subdomain detection & routing utilities
├── App.css
├── App.jsx                          # Application root provider
├── AppRouter.jsx                    # Route declarations & subdomain switchboard
├── index.css                        # Tailwind base styles, typography & custom keyframes
├── main.jsx                         # React DOM entrypoint
└── PrivateRoute.jsx                 # Protected route guard wrapper

---

## 🛠️ Technology Stack

| Layer | Technologies |
| --- | --- |
| **Framework & Build** | React 18, Vite 6 |
| **Styling & Layout** | Tailwind CSS v4, `@tailwindcss/vite` |
| **3D & Graphics** | Three.js (WebGL Particle Mesh & Orbit Controls) |
| **Data Fetching & Cache** | TanStack Query v5 (React Query), Axios |
| **State Management** | React Context API (`localStorage` & `sessionStorage`) |
| **Data Visualization** | Chart.js, React-Chartjs-2 |
| **Form Management** | React Hook Form |
| **UI Components & Icons** | Material UI (Modal/Tooltip), React Icons (`fi`, `rx`), React Hot Toast |

---

## 🚀 Getting Started

### Prerequisites

* **Node.js:** `v18.0.0` or higher
* **npm:** `v9.0.0` or higher (or `pnpm` / `yarn`)
* **LinkSphere Backend:** Running locally on port `8080` (or accessible remotely)

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/linksphere-frontend.git](https://github.com/your-username/linksphere-frontend.git)
cd linksphere-frontend

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# In development, leave blank to use the Vite local proxy (avoids CORS)
VITE_BACKEND_URL=

# Routing subdomain base for shortened links
VITE_REACT_SUBDOMAIN=[http://url.localhost:8080](http://url.localhost:8080)

```

> **Production Note:** When deploying to platforms like Netlify or Vercel, set:
> ```env
> VITE_BACKEND_URL=[https://api.yourdomain.com](https://api.yourdomain.com)
> VITE_REACT_SUBDOMAIN=[https://url.yourdomain.com](https://url.yourdomain.com)
> 
> ```
> 
> 

### 4. Development Proxy Setup

The local Vite dev server proxies API calls directly to Spring Boot to prevent cross-origin issues during local development. Verify `vite.config.js`:

```javascript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})

```

### 5. Launch the Development Server

```bash
npm run dev

```

Open **`http://localhost:5173`** in your browser.

---

## 🔄 Network Architecture: Silent Refresh Lifecycle

```text
[ React App (Axios) ]                   [ Spring Boot Backend ]
         |                                         |
         | --- 1. Request with Access Token -----> |
         | <--- 2. HTTP 401 Unauthorized --------- | (Access Token Expired)
         |                                         |
 [ Interceptor Triggered ]                         |
 [ Lock Mutex & Queue In-Flight Calls ]            |
         |                                         |
         | --- 3. POST /api/auth/public/refresh -> | (Auth: Bearer <RefreshToken>)
         | <--- 4. HTTP 200 { token: newJWT } ---- | (Database Rotates Token)
         |                                         |
 [ Save newJWT to LocalStorage ]                   |
 [ Release Mutex & Drain Queue ]                   |
         |                                         |
         | --- 5. Replay Failed Requests --------> | (Auth: Bearer <newJWT>)
         | <--- 6. HTTP 200 OK (Data Delivered) -- |

```

---

## 🔌 API Integration Matrix

| UI Component | Method | Endpoint | Action / Purpose |
| --- | --- | --- | --- |
| `Login.jsx` | `POST` | `/api/auth/public/login` | Authenticate and obtain initial token pair |
| `RegisterPage.jsx` | `POST` | `/api/auth/public/register` | Create account |
| `api.js` | `POST` | `/api/auth/public/refresh` | Renew expired access token |
| `NavBar.jsx` | `POST` | `/api/auth/public/logout` | Terminate database refresh token record |
| `ForgotPasswordModal.jsx` | `POST` | `/api/auth/public/forgot-password` | Reset password using username and email |
| `DashboardLayout.jsx` | `GET` | `/api/urls/totalClicks` | Fetch daily aggregate click counts |
| `DashboardLayout.jsx` | `GET` | `/api/urls/totalClicks/summary` | Fetch AI-written plain-English summary |
| `ShortenUrlList.jsx` | `GET` | `/api/urls/myurls` | Retrieve user's link library |
| `ShortenUrlList.jsx` | `GET` | `/api/urls/search` | Natural-language semantic link search |
| `ShortenPopUp.jsx` | `POST` | `/api/urls/shorten` | Generate new short URL / AI smart slug |
| `ShortenItem.jsx` | `PATCH` | `/api/urls/{slug}/status` | Toggle active/disabled routing state |
| `ShortenItem.jsx` | `DELETE` | `/api/urls/{slug}` | Delete link and purge click logs |
| `AccountSettingsModal.jsx` | `PATCH` | `/api/users/username` | Update username & rotate tokens |
| `AccountSettingsModal.jsx` | `PATCH` | `/api/users/email` | Update registered email address |
| `AccountSettingsModal.jsx` | `POST` | `/api/users/delete-account` | Cascade delete account & active session |

---

## 📦 Production Build & Testing

```bash
# Check code style & linting
npm run lint

# Generate production build
npm run build

# Preview production build locally
npm run preview

```

The production output will be generated inside the `/dist` directory, optimized for static hosting on **Netlify**, **Vercel**, or **AWS S3 / CloudFront**.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.
