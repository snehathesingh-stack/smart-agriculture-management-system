# 🌾 Smart Agriculture System

A full-stack Smart Agriculture web application built with React (frontend) and Spring Boot (backend), with MySQL database.

---

## 🗂️ Project Structure

```
smart-agriculture-system/
├── frontend/          ← React app (port 3000)
│   └── src/
│       ├── pages/
│       │   ├── Login.js
│       │   ├── Signup.js
│       │   ├── FarmerDashboard.js
│       │   └── AdminDashboard.js
│       └── App.js
├── backend/           ← Spring Boot app (port 8081)
│   ├── src/main/java/com/smartagri/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── config/
│   │   └── security/
│   ├── src/main/resources/application.properties
│   └── pom.xml
├── database/
│   └── schema.sql
├── docs/
│   └── SCMP_Report.docx
└── tests/
    └── App.test.js
```

---

## ⚙️ Setup Instructions

### Step 1 — MySQL Database
Open MySQL Workbench or terminal and run:
```sql
CREATE DATABASE smart_agri;
```

### Step 2 — Start Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
Backend runs at: http://localhost:8081

**First time only — seed admin user:**
Open browser → http://localhost:8081/auth/seed

### Step 3 — Start Frontend (React)
```bash
cd frontend
npm install
npm start
```
Frontend runs at: http://localhost:3000

---

## 👤 Login Credentials

| Role   | Username | Password  |
|--------|----------|-----------|
| Admin  | admin    | admin123  |
| Farmer | (created during signup) | (your password) |

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | Login (farmer or admin) |
| POST | /auth/signup | Register new farmer account |
| GET  | /auth/seed | Create admin user (run once) |
| GET  | /farmers | Get all farmers |
| POST | /farmers | Add farmer |
| DELETE | /farmers/{id} | Delete farmer |
| GET  | /crops/{farmerId} | Get crops for a farmer |
| POST | /crops/{farmerId} | Add crop for a farmer |
| GET  | /weather/{city} | Get weather for a city |
| GET  | /suggestions/{soilType} | Get crop suggestions |
| GET  | /dashboard | Admin stats |

---

## 🛠️ SCM Tools Used
- **GitHub** — Version control, branching, pull requests
- **VS Code / IntelliJ** — IDE
- **Maven** — Build tool
- **MySQL** — Database
- **Postman** — API testing

---

## 🌿 GitHub Branch Strategy

| Branch | Purpose |
|--------|---------|
| main | Production-ready code |
| feature/farmer-login | Farmer login & signup |
| feature/crop-management | Crop add & tracking |
| feature/admin-dashboard | Admin panel |
| feature/weather-api | Weather integration |
| feature/yield-calculator | Yield & revenue calc |
