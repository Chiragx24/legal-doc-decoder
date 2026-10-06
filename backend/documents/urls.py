from django.urls import path
from .views import RegisterView, LoginView, DocumentListCreateView, DocumentDetailView, AskDocumentQuestionView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('documents/', DocumentListCreateView.as_view(), name='document-list'),
    path('documents/<int:pk>/', DocumentDetailView.as_view(), name='document-detail'),
    path('documents/<int:pk>/ask/', AskDocumentQuestionView.as_view(), name='document-ask'),
]