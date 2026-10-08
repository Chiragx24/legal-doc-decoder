from rest_framework import generics, permissions
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Document, Clause, Question
from .serializers import RegisterSerializer, DocumentSerializer, QuestionSerializer
from .text_extraction import extract_text
from .clause_splitter import split_into_clauses
from .ai_explainer import explain_clauses_batch
from .qa_engine import answer_question


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'username': user.username})


class LoginView(ObtainAuthToken):
    permission_classes = [permissions.AllowAny]


class DocumentListCreateView(generics.ListCreateAPIView):
    serializer_class = DocumentSerializer

    def get_queryset(self):
        return Document.objects.filter(user=self.request.user).order_by('-uploaded_at')

    def perform_create(self, serializer):
        document = serializer.save(user=self.request.user)
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


class DocumentDetailView(generics.RetrieveAPIView):
    serializer_class = DocumentSerializer

    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)


class AskDocumentQuestionView(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer

    def get_document(self):
        return Document.objects.get(
            id=self.kwargs['pk'],
            user=self.request.user
        )

    def get_queryset(self):
        document = self.get_document()
        return document.questions.all().order_by('-asked_at')

    def perform_create(self, serializer):
        document = self.get_document()
        question_text = serializer.validated_data['question_text']
        ai_result = answer_question(document, question_text)
        serializer.save(
            document=document,
            answer_text=ai_result['answer_text'],
            law_reference=ai_result['law_reference'],
        )