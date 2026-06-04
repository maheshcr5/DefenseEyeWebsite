CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS copilot_knowledge_sources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('KnowledgeHub', 'Blog', 'Authoritative', 'Product')),
  tags TEXT[] NOT NULL DEFAULT '{}',
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ,
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS copilot_knowledge_chunks (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES copilot_knowledge_sources(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  token_count INTEGER NOT NULL,
  embedding vector(3072),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS copilot_knowledge_chunks_embedding_idx
  ON copilot_knowledge_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS copilot_knowledge_sources_type_idx
  ON copilot_knowledge_sources(source_type);

CREATE TABLE IF NOT EXISTS copilot_analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  topic TEXT,
  control_id TEXT,
  citation_count INTEGER NOT NULL DEFAULT 0,
  recommended_cmmclens BOOLEAN NOT NULL DEFAULT false,
  search_miss BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
