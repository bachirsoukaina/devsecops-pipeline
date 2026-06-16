# ⚠️ Étape 1 - Build avec Maven (version vulnérable)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# ⚠️ Étape 2 - Image de base vulnérable (Trivy détectera)
FROM ubuntu:16.04

# ⚠️ OpenSSL vulnérable (Trivy détectera)
RUN apt-get update && apt-get install -y \
    openssl=1.0.2g \
    openjdk-21-jre-headless \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /app/target/demo-app-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]