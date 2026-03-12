# Architecture Overview

This document describes the implemented architecture based on the current codebase.

## High-Level Components

- Frontend: React application in `frontend/`
- Backend: Spring Boot REST API in `backend/`
- Database: PostgreSQL via Spring Data JPA
- AI Integration: Mistral Chat Completions API (called from frontend)

## Entry Points

- Frontend app root: `frontend/src/index.js` and `frontend/src/App.js`
- Backend app root: `backend/src/main/java/com/resume/builder/AiResumeBuilderApplication.java`

## End-to-End Flow

1. Form input
- `CreateResume` (`frontend/src/pages/CreateResume.js`) collects structured resume fields from the user.

2. Backend processing
- Frontend posts to `POST /api/resumes` via `createResume` in `frontend/src/services/api.js`.
- `ResumeController#createResume` resolves authenticated user from JWT auth context.
- `ResumeServiceImpl#createResume` maps request payload into `Resume`, `Education`, and `Experience` entities and saves via `ResumeRepository`.

3. Mistral API call
- In current code, Mistral is called from `frontend/src/api/mistral.js` through `askMistral(messages)`.
- `AIChat` (`frontend/src/pages/AIChat.js`) sends accumulated chat messages to the Mistral endpoint.

4. Enhanced resume response
- The assistant response returned from Mistral is appended to chat state in `AIChat`.

5. Iterative chat refinement
- User adds follow-up instructions (e.g., rewrite summary, improve tone, adjust wording).
- Entire chat history is re-sent for contextual refinement.

6. Updated resume rendering
- Current implementation renders updated AI output inside chat message bubbles (`ChatMessage`).
- A dedicated structured resume preview renderer is not implemented yet.

## Main Backend Modules

- `controller/UserController.java`: `/api/auth/register`, `/api/auth/login`
- `controller/ResumeController.java`: `/api/resumes`
- `service/UserService.java`: registration/login business logic
- `service/impl/ResumeServiceImpl.java`: resume persistence logic
- `config/SecurityConfig.java`: JWT-protected API routes and CORS/security chain
- `filter/JwtAuthenticationFilter.java`: token extraction and auth context setup
- `util/JwtUtil.java`: token generation/validation/expiration
- `model/*`: JPA entities (`User`, `Resume`, `Education`, `Experience`)

## Main Frontend Modules

- `pages/Login.js` and `pages/Signup.js`: auth flow
- `pages/CreateResume.js`: structured resume form
- `pages/AIChat.js`: Mistral-powered iterative chat
- `services/api.js`: backend API client (auth + resume creation)
- `api/mistral.js`: Mistral client configuration and request handling

