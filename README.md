# Prepaid Top-Up & Billing System

A modular web application for managing prepaid SIM cards, customers and top-up transactions.

The project was created as a practical full-stack Java/Spring Boot application with React and TypeScript. It focuses on REST API design, persistence, validation, transaction handling and automated testing.

## Features

### Administration

* Dashboard
* Customer management
* SIM card management
* Assigning SIM cards to customers
* SIM card status management
* SIM card top-up history
* Overview of all top-up transactions
* Create, update and delete operations
* Validation and error handling

### Public

* Quick prepaid top-up
* Phone number validation
* Top-up amount validation
* Support for active/inactive SIM cards
* Success and error messages

### Backend

* REST API
* Spring Boot
* Spring Data JPA
* Hibernate
* PostgreSQL
* DTO-based request validation
* Centralized exception handling
* Transaction management
* Unique phone number constraint
* CORS configuration

### Frontend

* React
* TypeScript
* Vite
* React Router
* Bootstrap
* Reusable components
* API service layer
* Form validation
* Loading and error states

---

## Technology Stack

### Backend

* Java 21
* Spring Boot 4.1.1
* Spring Web
* Spring Data JPA
* Hibernate
* Spring Validation
* Thymeleaf
* PostgreSQL
* Maven

### Frontend

* React
* TypeScript
* Vite
* React Router
* Bootstrap 5

### Testing and code quality

* JUnit
* Mockito
* Spring Boot Test
* Spring MVC Test
* Spotless
* SpotBugs

---

## Architecture

The application is structured as a modular monolith.

```text
topup-system/
│
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
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.example.properties
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

### Backend flow

```text
HTTP Request
     ↓
Controller
     ↓
DTO / Validation
     ↓
Service
     ↓
Repository
     ↓
JPA / Hibernate
     ↓
PostgreSQL
```

The service layer contains the main business logic, while controllers are responsible for handling HTTP requests and responses.

---

## Domain Model

The main entities are:

```text
Customer
   │
   │ 1
   │
   └─────── * SimCard
                │
                │ 1
                │
                └─────── * TopUp
```

A customer can have multiple SIM cards.

A SIM card can have multiple top-up transactions.

Each top-up belongs to exactly one SIM card.

### SIM card statuses

```text
ACTIVE
BLOCKED
DEACTIVATED
```

Only active SIM cards can be topped up.

---

## API

### System

```http
GET /api
```

Returns basic API information and available endpoints.

### SIM cards

```http
GET    /api/sim-cards
POST   /api/sim-cards
PUT    /api/sim-cards/{id}
DELETE /api/sim-cards/{id}
```

### Customers

```http
GET    /api/customers
POST   /api/customers
PUT    /api/customers/{id}
DELETE /api/customers/{id}
```

### Top-ups

```http
POST /api/sim-cards/{id}/top-ups
GET  /api/sim-cards/{id}/top-ups
```

Public quick top-up:

```http
POST /api/top-ups
```

Example request:

```json
{
  "phoneNumber": "+48123456789",
  "amount": 30.00
}
```

---

## Validation and Error Handling

The API validates incoming requests using Jakarta Bean Validation.

Examples include:

* required fields
* phone number format
* non-negative SIM balance
* valid SIM status
* valid date
* minimum top-up amount

The API returns appropriate HTTP status codes for common error conditions.

Examples:

```text
400 Bad Request
404 Not Found
409 Conflict
```

Example duplicate phone number response:

```json
{
  "status": 409,
  "message": "Numer telefonu jest już przypisany do karty SIM."
}
```

---

## Transactions

Top-up operations are transactional.

A successful top-up:

```text
1. Find SIM card
2. Verify SIM status
3. Increase balance
4. Save balance
5. Create top-up transaction
6. Save transaction
```

If saving the transaction fails, the transaction is rolled back so that the SIM card balance is not updated independently.

---

## Testing

The project contains unit, controller and integration tests.

The test suite covers, among other things:

* service logic
* REST controllers
* request validation
* customer operations
* SIM card operations
* top-up operations
* public top-ups
* transaction rollback
* top-up history

Run tests:

```powershell
.\mvnw clean test
```

---

## Code Quality

The project uses Spotless for Java code formatting and SpotBugs for static analysis.

Check formatting:

```powershell
.\mvnw spotless:check
```

Apply formatting:

```powershell
.\mvnw spotless:apply
```

Run SpotBugs:

```powershell
.\mvnw spotbugs:check
```

---

## Running the Backend

### Requirements

* Java 21
* PostgreSQL
* Maven Wrapper included in the repository

Create a PostgreSQL database:

```text
topup_system
```

Copy the example configuration:

```text
backend/src/main/resources/application.example.properties
```

to:

```text
backend/src/main/resources/application.properties
```

and configure the local PostgreSQL connection.

The local `application.properties` file is intentionally excluded from Git because it contains environment-specific configuration.

Start the backend:

```powershell
cd backend
.\mvnw spring-boot:run
```

The backend runs by default on:

```text
http://localhost:8081
```

---

## Running the Frontend

Install dependencies:

```powershell
cd frontend
npm install
```

Start the development server:

```powershell
npm run dev
```

The frontend runs by default on:

```text
http://localhost:5173
```

The frontend communicates with the backend through the configured `VITE_API_URL`.

---

## Environment Configuration

Example backend configuration is provided in:

```text
backend/src/main/resources/application.example.properties
```

Local configuration should not be committed.

Frontend environment-specific configuration should be provided through Vite environment variables.

---

## Project Status

This project is a completed portfolio application demonstrating full-stack development with Java/Spring Boot and React/TypeScript.

The application is intentionally kept within a focused scope rather than implementing a full commercial telecom billing platform.

Future development may include authentication, role-based access control, external payment integration, monitoring and deployment automation.

---

## Author

**Artur Malinowski - Software Engineer**

Developed as a practical full-stack Java/Spring Boot project with React and TypeScript.
