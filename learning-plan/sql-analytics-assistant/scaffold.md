# SQL Analytics Assistant — RAG Scaffold

**Phase:** 3 (months 4–6)
**Status:** not started
**Goal:** Replace hardcoded question→SQL mapping with a real RAG pipeline.

---

## Current state

The project currently maps natural-language questions to SQL queries using
hardcoded logic. That doesn't scale — every new table or business rule means
editing code.

## Target architecture (5-step pipeline)

```
User question
    │
    ▼
┌─────────────────┐
│ 1. INGEST       │ Schema docs, column descriptions, sample queries,
│                 │ business rules → chunks → embeddings → vector store
└────────┬────────┘
         ▼
┌─────────────────┐
│ 2. RETRIEVE     │ Question → embed → similarity search → top-k chunks
└────────┬────────┘
         ▼
┌─────────────────┐
│ 3. PROMPT       │ Retrieved context + question + SQL generation rules
│                 │ → LLM call
└────────┬────────┘
         ▼
┌─────────────────┐
│ 4. EXECUTE      │ Generated SQL → database → results
│                 │ (with a guardrail: only SELECT, no DROP/ALTER)
└────────┬────────┘
         ▼
┌─────────────────┐
│ 5. ANSWER       │ Results + retrieved context → natural language
│                 │ answer, citing the source chunks
└─────────────────┘
```

## Files

| File | Purpose | TODO |
|------|---------|------|
| `ingest.py` | Read schema docs → chunk → embed → load into vector store | Fill in |
| `retrieve.py` | Embed a question, search the vector store, return top-k | Fill in |
| `prompt.py` | Build the grounded prompt from retrieved context + question | Fill in |
| `answer.py` | Run SQL, format results, attach source citations | Fill in |
| `client.py` | Main entry point: question → answer, wires the 5 steps | Fill in |

## Guardrails to build in (non-negotiable)

- Only `SELECT` statements reach the database. No `DROP`, `ALTER`, `INSERT`, `UPDATE`, `DELETE`.
- SQL is wrapped in a read-only database user with limited permissions.
- If retrieval returns no relevant chunks, say so rather than hallucinating a query.
- Every answer cites which chunks it was grounded in.

## Dependencies (install when starting)

- `openai` or your preferred LLM client
- `chromadb` or `pgvector` (vector store)
- `sqlalchemy` (SQL abstraction, optional but helpful)
- `sentence-transformers` or OpenAI embeddings (embedding model)