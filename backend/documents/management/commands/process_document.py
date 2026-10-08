from django.core.management.base import BaseCommand
from documents.processing import process_document


class Command(BaseCommand):
    help = "Processes a single document: extracts text, splits clauses, and gets AI explanations"

    def add_arguments(self, parser):
        parser.add_argument('document_id', type=int)

    def handle(self, *args, **options):
        process_document(options['document_id'])