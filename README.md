# WellTrack - Student Wellness & Habit Tracker

A comprehensive Next.js application for student mental health and wellness tracking with AI-powered insights.

## Features

- **Dashboard**: Real-time wellness metrics and streak tracking
- **Mood Tracking**: Log daily moods with AI sentiment analysis
- **Habit Management**: Track daily habits and build streaks
- **Goal Setting**: Set and track academic and personal goals
- **Schedule Management**: Upload and manage daily schedules
- **AI Stress Forecaster**: Predict high-stress periods based on schedule and mood patterns
- **Journal**: Personal journaling with AI sentiment analysis
- **Community**: Connect with other students in wellness forums
- **Safety Plan**: Emergency contacts and coping strategies
- **Gamification**: Points, levels, and achievements system

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage)
- **AI**: Google Gemini AI for insights and predictions
- **UI Components**: Radix UI, Lucide React icons

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd WellTrack-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase and Gemini API credentials

4. **Firebase Setup**
   - Create a Firebase project
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Get your Firebase config and add to `.env.local`

5. **Gemini AI Setup**
   - Get API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Add to `.env.local` as `GEMINI_API_KEY`

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open [http://localhost:9002](http://localhost:9002)**

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── firebase/           # Firebase configuration and hooks
├── ai/                 # AI flows and integrations
├── lib/                # Utilities and type definitions
└── hooks/              # Custom React hooks
```

## Key Features Implemented

### Real-time Data
- All components use Firebase real-time listeners
- Automatic updates without page refresh
- Optimistic UI updates for better UX

### AI Integration
- Stress period prediction based on schedule and mood patterns
- Journal sentiment analysis
- Personalized wellness insights

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details