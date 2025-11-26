# Disha - MSME Bookkeeping & Credit Scoring App

A beautiful, mobile-first bookkeeping application for Micro, Small and Medium Enterprises (MSMEs) with integrated credit scoring.

## Features

### 📊 Bookkeeping
- Track income and expenses
- Categorize transactions
- View financial reports
- Profit/Loss analysis

### 💳 Credit Score
- Real-time credit score calculation (0-900 scale)
- Based on 4 key factors:
  - **Payment Consistency** (25%): Regular income patterns
  - **Profitability** (25%): Profit margin health
  - **Cash Flow Health** (25%): Positive cash flow maintenance
  - **Business Stability** (25%): Business age and transaction frequency

### 🔌 API for Lenders
- RESTful API endpoint for banks and financial services
- Access credit scores programmatically
- Comprehensive business financial summary

## Tech Stack

- **Framework**: Nuxt 4
- **UI Library**: Nuxt UI
- **Styling**: Tailwind CSS
- **Database**: Firebase (Firestore)
- **Language**: TypeScript

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore database
3. Copy your Firebase config to `app/config/firebase.ts`
4. Or set environment variables:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`

## API Documentation

### Get Credit Score

```
GET /api/credit-score/{businessId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "businessId": "demo",
    "businessName": "Krishna Enterprises",
    "businessType": "sole_proprietorship",
    "industry": "Retail",
    "creditScore": {
      "score": 675,
      "maxScore": 900,
      "grade": "B",
      "gradeDescription": "Good",
      "factors": [
        {
          "name": "Payment Consistency",
          "score": 75,
          "maxScore": 100,
          "weight": 25,
          "trend": "up"
        }
      ],
      "lastUpdated": "2025-11-27T10:00:00Z"
    },
    "summary": {
      "totalTransactions": 10,
      "totalIncome": 182000,
      "totalExpenses": 80500
    }
  },
  "meta": {
    "apiVersion": "1.0",
    "generatedAt": "2025-11-27T10:00:00Z"
  }
}
```

## Credit Score Grades

| Grade | Score Range | Description |
|-------|-------------|-------------|
| A | 750-900 | Excellent |
| B | 650-749 | Good |
| C | 550-649 | Fair |
| D | 400-549 | Poor |
| E | 0-399 | Very Poor |

## Project Structure

```
disha-prototype/
├── app/
│   ├── assets/css/       # Global styles
│   ├── components/       # Vue components
│   ├── composables/      # Composable functions
│   ├── config/           # App configuration
│   ├── layouts/          # Page layouts
│   ├── pages/            # App pages
│   └── types/            # TypeScript types
├── server/
│   └── api/              # API endpoints
├── public/               # Static assets
└── nuxt.config.ts        # Nuxt configuration
```

## Design

- **Primary Color**: #002060 (Navy Blue)
- **Theme**: Dark mode
- **Mobile-first**: Optimized for mobile devices

## License

MIT

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
