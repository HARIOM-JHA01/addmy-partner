# Partner Portal Frontend

A React + TypeScript partner management portal built with Vite and Tailwind CSS.

## Features

- 🔐 Telegram authentication
- 📊 Dashboard with real-time stats
- 👥 User management with filtering and pagination
- 💳 Package purchase system
- 💰 Payment history tracking
- 🔄 Membership renewal functionality
- 📱 Responsive design with Tailwind CSS
- 🚀 Fast development with Vite and HMR

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - API calls
- **Tailwind CSS 4** - Styling
- **date-fns** - Date formatting
- **Telegram WebApp SDK** - Telegram integration

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A running backend API (see `frontend.md` for API documentation)

### Installation

```bash
# Install dependencies
bun install

# or with npm
npm install
```

### Configuration

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update `.env` with your API base URL:

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

### Development

```bash
# Start development server
bun run dev

# or with npm
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   ├── Modal.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorMessage.tsx
│   └── ProtectedRoute.tsx
├── context/          # React context
│   └── AuthContext.tsx
├── pages/            # Page components
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProfilePage.tsx
│   ├── PackagesPage.tsx
│   ├── PaymentHistoryPage.tsx
│   ├── UsersListPage.tsx
│   └── UserDetailPage.tsx
├── services/         # API services
│   └── api.ts
├── types/            # TypeScript types
│   └── index.ts
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## Routes

- `/partner/login` - Telegram login
- `/partner/dashboard` - Dashboard with stats
- `/partner/profile` - Partner profile
- `/partner/packages` - Browse and purchase packages
- `/partner/payments` - Payment history
- `/partner/users` - User list with filters
- `/partner/users/:id` - User details and renewal

## API Integration

See `frontend.md` for complete API documentation including:

- Authentication endpoints
- Available endpoints
- Request/response formats
- Error handling

## Development Notes

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
