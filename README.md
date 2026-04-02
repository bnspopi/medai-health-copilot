# MedAI Health Copilot

A multimodal AI-powered healthcare assistant built with Next.js, TypeScript, and Supabase. Features symptom analysis, skin image analysis using OpenAI Vision API, health history tracking, and comprehensive health trends analytics.

## 🚀 Features

### ✅ Symptom Analysis
- AI-powered differential diagnosis using OpenAI GPT-4
- Confidence scores and severity levels
- Red flags and next steps recommendations
- ICD-10 codes for medical conditions

### ✅ Skin Analysis (OpenAI Vision API)
- Real image analysis using OpenAI Vision API
- ABCDE melanoma assessment criteria
- Dermatological findings and recommendations
- Urgency classification (routine/urgent/emergency)

### ✅ Health History
- Complete diagnosis history with timestamps
- PDF export functionality for medical reports
- Shareable links for doctors
- Delete and re-analyze previous diagnoses

### ✅ Health Trends & Analytics
- Disease pattern analysis
- Monthly analysis volume charts
- Most diagnosed conditions statistics
- Diagnostic accuracy trends
- Severity distribution analytics

### ✅ Authentication & Security
- Supabase authentication (sign up/sign in)
- Row-level security (RLS) policies
- Secure data storage
- Demo account available

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Supabase
- **AI**: OpenAI GPT-4, OpenAI Vision API
- **Database**: Supabase PostgreSQL
- **Charts**: Recharts
- **PDF Export**: jsPDF, html2canvas
- **Authentication**: Supabase Auth

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

## 🚀 Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/bnspopi/medai-health-copilot.git
cd medai-health-copilot
npm install
```

### 2. Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Project Settings → API
3. Copy your Project URL and anon/public key to `.env.local`
4. Go to SQL Editor in Supabase Dashboard
5. Run the migration file: `supabase/migrations/20260402000000_medai_schema.sql`

### 4. Demo Account

The migration creates a demo account:
- **Email**: demo@medai.health
- **Password**: demo1234

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
medai-health-copilot/
├── app/
│   ├── analysis/          # Symptom analysis page
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Main dashboard
│   ├── health-history/   # Health history with PDF export
│   ├── health-trends/    # Analytics and trends
│   ├── share/[token]/    # Shareable report pages
│   ├── skin-analysis/    # Vision API skin analysis
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── providers.tsx     # Auth provider
├── lib/
│   ├── openai.ts         # OpenAI API functions
│   └── supabase.ts       # Supabase client functions
│   └── pdf-export.ts     # PDF generation utilities
├── supabase/
│   └── migrations/       # Database migrations
├── public/               # Static assets
└── package.json          # Dependencies
```

## 🔧 API Endpoints

### Symptom Analysis
- **POST** `/api/analyze-symptoms` - Analyze symptoms with AI

### Skin Analysis
- **POST** `/api/analyze-skin` - Analyze skin images with Vision API

### Health History
- **GET** `/api/diagnoses` - Get user's diagnosis history
- **DELETE** `/api/diagnoses/[id]` - Delete a diagnosis
- **POST** `/api/share/[id]` - Create shareable link

### Shared Reports
- **GET** `/share/[token]` - View shared report

## 🎯 Usage

### Symptom Analysis
1. Navigate to "Symptom Analysis"
2. Enter detailed symptoms
3. Click "Analyze Symptoms"
4. Review differential diagnosis, confidence scores, and recommendations

### Skin Analysis
1. Go to "Skin Analysis"
2. Upload a clear skin image
3. Click "Analyze Image"
4. Review ABCDE assessment and dermatological findings

### Health History
1. Visit "Health History"
2. View past diagnoses with timestamps
3. Export as PDF or create shareable links
4. Delete or re-analyze previous entries

### Health Trends
1. Go to "Health Trends"
2. View analytics charts and statistics
3. Analyze disease patterns and monthly volumes

## 🔒 Security & Privacy

- All data is encrypted in transit and at rest
- Row-level security ensures users only access their own data
- OpenAI API calls are secure and don't store personal data
- Shared reports are anonymous and time-limited

## 📊 Analytics Features

- **Monthly Volume**: Track analysis frequency over time
- **Condition Frequency**: Most commonly diagnosed conditions
- **Severity Distribution**: Breakdown of mild/moderate/severe cases
- **Diagnostic Trends**: AI-powered insights and recommendations

## 🚨 Medical Disclaimer

This application is for informational purposes only and should NOT be considered a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical decisions. In case of emergency, please call emergency services or visit your nearest hospital.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for providing powerful AI APIs
- Supabase for the excellent backend platform
- Next.js team for the amazing framework
- Medical professionals who provided guidance on healthcare features

---

Built with ❤️ for better healthcare accessibility