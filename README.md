# 🌾 Smart Agriculture Management System

A full-stack web application designed to help farmers manage crops, monitor weather conditions, and receive intelligent crop suggestions. The system also provides an admin dashboard for managing farmer data and analytics.

---

## 🚀 Features

* 👨‍🌾 Farmer Dashboard (crop tracking & yield management)
* 🧑‍💼 Admin Dashboard (manage farmers & monitor system)
* 🌦️ Weather API integration for real-time updates
* 🌱 Smart crop suggestions based on soil type
* 📊 Yield calculator for productivity estimation
* 🔐 Secure authentication (Login & Signup)
* 💾 MySQL database integration

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript (ES6)
* CSS

### Backend

* Spring Boot
* Java
* REST APIs

### Database

* MySQL

### Tools & Technologies

* Git & GitHub (Version Control)
* Maven / Gradle (Build Tools)
* Postman (API Testing)
* IntelliJ IDEA / VS Code (IDE)

---

## 📁 Project Structure

```
smart-agriculture-management-system/
├── smart-agri-ui/       # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
│
├── src/                 # Backend (Spring Boot)
│   ├── main/java/com/smartagri/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── entity/
│   │   ├── repository/
│   │   └── config/
│   ├── main/resources/
│   │   └── application.properties
│
├── pom.xml              # Backend dependencies
├── build.gradle         # Gradle config (if used)
├── README.md
```

---

## ⚙️ Setup Instructions

### 🔹 Step 1: Clone Repository

```bash
git clone https://github.com/snehathesingh-stack/smart-agriculture-management-system.git
cd smart-agriculture-management-system
```

---

### 🔹 Step 2: Setup Database (MySQL)

```sql
CREATE DATABASE smart_agri;
```

---

### 🔹 Step 3: Run Backend

```bash
mvn spring-boot:run
```

Backend runs at:
👉 http://localhost:8081

---

### 🔹 Step 4: Run Frontend

```bash
cd smart-agri-ui
npm install
npm start
```

Frontend runs at:
👉 http://localhost:3000

---

## 👤 Login Credentials

| Role   | Username            | Password      |
| ------ | ------------------- | ------------- |
| Admin  | admin               | admin123      |
| Farmer | Register via signup | Your password |

---

## 🔗 API Endpoints

| Method | Endpoint                | Description      |
| ------ | ----------------------- | ---------------- |
| POST   | /auth/login             | Login            |
| POST   | /auth/signup            | Register         |
| GET    | /auth/seed              | Create admin     |
| GET    | /farmers                | Get all farmers  |
| POST   | /farmers                | Add farmer       |
| DELETE | /farmers/{id}           | Delete farmer    |
| GET    | /crops/{farmerId}       | Get crops        |
| POST   | /crops/{farmerId}       | Add crop         |
| GET    | /weather/{city}         | Weather data     |
| GET    | /suggestions/{soilType} | Crop suggestions |

---

## 🌿 Git Workflow

* `main` → Stable production code
* Feature branches for development:

  * `feature/authentication`
  * `feature/farmer-dashboard`
  * `feature/admin-dashboard`
  * `feature/weather-api`

---


## 🚀 Future Enhancements

* 📱 Mobile responsiveness improvements
* 🤖 AI-based crop prediction
* 📊 Advanced analytics dashboard
* ☁️ Cloud deployment (AWS / Vercel)

---

## 👩‍💻 Author

**Sneha Singh**
📧 Connect via GitHub: https://github.com/snehathesingh-stack

---

## ⭐ Acknowledgements

* Spring Boot Documentation
* React Documentation
* OpenWeather API

---

## 📌 Conclusion

This project demonstrates a complete full-stack application integrating frontend, backend, and database technologies to solve real-world agricultural challenges.

---
