FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean install -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app

# Install LibreOffice headless (for DOCX -> PDF) + fonts so text renders correctly.
# libreoffice-writer pulls in just the Writer component instead of the full suite,
# keeping the image smaller. fonts-liberation gives decent Word-compatible font substitutes.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libreoffice-writer \
        fonts-liberation \
        fonts-dejavu \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]