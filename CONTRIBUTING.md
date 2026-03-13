# Contributing Guidelines

Thank you for your interest in contributing to our project!

To maintain consistency, quality, and collaboration across the team, all contributors are expected to follow the coding standards, workflow, and core values outlined below.

By contributing to this repository, you agree to adhere to these guidelines.

— **Rubber Duck Team**

---

## Table of Contents

- [Development Workflow](#development-workflow)
- [Working with Azure](#working-with-azure)
- [Coding Style](#coding-style)
- [Core Values](#core-values)
- [Code of Conduct](#code-of-conduct)


## Development Workflow

If you plan to make changes to this repository, please follow this process:

### 1. Create an Issue
Open an issue on our GitHub board describing the proposed feature, bug fix, or change.

### 2. Assign the Issue
Assign the issue to yourself (or coordinate with a team member).

### 3. Create a New Branch
Create a new branch based on the issue.

```bash
git checkout -b short-description
```

Use clear and descriptive branch names:
- `add-rating-system`
- `login-validation-bug`
- `api-cleanup`

### 4. Make Your Changes
Implement your changes while following our coding standards.

> **Note on Azure:** The frontend is deployed to Azure Static Web Apps and points to the Azure-hosted backend by default. If you need to test backend changes locally, update `packages/react-frontend/src/config.js` to point to `http://localhost:8000` instead of the Azure API URL. Remember to revert this before merging.

### 5. Run Formatting and Linting

Before committing, ensure your code passes formatting and linting checks:

```bash
npm run lint
npm run format
```

### 6. Commit Your Changes

Write clear and descriptive commit messages:

```bash
git commit -m "Add rating system to dining hall page"
```

### 7. Push Your Branch

```bash
git push origin short-description
```

### 8. Open a Pull Request

Create a pull request to merge your branch into the main branch.

Please include:
- A clear description of what was changed
- The related issue number (if applicable)
- Screenshots (if UI changes were made)

### 9. Code Review and Merge

Another team member will review your pull request. Once approved, it will be merged.

This workflow helps maintain code quality, reduce merge conflicts, and ensure transparency in development.

---

## Coding Style

We have adopted **Prettier** and **ESLint** to maintain a cohesive coding style and consistent linting rules across the project. These tools help us:

- Improve code readability
- Enforce consistent formatting
- Catch potential issues early
- Reduce merge conflicts

Please ensure your code passes formatting and linting checks before submitting a pull request.

### Configuration Files

- [Prettier Configuration](.prettierrc)
- [ESLint – Frontend](packages/react-frontend/eslint.config.js)
- [ESLint – Backend](packages/express-backend/eslint.config.js)

All pull requests must comply with these configurations.

---

## Core Values

Our project is guided by the following principles:

### Transparency

We provide a clear **"Quality vs. Cost"** metric so students know exactly what they are getting for their dining dollars.

### Efficiency for Faculty

We offer a **free, real-time data collection method** that replaces manual surveys with real-time student sentiment.

### Community Recommendation

We reduce the overwhelming feeling for students — and the lack-of-options feeling for seniors — by highlighting the best dishes across all spread-out dining halls.

---

## Code of Conduct

Be respectful, constructive, and collaborative in all communications. We value inclusivity, professionalism, and teamwork.

If you have questions, suggestions, or concerns, please open an issue or contact a project maintainer.

---

Thank you for contributing and helping improve our project!