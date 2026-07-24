# 🎙️ Conversa AI

Conversa AI is an **API-first, multi-tenant Voice & Chat AI customer service platform**. It enables businesses to deploy intelligent, human-like voice and chat agents that can handle multiple simultaneous customer calls and chats, helping automate and scale customer support operations.

Featuring a **Bring Your Own Key (BYOK)** architecture, a **Neural Voice Lab** for custom voice cloning, and a seamless **Retrieval-Augmented Generation (RAG)** knowledge base ingestion pipeline, Conversa AI bridges the gap between static chatbots and natural voice conversations.

---

## 🏛️ Architecture & Platform Topology

Conversa AI is split into three main components coordinated around a central PostgreSQL database and a NestJS API Gateway:

```mermaid
graph TD
    subgraph Users
        Customer([📞 Customer Call/Chat])
    end

    subgraph Portals
        Tenant[🏢 Tenant Business Portal]
        Operator[👑 Platform Admin Portal]
    end

    subgraph API Gateway
        Nest[🟢 NestJS Backend API]
        Prisma[💎 Prisma ORM]
        DB[(🐘 PostgreSQL DB)]
    end

    subgraph AI & Speech Services
        AIService[🧠 AI Router]
        SpeechService[🔊 STT / TTS]
        VoiceService[🎙️ Voice Lab]
    end

    subgraph Cloud Providers
        OpenAI[OpenAI Whisper/TTS]
        ElevenLabs[ElevenLabs Cloning]
        LLMs[BYOK: Gemini / Anthropic / Grok / DeepSeek / Mistral]
    end

    %% Flow lines
    Customer -->|Call Audio / Chat Messages| Nest
    Tenant -->|Manage Agents, Upload Docs, Configure Keys| Nest
    Operator -->|Monitor Global Usage & Metrics| Nest

    Nest --> Prisma
    Prisma --> DB

    Nest --> AIService
    Nest --> SpeechService
    Nest --> VoiceService

    AIService -->|Decrypted Tenant Key| LLMs
    SpeechService -->|Whisper & TTS-1| OpenAI
    VoiceService -->|Voice Cloning| ElevenLabs
```

---

## ✨ Key Features

### 👤 Tenant (Business) Portal
*   **Agent Customization**: Set tone (warm, formal, energetic), industry (banking, logistics, retail), and instructions.
*   **Business Rules Modals**: Fine-tune agent behaviors in two modes:
    *   *Basic*: Set exact greetings, business hours, escalation triggers, refund policies, keywords never to say, and closing scripts.
    *   *Developer*: Directly edit full system instructions and raw JSON configuration profiles.
*   **RAG Ingestion Pipeline**: Index custom documents (FAQs, manuals, policy guides) into a database chunk mapping system with standard/vector search fallback.
*   **Neural Voice Lab**: Clones voices in real-time. Record a sample directly from the browser microphone or upload a `.webm`/`.wav` file to synthesize cloned custom voices via ElevenLabs.
*   **Playground Simulator**: Real-time interactive testing interface to simulate chat flows and bootstrap test agents instantly with a single click.
*   **System Webhooks**: Register callback URLs to receive real-time payload updates on platform actions (e.g. Call Completed).
*   **BYOK Key Vault**: Connect custom keys for OpenAI, Gemini, Grok, Anthropic, DeepSeek, Mistral, and OpenRouter, encrypted with enterprise-grade **AES-256-GCM**.

### 👑 Operator (Admin) Dashboard
*   **Platform Overview**: View global system usage, average latency, total call count, and message volume.
*   **Revenue Analytics**: Automatically estimate platform earnings in real-time based on usage tiers (per message, voice minute, and character synthesized).
*   **Distribution Metrics**: Visual charts representing service usage breakdown (Speech, Text, Voice characters).
*   **Active Agents Monitoring**: Real-time list of online custom agents and their daily call metrics.

### ⚙️ Core Backend Engine
*   **AI Service Router**: Smart fallbacks that switch to a local mock support solver when remote LLM APIs are unreachable or unpaid.
*   **Speech Processing**: Direct interface to OpenAI Whisper (`whisper-1`) for speech-to-text and OpenAI TTS (`tts-1`) for text-to-speech.
*   **Local RAG fallback**: Built-in 64-dimensional bag-of-words vectorizer and cosine similarity scorer, facilitating full vector search offline without expensive external APIs.
*   **Billing & Usage Logs**: Track specific tenant metrics (`messages`, `voice_minutes`, `stt_seconds`, `tts_chars`) for accounting and analytics.

