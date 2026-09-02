"""
ingest.py — Step 1 of the SQL Analytics Assistant RAG pipeline.

Reads schema documentation, chunks it, embeds the chunks, and loads them
into a vector store so the retrieval step can find relevant context for a
user's question.

TODO: implement each function in order.
"""

# TODO: pick a vector store. ChromaDB is the easiest local option;
#       pgvector lets you keep everything in Postgres.
#       pip install chromadb
import chromadb

# TODO: pick an embedding model. OpenAI text-embedding-3-small is cheap
#       and good. For a local option: sentence-transformers/all-MiniLM-L6-v2.
#       pip install openai
from openai import OpenAI

# TODO: source documents. These are the files that describe your database:
#       - schema.sql (tables, columns, types, relationships)
#       - data_dictionary.md (what each column actually means in business terms)
#       - sample_queries.md (real queries people have asked before)
#       - business_rules.md (filters, calculations, conventions)
SOURCE_DOCS = [
    "docs/schema.sql",
    "docs/data_dictionary.md",
    "docs/sample_queries.md",
    "docs/business_rules.md",
]

# TODO: chunking strategy. Overlap matters — a table name at the end of one
#       chunk should survive into the next. Target ~500 tokens per chunk
#       with ~50 token overlap.
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50


def read_source(path: str) -> str:
    """Read a source document file and return its text."""
    # TODO: handle missing files gracefully — skip, don't crash.
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def chunk_text(text: str, chunk_size: int, overlap: int) -> list[str]:
    """Split text into overlapping chunks."""
    # TODO: implement. A simple character-based splitter is fine to start;
    #       upgrade to a token-aware one later.
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end])
        start = end - overlap
    return chunks


def embed(chunks: list[str]) -> list[list[float]]:
    """Embed each chunk using the chosen embedding model."""
    # TODO: call your embedding endpoint. Batch the chunks.
    client = OpenAI()
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=chunks,
    )
    return [item.embedding for item in response.data]


def load_into_store(chunks: list[str], embeddings: list[list[float]]) -> None:
    """Insert chunks + embeddings into the vector store."""
    # TODO: create a collection, add the chunks with their embeddings.
    client = chromadb.Client()
    collection = client.get_or_create_collection("sql_schema")
    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=[f"chunk-{i}" for i in range(len(chunks))],
    )


def main() -> None:
    """Run the full ingest: read → chunk → embed → store."""
    for path in SOURCE_DOCS:
        text = read_source(path)
        chunks = chunk_text(text, CHUNK_SIZE, CHUNK_OVERLAP)
        embeddings = embed(chunks)
        load_into_store(chunks, embeddings)
        print(f"Ingested {len(chunks)} chunks from {path}")


if __name__ == "__main__":
    main()