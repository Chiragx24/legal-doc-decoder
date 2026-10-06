from django.contrib import admin
from .models import Document, Clause, Question, LawChunk

admin.site.register(Document)
admin.site.register(Clause)
admin.site.register(Question)
admin.site.register(LawChunk)