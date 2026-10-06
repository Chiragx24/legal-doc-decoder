import pdfplumber


def extract_text(file_path):
    if file_path.endswith('.pdf'):
        return extract_from_pdf(file_path)
    elif file_path.endswith('.txt'):
        return extract_from_txt(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_path}")


def extract_from_pdf(file_path):
    text_parts = []
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n".join(text_parts)


def extract_from_txt(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()