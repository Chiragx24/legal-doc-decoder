from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Document, Clause
from .models import Document, Clause, Question


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class ClauseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clause
        fields = ['id', 'order', 'text', 'explanation', 'is_flagged', 'flag_reason']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'answer_text', 'law_reference', 'asked_at']
        read_only_fields = ['answer_text', 'law_reference', 'asked_at']


class DocumentSerializer(serializers.ModelSerializer):
    clauses = ClauseSerializer(many=True, read_only=True)

    class Meta:
        model = Document
        fields = ['id', 'file', 'doc_type', 'status', 'uploaded_at', 'clauses']
        read_only_fields = ['uploaded_at', 'status']