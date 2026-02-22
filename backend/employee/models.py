from django.db import models
from uuid import uuid4


class Employee(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.full_name} ({self.department})"


class Attendance(models.Model):
    STATUS_CHOICES = (
        ("Present", "Present"),
        ("Absent", "Absent")
    )

    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name="attendances"
    )
    date = models.DateField()
    status = models.CharField(
        default="Absent",
        choices=STATUS_CHOICES,
        max_length=20
    )

    class Meta:
        unique_together = ("employee", 'date')

    def __str__(self):
        return f"{self.employee.full_name} - {self.status} ({self.date})"
