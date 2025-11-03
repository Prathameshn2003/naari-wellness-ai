# NaariCare Backend Setup (Spring Boot + MySQL)

## Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Python 3.9+ (for ML microservice)

## Project Structure

```
naaricare-backend/
├── src/main/java/com/naaricare/
│   ├── NaariCareApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── CorsConfig.java
│   │   └── SwaggerConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── TrackerController.java
│   │   ├── PredictionController.java
│   │   ├── RecommendationController.java
│   │   ├── ResourcesController.java
│   │   ├── DoctorsController.java
│   │   ├── ChatController.java
│   │   └── NotificationController.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── TrackerService.java
│   │   ├── PredictionService.java
│   │   ├── RecommendationService.java
│   │   ├── ResourcesService.java
│   │   ├── DoctorsService.java
│   │   ├── ChatService.java
│   │   └── NotificationService.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── EntryRepository.java
│   │   ├── PredictionRepository.java
│   │   ├── ResourceRepository.java
│   │   ├── DoctorRepository.java
│   │   ├── ChatMessageRepository.java
│   │   └── NotificationRepository.java
│   ├── model/
│   │   ├── User.java
│   │   ├── Entry.java
│   │   ├── Prediction.java
│   │   ├── Resource.java
│   │   ├── Doctor.java
│   │   ├── ChatMessage.java
│   │   └── Notification.java
│   ├── dto/
│   │   ├── SignupRequest.java
│   │   ├── LoginRequest.java
│   │   ├── AuthResponse.java
│   │   └── ... (other DTOs)
│   └── security/
│       ├── JwtTokenProvider.java
│       └── JwtAuthenticationFilter.java
├── src/main/resources/
│   ├── application.properties
│   └── schema.sql
├── pom.xml
└── Dockerfile

naaricare-ml/
├── app/
│   ├── main.py
│   ├── models/
│   │   ├── pcos_model.py
│   │   ├── menopause_model.py
│   │   └── recommendation_engine.py
│   ├── routes/
│   │   ├── predict.py
│   │   └── recommend.py
│   └── utils/
│       └── preprocessing.py
├── requirements.txt
└── Dockerfile
```

## MySQL Schema

```sql
-- Create database
CREATE DATABASE naaricare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE naaricare;

-- Users table
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    location VARCHAR(255),
    role ENUM('user', 'admin', 'clinician') DEFAULT 'user',
    consent_timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Entries table (menstrual tracking)
CREATE TABLE entries (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    entry_date DATE NOT NULL,
    symptoms JSON,
    attachments JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, entry_date)
);

-- Predictions table
CREATE TABLE predictions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    prediction_type ENUM('pcos', 'menopause') NOT NULL,
    input_data JSON NOT NULL,
    output_data JSON NOT NULL,
    model_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_type (user_id, prediction_type)
);

-- Resources table
CREATE TABLE resources (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    body TEXT,
    category VARCHAR(50),
    tags JSON,
    source_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category)
);

-- Doctors table
CREATE TABLE doctors (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    speciality VARCHAR(100),
    contact VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_location (latitude, longitude)
);

-- Chat messages table
CREATE TABLE chat_messages (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    conversation_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    sender ENUM('user', 'assistant') NOT NULL,
    content TEXT NOT NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_conversation (conversation_id, created_at)
);

-- Notifications table
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    payload JSON,
    schedule_timestamp TIMESTAMP,
    status ENUM('pending', 'sent', 'read') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, status)
);
```

## Spring Boot Configuration

### pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>
    
    <groupId>com.naaricare</groupId>
    <artifactId>naaricare-api</artifactId>
    <version>1.0.0</version>
    <name>NaariCare API</name>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- MySQL -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Swagger/OpenAPI -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.2.0</version>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### application.properties
