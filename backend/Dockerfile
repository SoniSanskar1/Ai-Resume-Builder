FROM eclipse-temurin:17-jdk
WORKDIR /app

COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Find the jar file (replace ai-resume-builder.jar with your actual jar name if needed)
CMD ["java", "-jar", "target/ai-resume-builder-1.0.0.jar"]