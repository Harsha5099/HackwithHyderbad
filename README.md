# ClientPulse AI

> **"Your AI client relationship memory."**

Built for the Hackathon: **"AI Agents That Learn Using Hindsight"**

---

## 🌟 Executive Summary

In enterprise sales and high-touch account management, client relationships span dozens of meetings, calls, proposals, objections, commitments, and timeline adjustments over months. Standard CRM notes get buried, and generic AI assistants treat every query in isolation—hallucinating previous context or forgetting critical client objections.

**ClientPulse AI** is an AI-powered client relationship assistant that uses **Hindsight** as its durable, long-term memory engine and **Groq** for high-speed inference. It continuously retains key client facts, previous objections, validated strategies, and outcome feedback. When preparing for high-stakes meetings or answering strategic questions, ClientPulse AI recalls grounded memories and reflects on accumulated history to generate personalized recommendations that adapt dynamically as new interactions occur.

---

## 🧠 Why Hindsight?

The hackathon requirement is to demonstrate that an AI agent **remembers past interactions and becomes more useful over time**. Hindsight is the central backbone of ClientPulse AI:

1. **Persistent Memory Across Sessions**: Not a short-lived context window. Client facts, objections, and preferences remain permanently stored and structured.
2. **True Tenant & Client Isolation**: Every client account maintains an isolated memory bank (`clientpulse-[clientId]`), preventing cross-client data contamination.
3. **Semantic Recall with Entity Recognition & Reranking**: Uses `client.recall()` to retrieve grounded evidence with similarity and reranker scores, ensuring zero hallucinations.
4. **Cognitive Synthesis with Reflect**: Uses `client.reflect()` to synthesize higher-order executive briefing strategies rather than just echoing raw notes.
5. **Continuous Learning from Feedback**: Uses `client.retain()` to capture outcome corrections (e.g. *"The recommendation focused too much on pricing. The client was actually more concerned about timeline."*), enabling the agent to learn from outcomes.

---

## 🏗️ Architecture

```
                                  ┌────────────────────────┐
                                  │      ClientPulse AI    │
                                  │  React + Vite + Tailwind│
                                  └───────────┬────────────┘
                                              │ HTTP / JSON
                                              ▼
                                  ┌────────────────────────┐
                                  │     Node.js Express    │
                                  │   TypeScript Backend   │
                                  └─────┬────────────┬─────┘
                                        │            │
                     ┌──────────────────┴──┐      ┌──┴──────────────────┐
                     │                     │      │                     │
                     ▼                     ▼      ▼                     ▼
          ┌─────────────────────┐  ┌─────────────┐  ┌─────────────────────┐
          │  Local Data Store   │  │   Groq LLM  │  │   Hindsight Cloud   │
          │  Clients & Metadata │  │  Inference  │  │   Memory Engine     │
          └─────────────────────┘  └─────────────┘  └──────────┬──────────┘
                                                               │
                                               ┌───────────────┴───────────────┐
                                               │                               │
                                               ▼                               ▼
                                   retain() / recall()            reflect() / listMemories()
                                  [Isolated Client Banks]       [Synthesis & Categorization]
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React icons
- **Backend**: Node.js, Express, TypeScript, CORS, Dotenv
- **Long-Term Memory Layer**: Official Hindsight TypeScript SDK (`@vectorize-io/hindsight-client`)
- **LLM Provider**: Groq SDK (`openai/gpt-oss-120b` / `qwen/qwen3.8-27b`)
- **Data Layer**: In-memory / lightweight JSON store for client directory; Hindsight is the source of truth for all semantic intelligence.

---

## 🚀 How Hindsight SDK Operations are Used

| Hindsight Operation | File Location | Purpose & Implementation |
|---|---|---|
| `client.retain(bankId, content, options)` | `server/src/services/hindsightService.ts` | Retains interactions, dates, and user feedback into isolated client banks (`hok-[clientId]`). Structured with semantic metadata and timestamps. |
| `client.recall(bankId, query, options)` | `server/src/services/hindsightService.ts` | Recalls verified historical memories with entity extraction and reranker scores to ground chat responses and briefing cards. |
| `client.reflect(bankId, prompt, options)` | `server/src/services/hindsightService.ts` | Synthesizes comprehensive meeting preparation briefs, identifying what worked, what to avoid, and strategic openings. |
| `client.listMemories(bankId, options)` | `server/src/services/hindsightService.ts` | Inspects live memory units and entities in the client's bank for the dedicated Memory Panel. |

---

## 📋 Environment Variables

Create `.env` inside `server/` (and `.env` inside `client/`):

### `server/.env`
```env
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_API_KEY=your_hindsight_api_key
HINDSIGHT_BANK_PREFIX=hok
LLM_API_KEY=your_groq_api_key
LLM_MODEL=openai/gpt-oss-120b
PORT=5000
```

### `client/.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🏁 Quickstart & Local Setup

### 1. Install Dependencies
```bash
# In server directory:
cd server
npm install

# In client directory:
cd ../client
npm install
```

### 2. Seed Demo Interactions into Hindsight
```bash
# In server directory:
npm run seed
```
This populates demo clients into the store and retains 5 historical interactions for **Acme Corp** directly into Hindsight bank `hok-client-1`.

