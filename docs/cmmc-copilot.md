# DefenseEye CMMC Copilot

DefenseEye CMMC Copilot adds a Gemini-powered CMMC assistant to `/copilot` and a floating widget across the site.

## Environment

Add this server-side variable:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=
```

Optional model override:

```bash
COPILOT_GEMINI_MODEL=gemini-2.5-pro
```

The default model is `gemini-2.5-flash`. If the Gemini key is missing, the API returns grounded fallback answers and a clear status message instead of failing hard.

## Architecture

- Frontend: Vite, React, wouter, Tailwind CSS v4, shadcn/Radix UI components, `streamdown` markdown rendering.
- Backend: Express TypeScript server.
- Retrieval: runtime ingestion from KnowledgeHub summaries, local blog data, product context, and authoritative source summaries.
- Embeddings: Gemini `text-embedding-004` when configured; deterministic local vectors as graceful fallback.
- Generation: Gemini streaming via `/api/copilot/stream`.
- Analytics: in-memory counters for topics, controls, search misses, citation usage, and CMMCLens recommendation frequency.

## API

- `GET /api/copilot/status`
- `POST /api/copilot/search`
- `POST /api/copilot/chat`
- `POST /api/copilot/stream`
- `GET /api/copilot/analytics`

## Database

The current site does not include an active database client. A production pgvector migration is provided at:

```text
migrations/001_copilot_pgvector.sql
```

When PostgreSQL is connected, persist source rows, chunks, embeddings, and analytics events there. Until then, the runtime index keeps the feature deployable without changing the hosting model.

## Deployment

1. Install dependencies with `pnpm install`.
2. Add `GOOGLE_GENERATIVE_AI_API_KEY` to the production environment.
3. Optionally set `COPILOT_GEMINI_MODEL=gemini-2.5-pro` for admin override.
4. Build with `pnpm run build`.
5. Start with the existing production command.

## Security Notes

- Request size is validated with Zod.
- Existing server rate limiting protects Copilot endpoints.
- Prompt-injection phrases are neutralized before prompt construction.
- Retrieved context is supplied as source blocks and the system prompt instructs source-grounded answers.
- Server output strips script/event-handler patterns.
- React markdown rendering escapes unsafe HTML by default.