---

## 🛠️ Tech Stack

*   **API Gateway (Backend)**: [NestJS](https://nestjs.com/) (TypeScript), [Prisma ORM](https://www.prisma.io/), [Passport](http://www.passportjs.org/) (JWT & Google OAuth2), [Swagger UI](https://swagger.io/).
*   **Developer Portal**: [Next.js 14](https://nextjs.org/) (App Router), Tailwind CSS, Lucide icons, Recharts.
*   **Admin Dashboard**: [Next.js 14](https://nextjs.org/) (App Router), Tailwind CSS, Recharts.
*   **Database**: PostgreSQL.
*   **Integrations**: OpenAI, ElevenLabs, Twilio, Stripe.

---

## 📁 Repository Directory Structure

```text
Conversa-AI/
├── docker-compose.yml           # Runs Postgres, Backend, Developer Portal & Admin Panel
├── README.md                    # Platform Overview & Setup instructions
├── backend/                     # NestJS API Gateway
│   ├── prisma/                  # Prisma Database schema and seeds
│   │   ├── schema.prisma        # Database models & relationships
│   │   └── seed.ts              # Default admin credentials seed
│   ├── src/                     # Core NestJS application
│   │   ├── admin/               # Global statistics & admin metrics
│   │   ├── agent/               # Agent configuration CRUD
│   │   ├── ai/                  # Multi-provider LLM connector
│   │   ├── ai-provider/         # BYOK encrypted key manager
│   │   ├── analytics/           # Usage statistics & charting queries
│   │   ├── api-key/             # Tenant API keys authentication
│   │   ├── auth/                # Guards & Passport strategies (JWT, Google, Tenant)
│   │   ├── billing/             # Stripe & platform usage billing
│   │   ├── conversation/        # RAG-infused chat conversation loops
│   │   ├── knowledge/           # Document parser & RAG vector ingestor
│   │   ├── speech/              # STT (Whisper) & TTS (OpenAI) controllers
│   │   ├── training/            # Quick bootstrap training service
│   │   ├── voice/               # ElevenLabs voice cloning controller
│   │   └── webhook/             # Outbound webhooks dispatching
│   ├── Dockerfile
│   └── package.json
├── client_frontend/             # Next.js Developer Portal (Tenant Facing)
│   ├── src/app/
│   │   ├── (auth)/              # Login, Signup forms
│   │   ├── (dashboard)/         # Agents, Voice Lab, Docs, Settings, Playground, Keys
│   │   └── chat/                # Live Chat testing frame
│   ├── Dockerfile
│   └── package.json
└── admin_dashboard/             # Next.js Administrator Portal (Operator Facing)
    ├── src/app/                 # Analytics, global keys, operator layout
    ├── Dockerfile
    └── package.json
```

---

## 💾 Database Schema Reference

The platform utilizes a structured relational database models built using PostgreSQL and Prisma:

| Model | Description | Key Relationships |
| :--- | :--- | :--- |
| **Tenant** | A business customer using the platform. | Has many `ApiKey`, `Agent`, `Conversation`, `Call`, `Webhook`, `AiProviderKey`. |
| **Admin** | Operators managing the platform. | None. Used to log into the Admin Dashboard. |
| **ApiKey** | Access tokens generated by tenants for API integrations. | Belongs to `Tenant`. |
| **Agent** | Custom voice/chat agents configured by a business. | Belongs to `Tenant`. Has many `Call`, `Conversation`, `KnowledgeBase`. |
| **KnowledgeBase** | Context databases uploaded by businesses. | Belongs to `Agent`, `Tenant`. Has many `DocumentChunk`. |
| **DocumentChunk** | Chunked text with embedded arrays for vector search. | Belongs to `KnowledgeBase`. |
| **Conversation** | Chat session history with customer users. | Belongs to `Agent` & `Tenant`. Stores message arrays. |
| **Call** | Voice calls routing metrics (durations, outcomes, SID). | Belongs to `Agent` & `Tenant` (Linked to Twilio Call SIDs). |
| **Usage** | Tracked resource usage logs (minutes, chars, messages). | Belongs to `Tenant`. Used for analytics & billing. |
| **AiProviderKey** | Encrypted tenant keys stored for LLMs (OpenAI, Gemini, etc.) | Belongs to `Tenant` (Unique per tenant/provider pair). |

---

## ⚡ Getting Started

The easiest way to get Conversa AI running locally is using **Docker Compose**, which starts all frontend apps, the backend API, and a PostgreSQL instance.

### Option 1: 🐳 Rapid Deployment via Docker Compose

1. **Clone and Navigate**:
   ```bash
   git clone https://github.com/Omatsulijoshua/Conversa-AI.git
   cd Conversa-AI
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root folder (or specify in your shell environment):
   ```ini
   # Database Credentials
   DB_USER=conversa_admin
   DB_PASSWORD=your_secure_password
   DB_NAME=conversa_db
   DB_PASSWORD_URL_ENCODED=your_secure_password_percent_encoded

   # Application Secrets
   JWT_SECRET=super_secret_jwt_key_change_me
   AI_KEY_ENCRYPTION_SECRET=aes_gcm_256_encryption_key_32_chars

   # Global Fallback keys (optional but recommended for sandbox/demo tests)
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxx
   ELEVENLABS_API_KEY=el-xxxxxxxxxxxxxxxx
   
   # Google OAuth Credentials (for social authentication)
   GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxx
   ```

3. **Start Services**:
   ```bash
   docker compose up -d --build
   ```

4. **Prepare Database**:
   Run Prisma migrations and seed default credentials in the backend container:
   ```bash
   docker exec -it conversa-backend npx prisma db push
   docker exec -it conversa-backend npx prisma db seed
   ```

---

### Option 2: 🛠️ Local Development Manual Setup

#### Prerequisites
*   **Node.js**: v18 or newer
*   **PostgreSQL**: Local running database

#### 1. Backend API Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment:
    Create a `.env` file inside `/backend` folder:
    ```env
    DATABASE_URL="postgresql://conversa_admin:your_secure_password@localhost:5432/conversa_db?schema=public"
    JWT_SECRET="your_jwt_secret"
    OPENAI_API_KEY="your_global_openai_key"
    ELEVENLABS_API_KEY="your_elevenlabs_key"
    ```
4.  Generate Prisma Client and push schemas:
    ```bash
    npx prisma db push
    npx prisma db seed
    ```
5.  Start the dev server:
    ```bash
    npm run start:dev
    ```
    *The API will run at `http://localhost:3001` and Swagger API docs will be active at `http://localhost:3001/docs`.*

#### 2. Client Developer Portal Setup
1.  Navigate to the frontend directory:
    ```bash
    cd ../client_frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Next.js dev server:
    ```bash
    npm run dev
    ```
    *The Client Portal will run at `http://localhost:3000`.*

#### 3. Platform Admin Dashboard Setup
1.  Navigate to the admin dashboard directory:
    ```bash
    cd ../admin_dashboard
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Next.js dev server:
    ```bash
    npm run dev
    ```
    *The Operator Dashboard will run at `http://localhost:3002`.*

---

## 🚪 Default Portals & Logins

| Portal | Port | Default Login Details |
| :--- | :--- | :--- |
| **Developer Portal** (Tenant) | `http://localhost:3000` | Sign up with any email or use Google OAuth |
| **Platform API Gateway** | `http://localhost:3001` | Swagger docs available at `/docs` |
| **Admin Dashboard** (Operator) | `http://localhost:3002` | **Email**: `admin@conversa.ai` <br>**Password**: `admin_password` |

---

## 🧪 Testing with the Playground

1.  Log into the **Developer Portal** at `http://localhost:3000`.
2.  Go to the **Playground** tab in the sidebar.
3.  Click **"Train Demo Agent"**. This calls the `/training/bootstrap` endpoint to create a default test agent, creates a knowledge base pack, and loads preset testing rules.
4.  Interact with the agent using the chat panel to see it fetch contexts from the FAQ base and apply the greeting, refund, password reset, and escalation policies in real-time.
5.  Open the **Voice Lab** tab, record a message, or try cloning your voice using the microphone widgets.

---

## 🔒 Security & BYOK Architecture

Conversa AI utilizes a Bring Your Own Key model to control API costs. Tenants input their custom LLM API keys which are encrypted before writing to PostgreSQL:
*   **Encryption**: `aes-256-gcm`
*   **Salt & IV**: Generated uniquely per write using standard Node.js `crypto.randomBytes(12)`
*   **Secret derivation**: A SHA-256 hash of `AI_KEY_ENCRYPTION_SECRET` to prevent database snooping or configuration leaks.

---

## 📄 License
This project is licensed under the MIT License.
