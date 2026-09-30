# Prepaid Top-Up & Billing System

Backend-focused business application built with **Java 21 and Spring Boot**, with a React + TypeScript frontend.

The project simulates a prepaid telecommunications system where customers can be assigned SIM cards and perform prepaid top-ups.

The main focus of the project is **backend development, REST API design, persistence, validation, transaction handling and automated testing**.

---

## Overview

The application is developed as a **modular monolith** with a clear separation between the backend and frontend.

### Domain model

```text
Customer
   │
   └── 1:N → SimCard
                │
                └── 1:N → TopUp
```

### Main functionality

* customer management
* SIM card management
* assigning customers to SIM cards
* SIM card status management
* balance management
* prepaid top-ups
* top-up history
* public quick top-up
* validation of incoming API requests
* business exception handling
* transactional top-up processing
* automated backend tests

---

## Technology Stack

### Backend

* **Java 21**
* **Spring Boot 4.1.1**
* Spring Web
* Spring Data JPA
* Hibernate
* Bean Validation
* PostgreSQL
* Maven

### Testing

* JUnit
* Mockito
* Spring MVC Test
* Spring Boot Test
* integration testing

### Code Quality

* Spotless
* Google Java Format
* SpotBugs

### Frontend

* React
* TypeScript
* Vite
* React Router
* Bootstrap

---

## Architecture

The application follows a layered architecture:

```text
REST Controller
      ↓
Service Layer
      ↓
Repository Layer
      ↓
JPA / Hibernate
      ↓
PostgreSQL
```

The frontend communicates with the backend through the REST API:

```text
React / TypeScript
        ↓
    REST API
        ↓
Spring Boot
        ↓
PostgreSQL
```

The backend is the main focus of the project. The frontend provides the administrative interface and public top-up functionality.

---

## REST API

Current API endpoints include:

### Customers

```text
GET    /api/customers
POST   /api/customers
PUT    /api/customers/{id}
DELETE /api/customers/{id}
```

### SIM Cards

```text
GET    /api/sim-cards
POST   /api/sim-cards
PUT    /api/sim-cards/{id}
DELETE /api/sim-cards/{id}
```

### Top-ups

```text
GET  /api/sim-cards/{id}/top-ups
POST /api/sim-cards/{id}/top-ups
POST /api/top-ups
```

The last endpoint provides the public quick top-up functionality.

---

## Validation and Error Handling

The backend uses Bean Validation for request validation.

Examples include:

* required fields
* phone number format
* valid SIM card status
* non-negative balance
* valid dates
* valid top-up amount

Business errors are represented by dedicated exceptions and mapped to appropriate HTTP status codes.

Examples:

```text
400 Bad Request
404 Not Found
409 Conflict
```

The frontend uses a centralized API layer for HTTP and connection errors.

---

## Transactions

Top-up processing is transactional.

A top-up operation updates:

1. SIM card balance
2. top-up transaction history

Both operations belong to the same transaction.

If saving the top-up transaction fails, the balance update is rolled back.

This behavior is covered by integration testing.

---

## Testing

The backend contains unit, controller and integration tests.

Current tests cover, among other things:

* service logic
* REST controllers
* request validation
* duplicate phone numbers
* top-up processing
* public top-ups
* top-up history
* transaction rollback

The project is continuously checked using:

```bash
./mvnw test
```

Code formatting:

```bash
./mvnw spotless:check
```

Static analysis:

```bash
./mvnw spotbugs:check
```

Full verification:

```bash
./mvnw clean verify
```

---

## Project Structure

```text
topup-system/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── pl/dbm/topupsystem/
│   │   │   │       ├── config/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── entity/
│   │   │   │       ├── enums/
│   │   │   │       ├── exception/
│   │   │   │       ├── repository/
│   │   │   │       └── service/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── form/
    │   ├── pages/
    │   ├── services/
    │   └── types/
    └── package.json
```

---

## Running the Project

### Backend

Requirements:

* Java 21
* PostgreSQL

Configure the database connection in:

```text
backend/src/main/resources/application.properties
```

An example configuration is available in:

```text
backend/src/main/resources/application.example.properties
```

Start the backend:

```bash
cd backend
./mvnw spring-boot:run
```

The backend runs by default on:

```text
http://localhost:8081
```

### Frontend

Requirements:

* Node.js
* npm

Install dependencies:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs by default on:

```text
http://localhost:5173
```

---

## Development Roadmap

The project is intentionally developed incrementally.

Planned backend improvements include:

* Spring Boot Actuator
* Spring Security
* authentication and authorization
* role-based access control
* security tests
* audit logging
* pagination and sorting
* GitHub Actions CI
* deployment automation

Deployment will be addressed separately using a cloud-based setup for the Spring Boot backend, PostgreSQL database and React frontend.

---

## Project Goals

This project is primarily a practical demonstration of:

* Java backend development
* Spring Boot
* REST API design
* JPA / Hibernate
* PostgreSQL
* business logic
* validation
* exception handling
* transactions
* automated testing
* code quality
* frontend/backend integration

The project is developed as a learning and portfolio project with an emphasis on writing maintainable backend code and testing business behavior.

---

## Author

**Artur Malinowski - Software Engineer**

Developed as a practical full-stack Java/Spring Boot project with React and TypeScript.
