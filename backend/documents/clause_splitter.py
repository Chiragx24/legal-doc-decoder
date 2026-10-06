import re


def split_into_clauses(text):
    numbered_matches = find_numbered_clauses(text)

    if len(numbered_matches) >= 2:
        return split_by_numbering(text, numbered_matches)
    else:
        return split_by_paragraphs(text)


def find_numbered_clauses(text):
    pattern = re.compile(r'^\s*(\d{1,2})[\.\)]\s+', re.MULTILINE)
    return list(pattern.finditer(text))


def split_by_numbering(text, matches):
    clauses = []
    for i, match in enumerate(matches):
        start = match.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        clause_text = text[start:end].strip()
        if clause_text:
            clauses.append(clause_text)
    return clauses


def split_by_paragraphs(text):
    paragraphs = text.split('\n\n')
    return [p.strip() for p in paragraphs if p.strip()]