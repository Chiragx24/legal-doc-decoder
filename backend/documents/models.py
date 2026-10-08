from django.db import models
from django.contrib.auth.models import User
from pgvector.django import VectorField


class Document(models.Model):
    DOC_TYPE_CHOICES = [
        ('rental', 'Rental Agreement'),
        ('offer_letter', 'Offer Letter'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to='documents/')
    doc_type = models.CharField(max_length=20, choices=DOC_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.doc_type} - {self.user.username}"


class Clause(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='clauses')
    order = models.PositiveIntegerField(default=0)
    text = models.TextField()
    explanation = models.TextField(blank=True)
    is_flagged = models.BooleanField(default=False)
    flag_reason = models.TextField(blank=True)

    def __str__(self):
        return f"Clause {self.order} - {self.document}"


class Question(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    answer_text = models.TextField(blank=True)
    law_reference = models.CharField(max_length=255, blank=True)
    asked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question_text[:50]


class LawChunk(models.Model):
    source_act = models.CharField(max_length=255)
    section_number = models.CharField(max_length=50)
    text = models.TextField()
    embedding = VectorField(dimensions=384, null=True, blank=True)

    def __str__(self):
        return f"{self.source_act} - Section {self.section_number}"