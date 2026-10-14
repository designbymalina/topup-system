FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app

RUN useradd --system --uid 10001 appuser

COPY --from=build --chown=appuser:appuser \
    /app/target/topup-system-0.0.1-SNAPSHOT.jar \
    /app/app.jar

USER appuser

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
