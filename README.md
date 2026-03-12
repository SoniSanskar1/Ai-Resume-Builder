# AI Resume Builder

AI Resume Builder is a full-stack AI application that collects structured resume data, enhances resume content using the Mistral Small 3 API family (`mistral-small` model identifier in current code), and supports chat-based iterative resume refinement with live UI updates in the chat stream.

Based on the current codebase, the AI call is triggered from the frontend chat module, and refinement output is shown in the chat UI.

## Key Features

- User registration and login with JWT-based authentication
- Structured resume form for profile, skills, education, and experience
- Resume persistence in PostgreSQL using Spring Data JPA
- AI chat assistant powered by Mistral for iterative resume text refinement
- React + Material UI frontend with route-based user flow

## AI Flow (Current Implementation)

1. User signs in and opens `Create Resume`.
2. Form data is submitted to backend `POST /api/resumes`.
3. Backend validates auth context, maps request data, and saves a `Resume` record.
4. User navigates to `AI Chat`.
5. Chat messages are sent to Mistral Chat Completions (`mistral-small` model).
6. Assistant replies are rendered in the chat thread for iterative refinement.

## Tech Stack

### Frontend

- React 19
- React Router
- Axios
- Material UI (`@mui/material`, `@mui/icons-material`)

### Backend

- Java 17
- Spring Boot 3
- Spring Web, Spring Security, Spring Data JPA
- JWT (`jjwt`)

### AI Integration

- Mistral Chat Completions API
- Model used in code: `mistral-small`

### Database

- PostgreSQL (configured in `backend/src/main/resources/application.properties`)
- Hibernate/JPA (`ddl-auto=update`)

## Project Structure

```text
Ai-Resume-Builder/
|-- backend/
|   |-- src/main/java/com/resume/builder/
|   |   |-- controller/      # Auth + resume endpoints
|   |   |-- service/         # Business logic
|   |   |-- model/           # JPA entities
|   |   |-- repository/      # Data access
|   |   |-- config/          # Security + CORS
|   |   `-- util/            # JWT utilities
|   |-- src/main/resources/
|   |   `-- application.properties
|   `-- pom.xml
|-- frontend/
|   |-- src/
|   |   |-- pages/           # Login, Signup, CreateResume, AIChat
|   |   |-- services/        # Backend API client
|   |   |-- api/             # Mistral API client
|   |   `-- components/      # UI building blocks
|   `-- package.json
`-- docs/
    |-- architecture.md
    |-- ai-workflow.md
    `-- screenshots.md
```

## Local Setup

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+ and npm
- PostgreSQL running locally

### 1) Clone and enter project

```bash
git clone <your-repo-url>
cd Ai-Resume-Builder
```

### 2) Configure environment variables

- Copy `backend/.env.example` and set values in your shell/IDE environment before starting backend.
- Copy `frontend/.env.example` to `frontend/.env` and update values.

> Note: Spring Boot does not automatically load `.env` files by default; use OS environment variables or IDE run configuration for backend variables.

## Environment Variables

### Backend (`backend/.env.example`)

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SPRING_JPA_DATABASE_PLATFORM`
- `SPRING_JPA_HIBERNATE_DDL_AUTO`
- `SPRING_MAIN_ALLOW_CIRCULAR_REFERENCES`
- `SERVER_TOMCAT_MAX_HTTP_FORM_POST_SIZE`
- `SERVER_TOMCAT_CONNECTION_TIMEOUT`
- `SPRING_CODEC_MAX_IN_MEMORY_SIZE`
- `APP_JWT_SECRET`
- `APP_JWT_EXPIRATION_MS`
- `APP_CORS_ALLOWED_ORIGINS`

### Frontend (`frontend/.env.example`)

- `REACT_APP_API_BASE_URL`
- `REACT_APP_MISTRAL_API_URL`
- `REACT_APP_MISTRAL_MODEL`
- `REACT_APP_MISTRAL_API_KEY`

## Run the Application

### Run backend

```bash
cd backend
mvn spring-boot:run
```

Backend default URL: `http://localhost:8080`

### Run frontend

```bash
cd frontend
npm install
npm start
```

Frontend default URL: `http://localhost:3000`

## Example User Flow

1. Sign up with name/email/password.
2. Log in to receive a JWT token.
3. Open `Create Resume` and submit structured resume details.
4. Move to `AI Chat` and request improvements (summary rewrites, tone edits, wording changes).
5. Iterate prompts until the resume content quality is improved.

## Known Limitations (Based on Current Code)

- Mistral API is called directly from frontend code; for production security this should be proxied through backend.
- Frontend expects `/api/refresh-token`, but no corresponding backend controller is present.
- AI chat responses are rendered as chat messages; a dedicated side-by-side resume preview renderer is not implemented yet.
- Sidebar includes routes like `/resumes` and `/logout` that do not have matching route pages in `App.js`.

## Future Improvements

- Move AI calls to a backend service layer and keep API keys server-side.
- Add a dedicated resume preview panel that updates on each AI refinement.
- Persist chat sessions and versioned resume revisions.
- Add endpoint coverage for token refresh and resume retrieval/editing.
- Add automated tests for auth flow, resume APIs, and UI state transitions.

## Why This Is a Strong Portfolio Project

- Demonstrates end-to-end full-stack development across UI, API, auth, and persistence.
- Shows practical AI product integration with iterative prompt-based editing workflow.
- Includes structured data modeling for real user-facing resume workflows.
- Highlights system design tradeoffs and improvement roadmap clearly.
