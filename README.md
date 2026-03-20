# Fleximanage UI

A premium, multi-language dashboard for managing FlexiWAN devices and tunnels. Built with React + TypeScript + Vite.

## Features

- **Real-time Monitoring**: Dashboard with device and tunnel status counters.
- **Inventory Management**: Comprehensive device list and detail views.
- **Multi-language Support**: Optimized for English and Japanese.
- **Modern UI**: Clean, slate-based premium design with responsive layouts.
- **Developer Friendly**: Integrated `curl` command logging for API requests.

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Access to a running flexiManage backend API.

## Installation

1. Clone the repository and navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by creating a `.env` file:
   ```env
   VITE_API_BASE=https://your-fleximanage-api.com:3443/api
   VITE_APP_VERSION=1.0.0
   ```

## Development

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Tech Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Premium custom components)
- **State/Navigation**: React Router 7
- **Internationalization**: i18next
- **API Client**: openapi-fetch (Type-safe OpenAPI client)
- **Icons**: Lucide React

## License

This project is licensed under the MIT License (Planned).
