# Architecture

## Monorepo Structure

This project uses an npm workspaces monorepo. All source code lives under the `packages/` directory:

```
team6-307/
├── packages/
│   ├── express-backend/    # REST API server
│   └── react-frontend/     # React web app
├── docs/                   # Architecture documentation
├── package.json            # Root workspace config
└── README.md
```

---

## Modules

### `packages/express-backend`

The backend is an Express.js REST API that:

- Handles all HTTP routing and API endpoints
- Authenticates users with JWT and bcrypt password hashing
- Connects to MongoDB Atlas via Mongoose
- Manages stores, products, users, and activity data
- Serves an admin API for CRUD operations and image uploads to Azure Blob Storage

**Key files:**

| File | Purpose |
|------|---------|
| `backend.js` | Entry point — mounts all routes |
| `auth.js` | User schema, JWT generation, auth middleware |
| `routes/` | Route handlers split by resource (users, stores, products, activity, admin) |
| `models/` | Mongoose schemas for Store, Product |
| `services/` | Upload service for Azure Blob Storage |

---

### `packages/react-frontend`

The frontend is a React SPA that:

- Renders all pages and UI components
- Communicates with the backend via `fetch`
- Uses React Router for client-side navigation
- Uses Mantine for UI components and styling
- Deployed to Azure Static Web Apps

**Key files:**

| File | Purpose |
|------|---------|
| `src/main.jsx` | App entry point — sets up providers |
| `src/MyApp.jsx` | Root component — routing and auth state |
| `src/Header.jsx` | Navigation bar |
| `src/AdminPanel.jsx` | Admin CRUD interface |
| `src/config.js` | API base URL config |

---

## High-Level Architecture Flow

```
User → React Frontend (Azure Static Web Apps)
             ↓ HTTP requests
       Express Backend (Azure App Service)
             ↓ Mongoose
          MongoDB Atlas
             ↓ (image uploads)
       Azure Blob Storage
```

1. The user interacts with the React frontend.
2. The frontend sends HTTP requests to the Express backend.
3. The backend validates the JWT, processes the request, and reads/writes to MongoDB via Mongoose.
4. Image files are uploaded directly to Azure Blob Storage and the URL is stored in MongoDB.
5. Data is returned to the frontend and rendered for the user.
