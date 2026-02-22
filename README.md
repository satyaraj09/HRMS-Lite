# HRMS Lite – HR Management System

![Dashboard](images/image.png)

## Project Overview

**HRMS Lite** is a lightweight Human Resource Management System that allows an admin to:

- Manage employees (add, view, delete)
- Track daily attendance
- View a dashboard with total employees, present and absent counts
- Filter attendance records by date

This project demonstrates full-stack development skills using a **React/Next.js frontend** and **Django REST Framework backend** with **PostgreSQL** database.

## Features

### Employee Management

- Add a new employee with full name, email, and department
- View all employees
- Delete an employee
- Search employees

### Attendance Management

- Mark attendance (Present / Absent)
- View attendance records
- Filter attendance by date

### Dashboard

- Total employees
- Employees present today
- Employees absent today
- Recent employees table

## Tech Stack

| Layer      | Technology                            |
| ---------- | ------------------------------------- |
| Frontend   | React, Next.js, Tailwind CSS          |
| Backend    | Python, Django, Django REST Framework |
| Database   | PostgreSQL                            |
| API Client | Axios                                 |
| Deployment | Docker, Docker Compose                |

## Environment Variables

### Backend (`.env`)

```env
DATABASE_URL=postgres://username:password@host:port/dbname
```

### Frontend (`.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Running Locally (Without Docker)

### Prerequisites

- Node.js (v20+)
- Python 3.13+
- PostgreSQL database
- pip / virtualenv

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver 8000
```

### Frontend Setup

```bash
cd frontend
npm install

npm run dev
```

Access the application:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000/api](http://localhost:8000/api)

---

## Running With Docker Compose

### Prerequisites

- Docker
- Docker Compose

### Steps

1. Clone the repository:

```bash
git clone <your-github-repo-link>
cd HRMS-Lite
```

2. Start services:

```bash
docker compose up --build
```

3. Wait for containers to start. Access the app:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000/api](http://localhost:8000/api)
- Database: `postgres://hrms:hrms123@localhost:5433/hrms_db`

### Notes:

- The first time you run Docker Compose, it will migrate the database and collect static files for Django.
- The frontend is configured to call the backend API using `NEXT_PUBLIC_API_URL`.

---

## Project Structure

```
HRMS-Lite/
├── backend/          # Django backend
│   ├── core/         # Django project
│   ├── employee/     # Django app
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/         # Next.js frontend
│   ├── components/   # UI components
│   ├── app/          # app
│   ├── lib/          # API helper
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Assumptions & Limitations

- Single admin user (no authentication)
- Leave management, payroll, and advanced HR features are out of scope
- Basic validations implemented (required fields, valid email, duplicate employee handling)
- Production-ready UI with Tailwind CSS and reusable components

---

## Bonus Features

- Filter attendance records by date
- Dashboard shows counts of present and absent employees
