# 👑 Conversa AI - Platform Administrator Dashboard

This is the system operator dashboard designed for platform administrators to monitor global system health, track total requests, visualize calculated platform revenue, manage active customer support agents, review service distribution, and configure global system dependencies.

Built with **Next.js 14** (App Router), **Tailwind CSS**, and **Recharts**.

---

## 📁 Folder Structure & Views

All routes are hosted under the `src/app/` layout:

```text
src/
├── components/
│   └── Sidebar.tsx              # Admin sidebar including system management links
├── lib/
│   └── api.ts                   # Token-authenticated API client helper (apiRequest)
└── app/
    ├── layout.tsx               # Root styling, font overrides, and globally loaded styles
    ├── globals.css              # Custom admin-themed colors, glassmorphism templates, blurs
    ├── page.tsx                 # Entry page redirecting to login or dashboard
    ├── login/                   # Secure administrator credentials portal (admin@conversa.ai)
    ├── dashboard/               # Operational overview charts, total revenue estimation, active agents
    ├── agents/                  # Global system-wide agent database lookup
    ├── analytics/               # System service logs and volume statistics
    ├── api-keys/                # Review global system integrations
    ├── playground/              # Operator sandbox to execute system test cases
    ├── docs/                    # Operator handbook and database schema manuals
    ├── voice-lab/               # Review active synthesizers (Amy, Marcus, Sophia)
    └── settings/                # Database migrations, webhook logs, and service health checks
```

---

## 📊 Operator Dashboards & Metric Calculations

The primary view (`src/app/dashboard/page.tsx`) requests the `/admin/overview` endpoint which queries global tables across all tenants:
*   **Total Messages**: Grouped sum of all text-based inputs.
*   **Voice Minutes**: Derived from the summation of voice minutes and deep speech-to-text (STT) seconds:
    $$\text{Total Voice Minutes} = \text{voice\_minutes} + \frac{\text{stt\_seconds}}{60}$$
*   **Calculated Revenue**: Calculated dynamically using standard pricing coefficients:
    $$\text{Estimated Revenue} = (\text{Total Messages} \times \$0.002) + (\text{Voice Minutes} \times \$0.05) + (\text{TTS Characters} \times \$0.00003)$$
*   **Service Distribution**: Renders a percentage graph dividing the total workload between text messages, synthesized voice characters (TTS), and voice call minutes (STT).
*   **Active Agent Listing**: Displays the active agents currently active across all business tenants, showing names, industries, and calls completed today.

---

## ⚡ Running Locally

### Prerequisites
*   Node.js v18 or newer
*   Running backend instance at `http://localhost:3001`
*   Database seeded with administrator credentials (run `npx prisma db seed` on backend first)

### Steps
1.  Navigate to the directory:
    ```bash
    cd admin_dashboard
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Configure variables:
    Create a `.env.local` file:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
    ```
4.  Start Next.js dev server:
    ```bash
    npm run dev
    ```
    The application will run at **`http://localhost:3002`**.
5.  Log in using the seeded credentials:
    *   **Email**: `admin@conversa.ai`
    *   **Password**: `admin_password`
