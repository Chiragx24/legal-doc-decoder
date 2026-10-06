import json
from pathlib import Path
from django.core.management.base import BaseCommand
from sentence_transformers import SentenceTransformer
from documents.models import LawChunk


class Command(BaseCommand):
    help = "Loads law_corpus.json into the LawChunk table with embeddings"

    def handle(self, *args, **options):
        data_path = Path(__file__).resolve().parent.parent.parent / 'data' / 'law_corpus.json'
        with open(data_path, 'r', encoding='utf-8') as f:
            entries = json.load(f)

        model = SentenceTransformer('all-MiniLM-L6-v2')

        for entry in entries:
            embedding = model.encode(entry['text']).tolist()
            LawChunk.objects.update_or_create(
                source_act=entry['source_act'],
                section_number=entry['section_number'],
                defaults={
                    'text': entry['text'],
                    'embedding': embedding,
                }
            )
            self.stdout.write(f"Loaded: {entry['source_act']} - {entry['section_number']}")

        self.stdout.write(self.style.SUCCESS(f"Done. Loaded {len(entries)} law chunks."))