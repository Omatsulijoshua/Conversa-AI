# 💻 Conversa AI - Developer Portal Frontend

This is the multi-tenant client-facing web application where businesses sign up, configure voice/chat agents, train them with custom documentation, manage BYOK encryption keys, test profiles in a live sandbox, and generate API keys.

Built with **Next.js 14** (App Router), **Tailwind CSS**, **Lucide Icons**, and **Recharts**.

---

## 📁 Folder Structure & Main Views

All key routes and layouts are located in the `src/app/` directory:

```text
src/
├── components/
│   └── Sidebar.tsx              # Left navigation bar with adaptive states
├── lib/
│   └── api.ts                   # Token-authenticated fetch helper wrapper (apiRequest)
└── app/
    ├── layout.tsx               # Root layout setting typography (Inter) and global CSS
    ├── globals.css              # Custom scrollbars, glassmorphism card styling, animations
    ├── page.tsx                 # SaaS Landing Page with hero section and feature grids
    ├── (auth)/                  # Shared login/signup auth templates
    │   ├── login/               # Tenant user password credentials login
    │   └── signup/              # New business registrations
    ├── (dashboard)/             # Authenticated workspace layout
    │   ├── dashboard/           # Developer main charts, API volume stats, and quick links
    │   ├── agents/              # Agent builder, RAG uploader, and Business Rules Modals
    │   ├── voice-lab/           # Voice Cloning Studio (record mic or upload audio samples)
    │   ├── api-keys/            # Platform Access Token generation & revoke dashboard
    │   ├── playground/          # Live agent interactive simulator & demo bootstrap
    │   ├── analytics/           # Deep usage analytics over past days
    │   └── settings/            # API Key Manager (BYOK) & Billing preferences
    ├── auth/callback/           # Social authentication (Google OAuth) redirects handler
    └── chat/                    # Fullscreen client chat simulator frame
```

---

## 🎨 Design System & Visual Highlights

Conversa AI utilizes a premium, dark-themed visual design tailored for developers:
*   **Typography**: Outfitted with professional font styling (Inter/Vercel Geist style).
*   **Glassmorphism**: Visual cards and panels leverage semi-transparent background blurs (`backdrop-blur-md`), dark border accents (`border-white/10`), and deep background colors (`bg-slate-950/50`).
*   **Micro-animations**: Subtle transitions on button hovering, form focused states, and modal load fade-ins to guarantee high-fidelity interactions.
*   **Data Visualizations**: Responsive Area and Bar charts utilizing **Recharts** to display daily message requests, latency variations, and system performance.

---

## ⚙️ Key Component Behaviors

### 1. `apiRequest` Helper (`src/lib/api.ts`)
A central API communication utility that:
*   Automatically reads the tenant token `conversa_token` from `localStorage`.
*   Appends authorization headers (`Authorization: Bearer <token>`).
*   Resolves relative paths to the server endpoint (`NEXT_PUBLIC_API_URL`).
*   Handles logout redirections when authentication errors occur.

### 2. Business Rules Modal (`src/app/(dashboard)/agents/page.tsx`)
Allows businesses to design the agent prompt in two ways:
*   **Basic Mode**: Form inputs (Tone, goals, business hours, refund policy, handoff rules, forbidden phrases) which automatically compile into a formatted markdown prompt structure.
*   **Developer Mode**: A direct markdown editor for editing full raw prompts and developer settings.

### 3. Voice Lab Recording (`src/app/(dashboard)/voice-lab/page.tsx`)
Uses the browser's standard **MediaRecorder API** to capture voice samples directly from the microphone:
*   Encodes recorded chunks into a `.webm` audio stream.
*   Dispatches it as `multipart/form-data` to the NestJS API cloning route.
*   Visualizes real-time recording timer states.

---

## ⚡ Running Locally

### Prerequisites
*   Node.js v18 or newer
*   Running backend instance at `http://localhost:3001`

### Steps
1.  Navigate to the directory:
    ```bash
    cd client_frontend
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Configure variables:
    Create a `.env.local` file (or let it fallback to default):
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
    ```
4.  Start Next.js in development mode:
    ```bash
    npm run dev
    ```
    The application will run at **`http://localhost:3000`**.
