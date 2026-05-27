# VedaAI - AI Assessment Creator

VedaAI is a full-stack web application designed to help teachers create structured, high-quality question papers effortlessly using Artificial Intelligence. 

## 🏗️ Architecture Overview

The system is designed with a modern, scalable, and non-blocking architecture to handle potentially slow AI generation tasks without freezing the user interface.

- **Frontend**: Next.js (React) + TypeScript + Zustand + CSS Modules.
- **Backend**: Node.js + Express (TypeScript).
- **Database**: MongoDB (Stores generated assignments).
- **Queue System**: BullMQ + Redis (Handles background job processing for AI generation).
- **Real-time Communication**: WebSocket (Socket.io) to push live status updates to the client.
- **AI Integration**: Groq API (Llama 3.3 70B) for lightning-fast and highly capable prompt processing.

## 🚀 The Approach

### 1. Job Queuing for Reliability
Generating complex JSON from an LLM can sometimes take 10-20 seconds. If we used a standard HTTP request/response model, the browser connection might timeout, or the user might refresh and lose their generation. 
By utilizing **BullMQ** and **Redis**, the backend immediately returns a `jobId` and hands the heavy lifting to a background worker. 

### 2. Real-time WebSocket Updates
While the BullMQ worker is generating the assignment, it emits progress updates (e.g., "Initializing", "Generating AI content", "Finalizing"). These are streamed directly to the Next.js frontend via **Socket.io**, providing a dynamic loading screen experience.

### 3. Prompt Engineering
The system ensures the LLM does not return conversational text (like "Here is your assignment:"). We use strict prompt structuring and JSON-mode features to force the model to return a deeply nested, perfectly typed JSON object containing Sections, Questions, Difficulty markers, and Marks.

### 4. Figma-Accurate UI & Print Formatting
The frontend precisely mirrors the provided Figma designs. Additionally, specialized `@media print` CSS rules were added. When a teacher hits "Download PDF", the native browser print engine strips away the sidebars, navigation, and banners, rendering a clean, perfectly formatted exam paper.

## 💻 Setup Instructions

To run this project locally, you will need **Node.js**, a **MongoDB** connection URL, and a **Redis** connection URL.

### 1. Clone the repository
```bash
git clone https://github.com/Akarshkushwaha/veda.ai.git
cd veda.ai
```

### 2. Setup the Backend
Open a terminal in the `backend` directory:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` folder and add your keys:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
GROQ_API_KEY=your_groq_api_key
```
Start the backend development server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal in the `frontend` directory:
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend/` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Start the frontend development server:
```bash
npm run dev
```

### 4. Ready!
Open [http://localhost:3000](http://localhost:3000) in your browser to start creating AI assignments!
