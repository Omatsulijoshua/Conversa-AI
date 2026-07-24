# ⚙️ Conversa AI - Backend API Gateway

This is the central API server for the Conversa AI platform, built with **NestJS**, **TypeScript**, and **Prisma ORM** with **PostgreSQL**. It coordinates authentication, multi-tenant agent management, secure API key storage, RAG search engines, voice synthesis (TTS), audio transcription (STT), voice cloning, and global system analytics.

---

## 🚀 Key Modules & Code Organization

The application is structured into domain-specific modules under `src/`:

```text
src/
├── main.ts                      # Entry point, sets global prefix (/api/v1) & Swagger UI docs
├── app.module.ts                # Main application module configuring global config and throttler limits
├── admin/                       # Platform operator overview queries
├── agent/                       # Agent configuration & profiles CRUD
├── ai/                          # LLM provider router (OpenAI, Gemini, Anthropic, Grok, etc.)
├── ai-provider/                 # Secure BYOK key vaults with AES-256-GCM encryption
├── analytics/                   # Multi-tenant usage and series analytics
├── api-key/                     # Key authenticator for public API calls
├── auth/                        # Guards and strategies (Local JWT, Tenant, Google OAuth2)
├── billing/                     # Customer payments integration (Stripe)
├── common/                      # Shared decorators (e.g. Tenant context injector)
├── conversation/                # Multi-turn chat sessions with RAG context injects
├── knowledge/                   # Document text chunking & RAG embedding services
├── prisma/                      # Central database client wrapper
├── speech/                      # Whisper STT & TTS controllers
├── training/                    # Platform quick-bootstrap and demo setup
├── voice/                       # ElevenLabs voice cloning controller
└── webhook/                     # Custom outbound webhooks registers
```

---

## 🔒 Security & BYOK Architecture

To ensure data confidentiality, Conversa AI uses a **Bring Your Own Key (BYOK)** setup for LLM access. 

When a tenant saves an API key for OpenAI, Gemini, Grok, Anthropic, DeepSeek, Mistral, or OpenRouter:
1. The backend generates a random **12-byte Initialization Vector (IV)**.
2. The key is encrypted using **AES-256-GCM** using a key derived from a SHA-256 hash of the `AI_KEY_ENCRYPTION_SECRET` (or falling back to `JWT_SECRET`).
3. The encrypted payload, Auth Tag, and base64 IV are stored in the database in the format: `ivBase64.tagBase64.encryptedBase64`.
4. The key is only decrypted in-memory inside the `AiService` when executing live prompts.

---

## 🔍 Search & Retrieval-Augmented Generation (RAG)

The RAG workflow operates inside `KnowledgeService` and `ConversationService`:
1. **Ingestion**: When a document is uploaded, the text is sliced into chunks of 1000 characters.
2. **Embedding**: The system tries to generate 1536-dimensional embeddings using OpenAI's `text-embedding-3-small`.
3. **Offline Fallback**: If OpenAI is not configured, it triggers a custom **64-dimensional bag-of-words hashing vectorizer** that builds frequency maps from alphanumeric matches, saving it as a floating-point array in PostgreSQL.
4. **Retrieval**: When a query is sent, the question is embedded, all chunks mapped to the agent are fetched, and a **cosine similarity** calculation is performed. The top 3 highest-scoring chunks are injected into the agent prompt.

---

## 📻 API Endpoints Documentation

The backend serves an interactive **Swagger API playground** at:
👉 **`http://localhost:3001/docs`** (When running locally)

### Summary of Major API Routes

#### 🔐 Authentication & Session
*   `POST /api/v1/auth/signup` - Register a new Tenant account.
*   `POST /api/v1/auth/login` - Authenticate and return JWT token.
*   `GET /api/v1/auth/google/callback` - Google OAuth authentication route.

#### 🧠 Agents Configuration
*   `POST /api/v1/agent/config` - Create a custom agent profile.
*   `GET /api/v1/agent/config` - Retrieve all agents configured by the Tenant.
*   `PATCH /api/v1/agent/config/:id` - Update agent tone, instructions, or voice profile.
*   `DELETE /api/v1/agent/config/:id` - Delete an agent profile.

#### 🗂️ RAG & Knowledge bases
*   `POST /api/v1/knowledge/:agentId` - Create a new Knowledge Base repository.
*   `GET /api/v1/knowledge/:agentId` - List all knowledge bases for an agent.
*   `POST /api/v1/knowledge/:id/upload` - Upload and ingest text documents.

#### 💬 Conversations (Chat Loops)
*   `POST /api/v1/conversation/start` - Initialize a new session ID for an agent.
*   `POST /api/v1/conversation/message` - Send message, retrieve RAG matches, query LLM, and return reply.
*   `GET /api/v1/conversation/history/:sessionId` - Retrieve full chat logs.

#### 🎙️ Speech & Neural Voice Cloning
*   `POST /api/v1/speech/stt` - Transcribe audio files using OpenAI Whisper.
*   `POST /api/v1/speech/tts` - Convert text to voice using OpenAI Speech engines.
*   `POST /api/v1/voice/clone` - Create customized cloned voices via ElevenLabs.

#### 👑 Platform Administration
*   `GET /api/v1/admin/overview` - Fetch platform-wide counts, latencies, and revenue estimates. (Protected via Admin credentials).

---

## ⚡ Setup & Testing Locally

### 1. Configure the Environment
Create a `.env` file in the root of `/backend`:
```env
DATABASE_URL="postgresql://conversa_admin:your_secure_password@localhost:5432/conversa_db?schema=public"
JWT_SECRET="generate_a_secure_jwt_token_secret"
AI_KEY_ENCRYPTION_SECRET="generate_32_character_encryption_secret"
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxx" # Optional fallback for STT/TTS & Demo agents
ELEVENLABS_API_KEY="el-xxxxxxxxxxxx" # Optional fallback for voice cloning
```

### 2. Run Database Migrations
Deploy the Prisma database structure to your PostgreSQL database:
```bash
npx prisma db push
```

### 3. Seed Default Operator Account
Creates the default system operator account `admin@conversa.ai` with password `admin_password`:
```bash
npx prisma db seed
```

### 4. Boot API Gateway
Start the server in watch mode:
```bash
npm run start:dev
```
The application will listen on port **3001**.
