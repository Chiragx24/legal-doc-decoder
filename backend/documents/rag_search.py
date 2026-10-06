from sentence_transformers import SentenceTransformer
from pgvector.django import CosineDistance
from .models import LawChunk

_model = None


def get_embedding_model():
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model


def find_relevant_law(clause_text, top_n=3):
    model = get_embedding_model()
    query_embedding = model.encode(clause_text).tolist()

    results = LawChunk.objects.annotate(
        distance=CosineDistance('embedding', query_embedding)
    ).order_by('distance')[:top_n]

    return list(results)