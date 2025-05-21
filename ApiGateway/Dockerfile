FROM maven:3.9.9-amazoncorretto-17 as build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src

RUN mvn clean compile package -DskipTests

FROM openjdk:23 as runner
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT [ "java" , "-jar" , "app.jar" ]

EXPOSE 8080