### 3. Start the Backend Server
```bash
# In server directory:
npm run dev
# or: npm run build && npm start
# Runs on: http://localhost:5000
```

### 4. Start the Frontend Client
```bash
# In client directory:
npm run dev
# Runs on: http://localhost:5174
```

Open `http://localhost:5174` in your browser!

---

## 🎯 2–3 Minute Hackathon Demo Script

Here is the exact step-by-step presentation script designed for judges:

### **Step 1: Open ClientPulse AI & Select Acme Corp (30 sec)**
1. Navigate to the dashboard at `http://localhost:5174`.
2. Point out the live indicators: `Hindsight Long-Term Memory Live` and `Groq LLM Connected`.
3. Click **Acme Corp** (marked with the `PRIMARY HACKATHON DEMO CLIENT` badge).
4. Explain: *"Acme Corp is a healthcare technology firm looking to migrate to the cloud. Contact is Rahul Sharma. The client has had 5 previous interactions with us over the last 2 months."*

### **Step 2: Inspect the Hindsight Memory Panel (30 sec)**
1. Click the **Memory Panel** tab.
2. Show the structured categories extracted from Hindsight:
   - **Likes / Priorities**: Security, Three-phase migration approach, Zero clinical downtime.
   - **Concerns**: Clinical downtime during cutover, HIPAA compliance.
   - **Dislikes**: Generic pricing proposals without itemization.
   - **Important History**: First proposal rejected because pricing was too generic; security documentation requested.
3. Show the **Raw Memory Units** inspector displaying actual memories and extracted entities (`Rahul Sharma`, `HIPAA`, `Acme Corp`).

### **Step 3: Ask About Client History in AI Assistant (30 sec)**
1. Click the **AI Assistant** tab.
2. Click the quick prompt: `"Why did Acme reject our previous proposal?"`
3. Observe the response: The AI clearly explains that Acme rejected the initial proposal because the pricing model was too generic and unbundled, citing exact memories.
4. Click the expandable **"🧠 Memory Consulted"** banner to reveal the exact Hindsight units and reranker scores (e.g., `0.9988`).

### **Step 4: Generate Baseline Meeting Brief (30 sec)**
1. Click the **Meeting Brief** tab.
2. Review the structured executive briefing:
   - **Recommended Approach**: Recaps the three-phase approach, presents HIPAA documentation upfront, and uses itemized pricing.
   - **Key Priorities**: Security, minimal downtime, timeline predictability.
   - **What to Avoid**: Generic pricing, vague timelines.

### **Step 5: The Learning Demonstration (45 sec)**
1. Click **Add Interaction** (or click the guided demo tool button).
2. Enter:
   - **Title**: `Urgent 90-Day Implementation Constraint`
   - **Type**: `Call`
   - **Content**: *"Acme now says implementation time is their biggest concern. They want the migration completed within 90 days due to their hospital board review."*
3. Click **Save & Retain Memory**.
4. Observe the toast notification: *"🧠 Memory updated! New interaction retained into Hindsight bank."*
5. Return to **Meeting Brief** and click **Regenerate Brief**.
6. **The Result**: The meeting brief has completely adapted:
   - New Urgent Priority: `🚨 STRICT 90-DAY IMPLEMENTATION WINDOW`.
   - What to Avoid: `Proposing any timeline exceeding 90 days or lacking parallel workstreams`.
   - Strategy: `Lead immediately by validating their new 90-day deadline requirement...`.
7. Conclude: *"The agent didn't just store text in a database—it retained the new outcome in Hindsight and incorporated it into future reasoning."*

### **Step 6: Outcome Feedback Loop (15 sec)**
1. Scroll to the bottom of the Meeting Brief.
2. Click **[Not Helpful (Teach Agent)]**.
3. Select or enter: *"The recommendation focused too much on pricing. The client was actually more concerned about implementation time."*
4. Click **Submit & Retain Lesson**.
5. Show how this corrective outcome is retained in Hindsight for continuous learning.

---

## 🛡️ Client Bank Multi-Tenant Isolation

ClientPulse AI uses a strict prefix isolation pattern:
```typescript
const bankId = `${process.env.HINDSIGHT_BANK_PREFIX || 'clientpulse'}-${clientId}`.toLowerCase();
// Example: hok-client-1, hok-client-2, hok-client-3
```
Memory from one client can never leak into another client's context.

---

## 🔗 Official Documentation Reference

- **Hindsight Official Documentation**: [https://docs.hindsight.vectorize.io](https://docs.hindsight.vectorize.io)
- **Hindsight NPM Package**: [@vectorize-io/hindsight-client](https://www.npmjs.com/package/@vectorize-io/hindsight-client)
- **Vectorize**: [https://vectorize.io](https://vectorize.io)

---

## 🏆 Hackathon Submission Highlights

- **Persistent Memory**: 16+ semantic facts, observations, and entities active in Hindsight.
- **Accurate Recall**: Semantic + reranker scoring with zero hallucinated history.
- **Cognitive Synthesis**: High-level strategic meeting briefs with `client.reflect()`.
- **Dynamic Learning**: Real-time retention and adaptation when constraints shift (90-day requirement).
- **Outcome Feedback**: User corrections retained as durable lessons for future reasoning.
- **Production UI**: Polished modern SaaS design with Tailwind CSS, Lucide icons, responsive tabs, and interactive demo mode.
