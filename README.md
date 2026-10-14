# Prepaid Top-Up & Billing System

A backend-focused prepaid telecommunications application built with **Java 21 and Spring Boot**, with a React and TypeScript frontend.

The application allows administrators to manage customers and SIM cards, review top-up history, and inspect dashboard statistics. Customers can also make a quick top-up without logging in.

The main focus is **backend development, REST API design, persistence, security, validation, transaction handling, auditing and automated testing**.

---

## Overview

The application is developed as a modular monolith with a separate backend and frontend.

### Domain model

```text
Customer
   │
   └── 1:N → SimCard
                │
                └── 1:N → TopUp
```

### Main functionality

- customer management
- SIM card management and customer assignment
- SIM card status and balance management
- paginated SIM card listing
- top-up creation and history
- public quick top-up by phone number
- administrator authentication with JWT
- role-based access control with the `ADMIN` role
- audit logging for business operations
- dashboard statistics from the database
- request validation and business error handling
- transactional top-up processing
- automated backend tests

---

## Technology Stack

### Backend

- Java 21
- Spring Boot 4.1.1
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate
- Bean Validation
- PostgreSQL
- Apache Kafka for asynchronous top-up events
- Maven

### Testing

- JUnit
- Mockito
- Spring MVC Test
- Spring Boot Test
- unit, controller and integration testing

### Code Quality

- Spotless
- Google Java Format
- SpotBugs

### Frontend

- React
- TypeScript
- Vite
- React Router
- Bootstrap

### Local infrastructure

- Docker
- Docker Compose

---

## Architecture

The backend follows a layered architecture:

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

Top-up events are published to Kafka after the database transaction commits. A Kafka consumer reads the `topup.created` topic and logs the received event. This demonstrates asynchronous event processing; the database transaction remains the source of truth for the top-up.

The backend contains the application’s business logic. The frontend provides the administrative interface and public top-up form.

---

## Security

The administrative API uses stateless authentication with JWT access tokens and the `ADMIN` role.

- `POST /api/auth/login` authenticates an administrator and returns a JWT.
- Protected API requests use the `Authorization: Bearer <token>` header.
- `POST /api/top-ups` is available without authentication for public quick top-ups.
- The API index and the Actuator health endpoint are also public.
- The initial administrator is created from local configuration if no administrator account exists.

Configure these Spring properties in your local environment or IDE run configuration:

```text
app.bootstrap-admin.username
app.bootstrap-admin.password
security.jwt.secret
```

The JWT secret must be Base64-encoded and decode to at least 32 bytes. Do not commit real passwords, secrets or local environment files.

Access tokens expire after 30 minutes.

---

## REST API

Unless otherwise indicated, `/api/**` endpoints require an authenticated user with the `ADMIN` role.

### Public endpoints

```text
GET  /api/
POST /api/auth/login
POST /api/top-ups
GET  /actuator/health
```

`POST /api/top-ups` performs a public quick top-up using a phone number and amount.

### Customers

```text
GET    /api/customers
POST   /api/customers
PUT    /api/customers/{id}
DELETE /api/customers/{id}
```

### SIM cards

```text
GET    /api/sim-cards
POST   /api/sim-cards
PUT    /api/sim-cards/{id}
DELETE /api/sim-cards/{id}
```

The SIM card listing is paginated. Page numbers start at `0`; the default page size is `10`.

Example:

```text
GET /api/sim-cards?page=0&size=10&sort=id,desc
```

### Top-ups

```text
GET    /api/sim-cards/{id}/top-ups
POST   /api/sim-cards/{id}/top-ups
DELETE /api/top-ups/{id}
```

`POST /api/sim-cards/{id}/top-ups` creates an administrator-initiated top-up for a SIM card.

### Dashboard

```text
GET /api/dashboard/summary
```

Returns database-backed summary statistics, including SIM card counts, customer count, monthly top-up volume and the number of top-ups created today.

### Audit log

```text
GET /api/audit-logs
```

Returns a paginated, read-only history of audited operations. The default page size is `20`, sorted by event time in descending order.

---

## Validation and Error Handling

The backend uses Bean Validation for incoming requests.

Validation includes, among other things:

- required fields
- phone number format
- valid SIM card status
- non-negative balance
- valid dates
- valid top-up amount

Business errors are represented by dedicated exceptions and mapped to appropriate HTTP status codes, such as:

```text
400 Bad Request
404 Not Found
409 Conflict
```

The frontend uses a centralized API layer to handle HTTP and connection errors.

---

## Transactions and Audit Logging

