# AI Workflow

This document explains how AI is used in the project based on the current implementation.

## 1) Initial Resume Enhancement Stage

- The user first submits structured resume data from `CreateResume`.
- That submission is sent to backend `POST /api/resumes` and stored in PostgreSQL.
- Based on current code, this step does not automatically trigger a Mistral call.

## 2) Iterative Chat-Based Resume Modifications

- The user opens `AIChat` and enters natural-language prompts.
- `AIChat` calls `askMistral(messages)` from `frontend/src/api/mistral.js`.
- The request is sent to Mistral Chat Completions with model `mistral-small`.
- The assistant reply is appended to the chat thread for immediate iterative refinement.

Examples of supported prompt style:
- "Improve this summary for a backend role."
- "Rewrite experience bullets to be impact-focused."
- "Make wording more concise and recruiter-friendly."

## Prompt-Driven Regeneration Behavior

- The chat keeps a `messages` array in state.
- Each new user prompt is sent with previous messages, so the model receives conversation context.
- This creates iterative, context-aware output generation across turns.

## Current Scope Notes

- The AI response currently appears in chat bubbles.
- There is no dedicated resume preview document component that syncs structured fields with each AI turn.
- The Mistral API key is currently configured in frontend runtime variables, which is acceptable for local demos but not ideal for production security.

