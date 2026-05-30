<<<<<<< HEAD
# Line-Chatbot-AI
=======
# LINE Chatbot AI

ระบบ Chatbot ที่ใช้ LINE Bot SDK + Gemini AI ตอบคำถามจากลูกค้า โดยใช้ข้อมูล FAQ จาก Google Sheet

## 🚀 Features

- ✅ LINE Bot Webhook integration
- ✅ Gemini AI response generation  
- ✅ FAQ fetching from Google Sheet (with 60s caching)
- ✅ Request signature verification
- ✅ TypeScript support
- ✅ Vercel deployment ready

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- LINE Bot credentials (Channel Access Token & Secret)
- Gemini API Key
- Google Sheet CSV export URL

## 🔧 Installation

# LINE Chatbot AI

ระบบ Chatbot ที่ใช้ LINE Bot SDK + Gemini AI ตอบคำถามจากลูกค้า โดยใช้ข้อมูล FAQ จาก Google Sheet

## 🚀 Features

- ✅ LINE Bot Webhook integration
- ✅ Gemini AI response generation  
- ✅ FAQ fetching from Google Sheet (with 60s caching)
- ✅ Request signature verification
- ✅ TypeScript support
- ✅ Vercel deployment ready

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- LINE Bot credentials (Channel Access Token & Secret)
- Gemini API Key
- Google Sheet CSV export URL

## 🔧 Installation

```bash
npm install
```

## ⚙️ Environment Setup

Create `.env.local`:

```env
LINE_CHANNEL_ACCESS_TOKEN=your_token_here
LINE_CHANNEL_SECRET=your_secret_here
GEMINI_API_KEY=your_api_key_here
SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv
```

## 🎯 Development

```bash
npm run dev
```

Server runs at `http://localhost:3000`

Webhook endpoint: `http://localhost:3000/api/line-webhook`

## 📦 Build & Deploy

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
vercel deploy
```

Configure environment variables in Vercel dashboard.

## 📁 Project Structure

```
line-bot-ai/
├── app/
│   ├── api/line-webhook/route.ts   # LINE webhook handler
│   ├── layout.tsx                   # Root layout
+│   └── page.tsx                     # Home page
├── lib/
│   ├── sheet.ts                     # Google Sheet FAQ fetching
│   └── gemini.ts                    # Gemini AI integration
├── .env.local                       # Environment variables
├── vercel.json                      # Vercel configuration
└── tsconfig.json                    # TypeScript config
```

## 🔄 How it works

1. LINE user sends a message
2. LINE sends webhook event to `/api/line-webhook`
3. Server verifies signature
4. FAQ is fetched from Google Sheet (with cache)
5. Gemini generates response based on FAQ
6. Reply is sent back to LINE user

## 🛡️ Security

- Request signature verification enabled
- Environment variables for sensitive data
- No hardcoded secrets

## 📝 License

MIT
