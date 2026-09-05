# Data Science Interview Prep

A comprehensive web application designed to help data science candidates prepare for technical interviews. Built with React 18, TypeScript, Tailwind CSS, and Vite, featuring dark theme design with glassmorphism effects.

## Features

- **Python Coding Challenges**: 10 problems with expandable solutions
- **Statistics & Probability**: Key formulas, hypothesis testing concepts with examples
- **Machine Learning Questions**: 20 Q&A covering regression, classification, clustering, and neural networks
- **SQL Queries**: 15 practice queries with joins, window functions, and CTEs
- **System Design for ML**: Core concepts and architecture patterns
- **Behavioral Questions**: STAR method framework with examples
- **Global Search**: Filter questions across all sections
- **Progress Tracking**: Visual progress indicator saved to localStorage
- **Dark Theme**: Purple accent colors with glassmorphism UI
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS 3 with custom dark theme
- **Build Tool**: Vite 4
- **Deployment**: Vercel
- **State Management**: React hooks with localStorage persistence

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd data-science-interview-prep

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
npm run preview
```

### Deployment to Vercel

1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel dashboard
3. Vercel will automatically detect the Vite configuration
4. Deploy!

## Features in Detail

### Progress Tracking
- Overall completion percentage tracked via circular progress bar
- Data persisted in localStorage across sessions
- Visual feedback with purple gradient animation

### Search Functionality
- Global search bar filters content across all sections
- Real-time filtering as you type
- Highlights matching terms in results

### UI/UX Design
- Dark background (`#0f172a`) with purple gradient accents (`#a855f7` → `#9333ea`)
- Glassmorphism cards with `rgba(255,255,255,0.05)` background and backdrop blur
- Hover effects with scale and shadow transitions
- Smooth fade-in animations on scroll
- Purple underline on active tabs and hover states

## File Structure

```
src/
├── main.tsx          # App bootstrap
├── App.tsx           # Main application component
├── index.css         # Global Tailwind styles + custom variables
├── components/       # Reusable UI components
│   ├── Hero.tsx
│   ├── SearchFilter.tsx
│   ├── ProgressTracker.tsx
│   ├── SectionTabs.tsx
│   ├── PythonChallenges.tsx
│   ├── StatisticsSection.tsx
│   ├── MLQuestions.tsx
│   ├── SQLQueries.tsx
│   ├── SystemDesign.tsx
│   └── Behavioral.tsx
└── utils/            # Helper functions
    ├── progress.ts
    └── search.ts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing-feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by common data science interview questions from top tech companies
- Built with ❤️ using modern web technologies
- Special thanks to the React, Tailwind CSS, and Vercel teams
