from django.urls import path
from .views import EmployeeListCreateView, EmployeeDeleteView, AttendanceViews

urlpatterns = [
    path('employees/', EmployeeListCreateView.as_view()),
    path('employees/<uuid:pk>/', EmployeeDeleteView.as_view()),
    path('attendances/', AttendanceViews.as_view()),
]
