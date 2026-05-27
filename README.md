# VedaAI - AI Assessment Creator

Hi! This is my submission for the VedaAI Full Stack Engineering Assignment. 

I've built a full-stack web application that allows teachers to easily create question papers using AI. I focused heavily on making sure the UI perfectly matches the Figma designs provided, and I built a robust backend to handle the AI generation without freezing the frontend.

## 🛠️ Tech Stack

**Frontend:**
- Next.js (React) with TypeScript
- Zustand for state management
- Pure CSS Modules for styling (to match the Figma precisely)
- Socket.io-client for real-time loading updates

**Backend:**
- Node.js & Express (TypeScript)
- MongoDB for storing the generated assignments
- BullMQ & Redis for handling background jobs
- Socket.io for sending progress updates to the frontend
- Groq API (Llama 3.3 70B) for super-fast AI generation

## 🚀 How I Built It (My Approach)

### 1. Handling Long AI Generations
Sometimes asking an LLM to generate a complex JSON structure takes a while. If I just used a normal HTTP request, the browser might timeout while waiting. 
To fix this, I used **BullMQ** and **Redis**. When you click "Next", the backend just adds the job to a queue and immediately says "Okay, I'm working on it!". A background worker then takes over to do the actual AI generation.

### 2. Real-time Loading Screen
While the background worker is generating the assignment, it needs to tell the frontend what's going on. I used **WebSockets (Socket.io)** for this. The backend streams live status updates (like "Initializing AI...", "Generating Questions...") directly to the Next.js frontend, making the loading screen feel dynamic and responsive.

### 3. Prompt Engineering & JSON Mode
I wrote strict prompts so the AI doesn't reply with conversational text (like "Here are your questions!"). Instead, it outputs a perfectly formatted, deeply nested JSON object. The frontend then parses this JSON and renders the questions cleanly.

### 4. Perfect PDF Export
One of the bonus requirements was letting users download the assignment as a PDF. Instead of using a clunky HTML-to-PDF library, I used native `@media print` CSS rules. When you hit "Download PDF" and the print dialog opens, it automatically hides the sidebar, the top header, and resets the margins. The result is a clean, perfectly formatted exam paper!

### 5. File Upload
I also added a file upload feature. If you upload a PDF or Text file on the creation screen, the backend extracts the text using `pdf-parse` and `multer` and feeds it directly into the AI prompt as extra context!

## 💻 How to Run It Locally

You'll need Node.js, a MongoDB connection URL, and a Redis connection URL to run this.

### 1. Clone the project
```bash
git clone https://github.com/Akarshkushwaha/veda.ai.git
cd veda.ai
```

### 2. Start the Backend
Open a terminal in the `backend` folder:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` folder and add your environment variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
GROQ_API_KEY=your_groq_api_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Start the Frontend
Open a new terminal in the `frontend` folder:
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend/` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Start the frontend server:
```bash
npm run dev
```

### 4. You're all set!
Open [http://localhost:3000](http://localhost:3000) in your browser. 

Thanks for reviewing my assignment!