```properties
# Server Configuration
server.port=8080
spring.application.name=naaricare-api

# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/naaricare?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=your-256-bit-secret-key-here-change-in-production
jwt.expiration=86400000

# ML Service Configuration
ml.service.url=http://localhost:8001

# CORS Configuration
cors.allowed-origins=http://localhost:5173,http://localhost:4173

# Swagger Configuration
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
```

## Sample Controller (AuthController.java)

```java
package com.naaricare.controller;

import com.naaricare.dto.*;
import com.naaricare.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    @Operation(summary = "Register new user")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Login user")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }
}
```

## Python ML Service (FastAPI)

### requirements.txt
```
fastapi==0.104.1
uvicorn==0.24.0
scikit-learn==1.3.2
pandas==2.1.3
numpy==1.26.2
joblib==1.3.2
shap==0.43.0
pydantic==2.5.0
```

### main.py
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import joblib
import numpy as np

app = FastAPI(title="NaariCare ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PCOSPredictionRequest(BaseModel):
    features: Dict[str, float]

class MenopausePredictionRequest(BaseModel):
    features: Dict[str, float]

@app.post("/predict/pcos")
async def predict_pcos(request: PCOSPredictionRequest):
    # Load model and predict
    # This is a placeholder - implement actual model loading and prediction
    score = 0.65
    label = "Moderate Risk"
    explanation = {
        "top_features": [
            {"name": "irregular_periods", "impact": 0.35},
            {"name": "weight_gain", "impact": 0.25},
            {"name": "acne", "impact": 0.15}
        ]
    }
    
    return {
        "score": score,
        "label": label,
        "explanation": explanation,
        "model_version": "1.0.0"
    }

@app.post("/predict/menopause")
async def predict_menopause(request: MenopausePredictionRequest):
    # Placeholder response
    return {
        "stage": "Perimenopause",
        "probabilities": {
            "premenopause": 0.15,
            "perimenopause": 0.65,
            "menopause": 0.20
        },
        "explanation": {
            "top_features": [
                {"name": "age", "impact": 0.45},
                {"name": "irregular_cycles", "impact": 0.30}
            ]
        },
        "model_version": "1.0.0"
    }

@app.post("/recommend/diet")
async def recommend_diet(profile: Dict):
    # Placeholder diet recommendations
    return {
        "meals": [
            {
                "day": "Monday",
                "breakfast": "Oatmeal with berries",
                "lunch": "Grilled chicken salad",
                "dinner": "Salmon with vegetables"
            }
        ]
    }

@app.post("/recommend/exercise")
async def recommend_exercise(profile: Dict):
    # Placeholder exercise recommendations
    return {
        "exercises": [
            {
                "day": "Monday",
                "type": "Cardio",
                "duration": 30,
                "description": "Brisk walking or jogging"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
```

## Docker Setup

### Backend Dockerfile
```dockerfile
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
```

### ML Service Dockerfile
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8001
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: naaricare
      MYSQL_ROOT_PASSWORD: root_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./naaricare-backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/naaricare
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root_password
      ML_SERVICE_URL: http://ml-service:8001
    depends_on:
      - mysql
      - ml-service

  ml-service:
    build: ./naaricare-ml
    ports:
      - "8001:8001"

volumes:
  mysql_data:
```

## Running the Backend

1. **Setup MySQL:**
```bash
mysql -u root -p < schema.sql
```

2. **Build Spring Boot:**
```bash
cd naaricare-backend
mvn clean install
mvn spring-boot:run
```

3. **Run ML Service:**
```bash
cd naaricare-ml
pip install -r requirements.txt
python main.py
```

4. **Or use Docker:**
```bash
docker-compose up -d
```

## API Documentation

Once running, access Swagger UI at:
- http://localhost:8080/swagger-ui.html

## Next Steps

1. Implement actual ML models in the Python service
2. Add field-level encryption for sensitive data
3. Implement rate limiting
4. Add comprehensive tests
5. Set up CI/CD pipeline
6. Configure production environment variables
