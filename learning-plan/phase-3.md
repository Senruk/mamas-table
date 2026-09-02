# Phase 3 — RAG + LangChain + SQL Analytics Assistant Build

**Status:** not started
**Window:** months 4–6 (dates pending HNC start)
**Goal:** DeepLearning.AI RAG + LangChain done. SQL Analytics Assistant upgraded from hardcoded logic to a real RAG-based tool (vector DB + retrieval pipeline).

---

## 1. DeepLearning.AI short courses — primary

**Status:** [ ] not started

- [ ] DeepLearning.AI — Short Courses: "Retrieval Augmented Generation (RAG) to Power Knowledge-Driven Apps"
  - https://www.deeplearning.ai/short-courses/rag-to-power-knowledge-driven-apps/
  - Covers: chunking, embeddings, vector stores, retrieval, evaluation
- [ ] DeepLearning.AI — Short Courses: "LangChain for LLM Application Development"
  - https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/
  - Covers: chains, agents, tools, memory, evaluation
- [ ] Notes consolidated into a single RAG reference doc (for reuse on client projects)

**Resources:**
- DeepLearning.AI short courses (free audit): https://www.deeplearning.ai/short-courses/

---

## 2. SQL Analytics Assistant — RAG upgrade (the build)

**Status:** [ ] not started
**Scaffold:** `learning-plan/sql-analytics-assistant/` — see `scaffold.md`

The project currently uses hardcoded logic to map questions to SQL queries. Phase 3 replaces that with:

1. **Document ingestion** — schema docs, column descriptions, sample queries, business rules → chunks → embeddings → vector store
2. **Retrieval** — user question → embed → similarity search → top-k relevant chunks
3. **Prompt assembly** — retrieved context + user question + SQL generation instructions → LLM
4. **SQL execution** — generated SQL → database → results
5. **Grounded answer** — results + retrieved context → natural language answer with citations

**Scaffold files** (all with TODO comments, not a finished build):
- `scaffold.md` — architecture overview and the 5-step pipeline
- `ingest.py` — chunk + embed + load into vector store
- `retrieve.py` — similarity search over the vector store
- `prompt.py` — build the grounded prompt template
- `answer.py` — run SQL, format results, cite sources
- `client.py` — main entry point wiring it all together

**Exit criteria for this build:**
- [ ] Vector store populated from schema documentation
- [ ] Question → retrieval → SQL generation works end to end
- [ ] Answers cite the source chunks they came from
- [ ] Falls back gracefully when retrieval finds nothing relevant