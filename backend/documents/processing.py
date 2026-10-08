from .models import Document, Clause
from .text_extraction import extract_text
from .clause_splitter import split_into_clauses
from .ai_explainer import explain_clauses_batch


def process_document(document_id):
    try:
        document = Document.objects.get(id=document_id)
        document.status = 'processing'
        document.save(update_fields=['status'])

        text = extract_text(document.file.path)
        clause_texts = split_into_clauses(text)
        ai_results = explain_clauses_batch(clause_texts)

        for i, (clause_text, ai_result) in enumerate(zip(clause_texts, ai_results)):
            Clause.objects.create(
                document=document,
                order=i,
                text=clause_text,
                explanation=ai_result['explanation'],
                is_flagged=ai_result['is_flagged'],
                flag_reason=ai_result['flag_reason'],
            )

        document.status = 'completed'
        document.save(update_fields=['status'])
    except Exception:
        Document.objects.filter(id=document_id).update(status='failed')
        raise