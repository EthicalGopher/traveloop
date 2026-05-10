# Traveloop 🌍

Traveloop is a modern, AI-powered travel planning and community platform. It allows users to build detailed itineraries, manage travel budgets, and share their journeys with a global community of explorers. It also features a robust administrative suite for platform management and data analytics.

## 🚀 Key Features

### For Explorers
- **Trip Builder**: Design comprehensive multi-day itineraries with ease.
- **Budget Management**: Track your travel expenses across categories like transport, accommodation, and activities.
- **Community Stories**: Share your legendary routes and discover hidden gems from fellow travelers.
- **Interactive Maps**: Seamlessly visualize and navigate your path with Google Maps integration.
- **AI-Powered Insights**: Leveraging Gemini AI to enhance the trip-planning experience.

### For Administrators
- **Command Center**: A high-level overview of platform health, explorer growth, and recent activity.
- **User Management**: Oversee the user directory and monitor individual travel activities.
- **Trends & Analytics**: Real-time data visualization of popular cities, trending activities, and growth velocity.
- **Access Control**: Secure role-based routing (Admin vs. Public) with a dedicated Admin Console.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (TypeScript)
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4 with custom Aurora UI & Glassmorphism themes
- **Animation**: Framer Motion
- **Data Visualization**: Recharts
- **Icons**: Lucide React

### Backend
- **Language**: Go 1.25
- **Web Framework**: Fiber v2
- **ORM**: GORM
- **Database**: SQLite (GopherBase)
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Google Generative AI (Gemini)

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Makefile for service management

## 📦 Project Structure

```text
├── server/               # Go Fiber Backend
│   ├── handlers/         # API Route Handlers
│   ├── models/           # GORM Database Models
│   ├── middleware/       # Auth & Role Protection
│   └── database/         # SQLite Connection & Migrations
├── src/                  # React Frontend
│   ├── pages/            # Page Components (Public & Admin)
│   ├── components/       # Reusable UI Elements
│   ├── layouts/          # Dashboard & Public Layouts
│   ├── utils/            # API Client & Auth Logic
│   └── lib/              # Styling Utilities
├── public/               # Static Assets
└── Dockerfile            # Multi-stage builds for deployment
```

## 🏁 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (for local development)
- [Go](https://go.dev/) (for local development)

### Quick Start
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/traveloop.git
    cd traveloop
    ```
2.  **Environment Setup**:
    Copy `.env.example` to `.env` and provide your `GEMINI_API_KEY`.
3.  **Launch Services**:
    ```bash
    make restart
    ```
    Access the application at `http://localhost:4173` and the backend API at `http://localhost:8080`.

## 🔄 Development Workflow

- **Role-Based Access**: The system uses two roles: `public` and `admin`. Admin pages are prefixed with `/admin`.
- **Admin Bootstrapping**: The email `admin@traveloop.com` is automatically granted the `admin` role during signup for testing purposes.
- **Service Management**: Always run `make restart` after making code changes to ensure the Docker containers are synchronized.

## 📜 License
This project is licensed under the MIT License.
