from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer
from uuid import UUID


class EmployeeListCreateView(APIView):

    def get(self, request):
        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        email = request.data.get('email')
        if Employee.objects.filter(email=email).exists():
            return Response(
                {"error": "Employee with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = EmployeeSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmployeeDeleteView(APIView):

    def delete(self, request, pk):
        try:
            employee = Employee.objects.get(pk=pk)
            employee.delete()
            return Response(
                {"success": "Employee deleted successfully"},
                status=status.HTTP_200_OK
            )

        except Employee.DoesNotExist:
            return Response(
                {"error": "Employee not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class AttendanceViews(APIView):

    def get(self, request):
        employee_id = request.query_params.get("employee_id")

        if employee_id:
            UUID(employee_id)
            attendance = Attendance.objects.filter(employee__id=employee_id)
        else:
            attendance = Attendance.objects.all()

        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = AttendanceSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