Top-up processing is transactional. A top-up operation updates:

1. the SIM card balance
2. the top-up history
3. the audit log

These changes are performed within the same transaction. If saving the top-up or audit record fails, the transaction is rolled back.

Audit entries record relevant customer, SIM card and top-up operations.

## Kafka

The backend publishes a `TopUpCreatedEvent` after a top-up transaction commits. The event is sent to the `topup.created` Kafka topic. A consumer logs received events, for example with the message `Odebrano doładowanie`.

When the backend runs directly from the IDE, it connects to Kafka at `localhost:9092`. When the application runs through the combined Docker Compose setup, the backend connects to Kafka at `kafka:19092` over the Compose network.

---

## Testing and Code Quality

Run the backend tests:

```bash
cd backend
./mvnw test
```

Check Java formatting:

```bash
./mvnw spotless:check
```

Run static analysis:

```bash
./mvnw spotbugs:check
```

Run Maven verification:

```bash
./mvnw clean verify
```

On Windows PowerShell, use `.\mvnw.cmd` instead of `./mvnw`.

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
├── compose.yaml
├── compose.kafka.yaml
├── docker.env.example
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

The project can be run locally from the IDE or as a Docker Compose stack. These modes use separate PostgreSQL databases:

- Local backend: PostgreSQL at `localhost:5432`.
- Docker Compose backend: PostgreSQL in the `db` container, exposed to the host at `localhost:5433`.

The Docker database is persisted in the `postgres_data` volume. It starts empty and is independent of the local PostgreSQL database. Creating or updating data in one database does not change the other.

### Backend

Requirements:

- Java 21
- PostgreSQL

Configure the database connection and local security properties. An example configuration is available at:

```text
backend/src/main/resources/application.example.properties
```

Do not commit real credentials or secret keys.

Start the backend:

```bash
cd backend
./mvnw spring-boot:run
```

The backend runs by default at:

```text
http://localhost:8081
```

When running the backend from the IDE, ensure PostgreSQL is available on port `5432` and Kafka is available on `localhost:9092`. Provide the administrator credentials and JWT secret through environment variables or the IDE run configuration. Do not commit real credentials or secrets.

### Frontend

Requirements:

- Node.js
- npm

Install dependencies and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs by default at:

```text
http://localhost:5173
```

### Docker Compose

Requirements:

- Docker Desktop with the Linux container engine running
- a local `docker.env` file based on `docker.env.example`

Set the PostgreSQL, administrator and JWT values in `docker.env`. Keep this file private and do not commit it. Start the full application, including PostgreSQL and Kafka, from the project root:

```powershell
docker compose --env-file docker.env -f compose.yaml -f compose.kafka.yaml up -d --build
```

Check container status:

```powershell
docker compose --env-file docker.env -f compose.yaml -f compose.kafka.yaml ps
```

View backend logs, including Kafka consumer messages:

```powershell
docker compose --env-file docker.env -f compose.yaml -f compose.kafka.yaml logs -f backend
```

The application is available at `http://localhost:5173`; the API is at `http://localhost:8081`. PostgreSQL is exposed on host port `5433` for database tools such as pgAdmin. Connect to `localhost:5433` using the database name, user and password from `docker.env`.

Stop and remove the containers while preserving the Docker database volume:

```powershell
docker compose --env-file docker.env -f compose.yaml -f compose.kafka.yaml down
```

Do not add `-v` if you want to keep the Docker database data. To start the stack again, run the `up -d` command above; omit `--build` unless the application code or Docker configuration has changed.

---

## Development Roadmap

The project is developed incrementally. Completed infrastructure and backend work includes Docker Compose, PostgreSQL in a container, Kafka top-up events and a Kafka consumer. Planned learning stages include:

- AWS deployment, beginning with the existing Docker Compose application
- moving the database to Amazon RDS and containers to managed AWS services
- Kubernetes after the AWS deployment stage
- GitHub Actions CI and deployment automation
- a package catalog backed by the database
- additional dashboard metrics backed by persisted data

---

## Project Goals

This project demonstrates practical use of:

- Java and Spring Boot
- REST API design
- Spring Security and JWT
- JPA / Hibernate and PostgreSQL
- business logic and validation
- exception handling and transactions
- audit logging
- pagination
- automated testing and code quality tools
- frontend/backend integration

The project is developed as a learning and portfolio application, with an emphasis on maintainable backend code and tested business behavior.

---

## Author

**Artur Malinowski - Software Engineer**

Developed as a practical full-stack Java/Spring Boot project with React and TypeScript.
