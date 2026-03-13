## Rubber Duck — Team 6  
### CSC 307 Team Project

🌐 **Live Website:** https://zealous-grass-0d5be150f.4.azurestaticapps.net/

---

## Table of Contents

- [Product Vision](#product-vision)
- [UI Prototype](#ui-prototype)
- [Architecture Docs](#architecture-docs)
  - [Our Stack](#our-stack)
  - [Code Structure](#code-structure)
  - [High-Level Architecture Flow](#high-level-architecture-flow)
- [Development Environment Setup](#development-environment-setup)
  - [Installation](#installation)
  - [Contributing](#contributing)
- [Class (Data Model) Diagrams](#class-data-model-diagrams)
- [Signup Sequence Diagram](#signup-sequence-diagram)
- [Signin Sequence Diagram](#signin-sequence-diagram)
- [Endpoint Sequence Diagram](#endpoint-sequence-diagram)

---

## Product Vision
For Cal Poly students who utilize on-campus dining, Poly Rate My Food is a specialized rating platform that elevates the student dining experience and identifies the best campus dishes.

**Our product focuses on:**

- **Elevating Quality:** Providing honest, transparent data on popular dishes to help students avoid wasting money.

- **Data-Driven Choices:** Helping both students and faculty make informed decisions about food selection and menu planning for the week.

- **Bridging the Gap:** Creating a feedback loop where student discontent is transformed into actionable data for faculty to better allocate resources and improve options.

---

## UI Prototype

We decided to use Figma to create an interactive UI prototype. You can find our project through the link below!

[View Our Figma Prototype](https://www.figma.com/proto/OISdAr94PWu1oY6zqT3CjO/PRMF-wireframe?node-id=11-232&t=zIU9eh66fzXnfrG5-1&starting-point-node-id=11%3A232)

**Last updated:** February 23, 2026

---

## Architecture Docs

For detailed architecture documentation, see the [`docs/`](docs/) folder:

- [Architecture Overview](docs/architecture.md) — monorepo structure and how modules are implemented
- [UML Class Diagrams](docs/uml-diagrams.md) — data model diagrams with last-updated date

---

## Our Stack

### Frontend
- **React**

### Backend
- **Express**
- **Mongoose**

### Database
- **MongoDB**

### Libraries
- **Mantine** — UI components and styling
- **React Router** — client-side routing
- **bcrypt** — password hashing
- **jsonwebtoken** — JWT authentication
- **dotenv** — environment variable management
- **cors** — cross-origin resource sharing
- **multer** — file upload handling
- **@azure/storage-blob** — Azure Blob Storage SDK

---

## Code Structure

Our codebase is organized inside the `packages/` directory and split into two main parts:

### 1. `express-backend`

This service:
- Processes requests from the frontend
- Handles routing and API endpoints
- Manages database interactions
- Connects to MongoDB using Mongoose
- Contains business logic and data validation

### 2. `react-frontend`

This application:
- Builds the interactive user interface using React
- Communicates with the backend via API requests
- Displays real-time data to users
- Uses Mantine for UI components and styling
- Focuses on delivering a clean, user-friendly experience

---

## High-Level Architecture Flow

```
User → React Frontend → Express Backend → MongoDB
```

1. A user interacts with the React frontend.
2. The frontend sends HTTP requests to the Express backend.
3. The backend processes the request and communicates with MongoDB via Mongoose.
4. Data is returned to the frontend and rendered for the user.

---

This separation ensures:
- Clear responsibility between frontend and backend
- Scalable architecture
- Maintainable and modular code structure

---

## Development Environment Setup

### Installation

1. Clone the repo and install dependencies from the project root:

```bash
git clone <repo-url>
cd team6-307
npm install
```

2. Create a `.env` file inside `packages/express-backend/` with the following:

```
MONGO_CONNECTION_STRING=your_mongodb_connection_string
TOKEN_SECRET=your_jwt_secret
AZURE_STORAGE_CONNECTION_STRING=your_azure_connection_string
AZURE_STORAGE_CONTAINER_NAME=images
```

> Without a valid `.env`, the backend will not start properly.

3. Start the backend from the project root:

```bash
npm start
```

4. In a separate terminal, start the frontend from the `packages/react-frontend/` directory:

```bash
cd packages/react-frontend
npm run dev
```

### Contributing

Please read our contributing doc for workflow and coding style guidelines:

[Contributing Doc](CONTRIBUTING.md)

---

## Class (Data Model) Diagrams

See the full [UML Class Diagrams](docs/uml-diagrams.md) documentation page.

## Security Daigrams

See the full [Security Diagrams](docs/security-diagrams.md) documentation page.

---

