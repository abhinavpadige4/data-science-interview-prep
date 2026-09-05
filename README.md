# Data Science Interview Prep

A comprehensive web application designed to help candidates prepare for data science interviews. Covers Python coding challenges, statistics and probability, machine learning concepts, SQL queries, system design for ML, and behavioral interview questions using the STAR method.

## Features

- **Dark Theme with Glassmorphism**: Modern UI with purple accents and glass-effect cards
- **Global Search**: Filter questions across all sections instantly
- **Progress Tracking**: Visual progress bar saved to localStorage
- **Interactive Components**: Expandable solutions, accordions, tab navigation
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Ready**: All content loads instantly after initial visit

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS 3 with custom dark theme
- **Build Tool**: Vite 4
- **Deployment**: Vercel
- **State Management**: React hooks with localStorage persistence

## Sections

1. **Python Coding Challenges** - 10 problems with hidden solutions
2. **Statistics & Probability** - Formulas, hypothesis testing, examples
3. **ML Questions** - 20 Q&A covering regression, classification, clustering, neural networks
4. **SQL Queries** - 15 queries with joins, window functions, CTEs
5. **System Design for ML** - Architecture patterns and best practices
6. **Behavioral Questions** - STAR method framework with examples

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The app is configured for automatic deployment to Vercel. Push to main branch to trigger deployment.

## LocalStorage Usage

- Progress tracking: Saved as `ds-prep-progress` (0-100 percentage)
- Section completion: Individual section tracking
- Search history: Last 10 searches (optional enhancement)

## Design System

- **Primary Color**: `#a855f7` (purple-500)
- **Dark Background**: `#0f172a` (gray-900)
- **Glass Effect**: `rgba(255, 255, 255, 0.05)` with backdrop blur
- **Typography**: Inter font system stack
- **Transitions**: Smooth 0.2s-0.3s ease animations
- **Hover Effects**: Scale, shadow, and border enhancements

## Contributing

Feel free to submit issues and pull requests to improve content or fix bugs.

## License

MIT License - see LICENSE file for details.
</div>