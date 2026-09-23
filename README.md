# BhoomiSetu (SIH 26016)

**Real-Time National Land Acquisition & Management System for End-to-End Digital Monitoring and Decision Support**

BhoomiSetu is a modern, full-stack platform designed for the Ministry of Rural Development and the Department of Land Resources (DoLR). It provides a unified digital ecosystem to track, manage, and facilitate land acquisition processes, compensation disbursement, grievance redressal, and field operations across India.

## Architecture

This project is structured as an NPM workspaces monorepo:

- `/frontend` - A React & TypeScript web application built with Vite, Tailwind CSS, and shadcn/ui.
- `/backend` - A Node.js & Express REST API utilizing TypeScript, Zod, and PostgreSQL (with PostGIS).
- `/legacy` - The original HTML/CSS/JS prototype, safely preserved for historical reference and asset continuity.

## Technology Stack

- **Frontend:** React, TypeScript, Vite, React Router, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form, Zod.
- **Backend:** Node.js, Express, TypeScript, Zod, JWT, PostgreSQL, PostGIS.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/prakashmoond999-spec/bhoomi-setu.git
   cd bhoomi-setu
   ```

2. Install dependencies for all workspaces:
   ```bash
   npm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env
   # Update the values in .env with your local configuration
   ```

### Development

To start the development servers concurrently (Frontend & Backend):
```bash
npm run dev
```
- The **Frontend** will be available at `http://localhost:5173`

To build the project for production:
```bash
npm run build
```

## Legacy Prototype

The original hackathon prototype is preserved in the `/legacy` folder. You can run it independently:
```bash
cd legacy
python3 -m http.server 8080
```
Then visit `http://localhost:8080` in your browser.

## License
MIT License
