import json
from .rag_search import find_relevant_law
from .ai_explainer import get_groq_client, strip_code_fences


def answer_question(document, question_text):
    clauses = document.clauses.all().order_by('order')
    clause_context = "\n\n".join(
        f"Clause {c.order + 1}: {c.text}" for c in clauses
    )

    law_chunks = find_relevant_law(question_text, top_n=2)
    law_context = "\n\n".join(
        f"{chunk.source_act}, {chunk.section_number}: {chunk.text}"
        for chunk in law_chunks
    )

    prompt = f"""You are answering a question about a legal document for someone with no legal background.

    The document's clauses (this is the actual agreement the person signed — the source of truth for what THEIR document says):
    {clause_context}

    Relevant law (general background only — this is NOT necessarily what this specific document says):
    {law_context}

    Question: {question_text}

    First check whether the document's clauses actually address this question.
    - If they do, answer based on what the document says, and mention the relevant law for comparison if it's useful.
    - If the document's clauses do NOT address this question, say so clearly (e.g. "Your document doesn't specify this"), and only then separately explain what the law generally requires — never present the general law as if it were a term written in this document.

    Reply with ONLY a JSON object in this exact shape, no other text:
    {{
      "answer_text": "a short, plain-language answer, 2-4 sentences, clearly distinguishing what the document itself says from general legal background",
      "law_reference": "the specific act and section this answer is based on, e.g. 'Model Tenancy Act, 2021 - Section 11', or an empty string if no specific law applies"
    }}"""

    client = get_groq_client()
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )

    raw_text = strip_code_fences(response.choices[0].message.content)

    try:
        result = json.loads(raw_text)
    except json.JSONDecodeError:
        result = {
            "answer_text": raw_text,
            "law_reference": "",
        }

    return result