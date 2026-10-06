import json
import os
from groq import Groq
from .rag_search import find_relevant_law

_client = None

def get_groq_client():
    global _client
    if _client is None:
        _client = Groq(api_key=os.environ.get('GROQ_API_KEY'))
    return _client


def strip_code_fences(text):
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        text = "\n".join(lines)
    return text.strip()


def explain_clause(clause_text):
    law_chunks = find_relevant_law(clause_text, top_n=2)

    law_context = "\n\n".join(
        f"{chunk.source_act}, {chunk.section_number}: {chunk.text}"
        for chunk in law_chunks
    )

    prompt = f"""You are explaining a clause from a legal document to someone with no legal background.

Clause:
\"\"\"{clause_text}\"\"\"

Relevant law (use this only as background context, not as a strict pass/fail checklist):
{law_context}

Decide whether to flag this clause. Only flag it if a reasonable person would consider it a genuinely bad deal — for example, an amount or penalty that breaks a hard legal cap, a term that is unusually one-sided, or something matching a known unfair pattern. Do NOT flag ordinary administrative details like a normal refund processing window, standard notice periods, or small wording differences from the law's exact phrasing — these are common in real-world agreements and do not actually disadvantage the signer.

Example: a clause saying a deposit is "refundable within 30 days of vacating" should NOT be flagged, even though the law says deposits should be refunded immediately on vacating — a 30-day processing window is normal, common practice and doesn't harm the tenant.

Example: a clause demanding a deposit of 8 months' rent SHOULD be flagged, because it clearly exceeds the legal cap and is a real financial burden on the tenant.

Reply with ONLY a JSON object in this exact shape, no other text:
{{
  "explanation": "a short, plain-language explanation of what this clause means, 2-3 sentences",
  "is_flagged": true or false (true only for genuinely unfavorable clauses, not minor wording or timing differences),
  "flag_reason": "if flagged, a short plain-language reason why; if not flagged, an empty string"
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
            "explanation": raw_text,
            "is_flagged": False,
            "flag_reason": "",
        }

    return result