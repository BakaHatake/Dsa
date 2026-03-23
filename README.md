# DSA Tracker

[![Live Site](https://img.shields.io/badge/Live-Site-success?style=for-the-badge&logo=vercel)](https://bakadsa.vercel.app)

A web application to track your Data Structures and Algorithms (DSA) problem-solving progress. 


## 🚀 What's in the App? (Current Features)

- **Personalized Dashboard:** Enter your LeetCode username to instantly sync your public coding statistics.
- **Detailed Analytics:**
  - View your total problems solved, neatly categorized into Easy, Medium, and Hard with progress bars.
  - A 35-day **Submission Heatmap** that displays your daily activity and tracks your max streaks.
  - See your Global Rank, total active days, and recent submission history.
- **Profile Comparison:** 
  - Compare your stats head-to-head with any other registered user on the platform.
  - Inspect statistical overviews, badge counts, max streaks, and active years side-by-side.
  - **Topic Mastery Breakdown:** See how you stack up against others in specific algorithmic topics (fundamental, intermediate, advanced).
  - Compare recent API-fetched successes and overall activity.
- **Secure Authentication:** Firebase-powered login and signup to persist your profile and linked usernames securely.

## 🔮 What I am Trying to Build (Roadmap)

- **Multi-Platform Support:** Expand tracking capabilities to include GeeksForGeeks, Codeforces, and HackerRank (currently optimized for LeetCode).
- **Advanced Insights:** Fetch real difficulties for recent submission history (currently approximated) and provide personalized problem recommendations based on weak topics.
- **Social Features:** Friend lists, global leaderboards, and sharing your dashboard configurations.
- **Spaced Repetition:** An intelligent revision system that reminds you to revisit past problems based on forgetting curves.

## 🛠️ Tech Stack

- **Frontend:** Next.js / React
- **Backend & Database:** Firebase (Non SQL Data Format)
- **Hosting:** Vercel

## ⚙️ Local Setup

Follow these steps to run the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- A [Firebase](https://firebase.google.com/) account for the database and authentication.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/dsa-tracker.git
   cd dsa-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root of the project and add your Firebase configuration details:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser to view the application.
