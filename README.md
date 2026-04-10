# Hospital Visitation Control and Appointment Management System

A full-stack web application for controlling hospital visits and managing visitor appointments.

## Features

- Book visitor appointments with validation
- Visiting hours enforced: **08:00 AM – 06:00 PM**
- Full validation on both frontend (React) and backend (Spring Boot)
- Admin view of all appointments with delete capability
- SQLite embedded database

## Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | React 18 + Vite               |
| Backend  | Java 17 + Spring Boot 3.x     |
| Database | SQLite (embedded)             |
| Build    | Maven (backend), npm (frontend)|

## Project Structure

```
HMS-/
├── backend/          # Spring Boot REST API
│   ├── pom.xml
│   └── src/main/java/com/hospital/visitation/
│       ├── controller/   AppointmentController.java
│       ├── service/      AppointmentService.java
│       ├── repository/   AppointmentRepository.java
│       ├── model/        Appointment.java
│       ├── dto/          AppointmentRequest.java
│       └── config/       CorsConfig.java
└── frontend/         # React application
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        └── components/
            ├── VisitingHours.jsx
            ├── BookingForm.jsx
            └── AppointmentList.jsx
```

## Running the Application

### Backend

```bash
cd backend
mvn spring-boot:run
# API available at http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm start
# App available at http://localhost:3000
```

## API Endpoints

| Method | Endpoint                   | Description           |
|--------|----------------------------|-----------------------|
| POST   | /api/appointments          | Create appointment    |
| GET    | /api/appointments          | Get all appointments  |
| GET    | /api/appointments/{id}     | Get appointment by ID |
| DELETE | /api/appointments/{id}     | Delete appointment    |

## Validation Rules

- Visit time must be ≥ 08:00 and ≤ 18:00
- Departure time must be ≤ 18:00
- Visit time must be strictly before departure time
- All fields are required
