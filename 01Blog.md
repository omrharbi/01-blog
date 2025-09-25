# 01Blog - Complete Architecture & Implementation Guide

## 1. Executive Summary

01Blog is designed as a cloud-native, microservices-based social blogging platform that prioritizes scalability, security, and maintainability. The architecture follows domain-driven design principles, decomposing the system into six core microservices: User Management, Content Management, Social Interactions, Media Handling, Notifications, and Administration.

The platform leverages Spring Boot for backend services, Angular for the frontend, PostgreSQL for data persistence, and Kubernetes for orchestration. A comprehensive security model implements JWT-based authentication with refresh tokens, API gateway protection, and role-based access control. The event-driven architecture ensures loose coupling between services while maintaining data consistency through the Saga pattern.

This production-ready solution includes complete Kubernetes configurations, monitoring setup, CI/CD pipeline recommendations, and detailed security implementations. The modular design allows for independent scaling and deployment of services, supporting the platform's growth from initial launch to enterprise scale.

## 2. Microservices Architecture

### Service Decomposition

```
┌─────────────────────────────────────────────────────────────────┐
│                           API Gateway                            │
│                    (Kong/Nginx Ingress)                         │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────────────────────────────┐
        │             │                                     │
   ┌────▼───┐    ┌───▼────┐    ┌──────────┐    ┌──────────┐
   │ User   │    │Content │    │  Social  │    │  Media   │
   │Service │    │Service │    │ Service  │    │ Service  │
   │        │    │        │    │          │    │          │
   └────┬───┘    └───┬────┘    └─────┬────┘    └─────┬────┘
        │            │               │               │
   ┌────▼───┐    ┌───▼────┐         │               │
   │ Notif  │    │ Admin  │         │               │
   │Service │    │Service │         │               │
   └────────┘    └────────┘         │               │
                                   │               │
    ┌──────────────────────────────▼───────────────▼──────┐
    │              Event Bus (Apache Kafka)               │
    └─────────────────────────────────────────────────────┘
```

### 1. User Service
**Domain**: User authentication, profiles, subscriptions
**Responsibilities**:
- User registration/login
- Profile management ("blocks")
- Subscription/following system
- JWT token management
- Role-based access control

**Database Schema**:
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    location VARCHAR(100),
    website VARCHAR(200),
    birth_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions/Following
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id),
    following_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id)
);

-- JWT Refresh tokens
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Content Service
**Domain**: Blog posts, content management
**Responsibilities**:
- Post creation/editing/deletion
- Content categorization
- Search functionality
- Content versioning

**Database Schema**:
```sql
-- Posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    slug VARCHAR(250) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    is_featured BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Post categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6366f1'
);

-- Post-category mapping
CREATE TABLE post_categories (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

-- Post tags
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE post_tags (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);
```

### 3. Social Interactions Service
**Domain**: Likes, comments, social engagement
**Responsibilities**:
- Like/unlike posts
- Comment management
- Social metrics calculation
- Engagement analytics

**Database Schema**:
```sql
-- Likes
CREATE TABLE post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

-- Comments
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    parent_comment_id UUID REFERENCES comments(id),
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comment likes
CREATE TABLE comment_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES comments(id),
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(comment_id, user_id)
);

-- Social metrics (denormalized for performance)
CREATE TABLE post_metrics (
    post_id UUID PRIMARY KEY,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Media Service
**Domain**: File upload, media processing
**Responsibilities**:
- Image/video upload
- Media processing and optimization
- CDN integration
- Storage management

**Database Schema**:
```sql
-- Media files
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type VARCHAR(20) CHECK (file_type IN ('IMAGE', 'VIDEO', 'DOCUMENT')),
    is_processed BOOLEAN DEFAULT false,
    cdn_url VARCHAR(500),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Post media associations
CREATE TABLE post_media (
    post_id UUID NOT NULL,
    media_id UUID NOT NULL REFERENCES media_files(id),
    display_order INTEGER DEFAULT 0,
    PRIMARY KEY (post_id, media_id)
);
```

### 5. Notifications Service
**Domain**: Real-time notifications, messaging
**Responsibilities**:
- Push notifications
- Email notifications
- In-app notifications
- Notification preferences

**Database Schema**:
```sql
-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification preferences
CREATE TABLE notification_preferences (
    user_id UUID PRIMARY KEY,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    comment_notifications BOOLEAN DEFAULT true,
    like_notifications BOOLEAN DEFAULT true,
    follow_notifications BOOLEAN DEFAULT true
);
```

### 6. Admin Service
**Domain**: Administration, moderation
**Responsibilities**:
- User management
- Content moderation
- Reports handling
- Analytics dashboard

**Database Schema**:
```sql
-- User reports
CREATE TABLE user_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_user_id UUID NOT NULL,
    reported_user_id UUID,
    reported_post_id UUID,
    reported_comment_id UUID,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED')),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Moderation actions
CREATE TABLE moderation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('USER', 'POST', 'COMMENT')),
    target_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. API Design Specifications

### API Gateway Configuration

#### Kong Gateway Routes
```yaml
apiVersion: configuration.konghq.com/v1
kind: KongIngress
metadata:
  name: 01blog-gateway
spec:
  proxy:
    connect_timeout: 30000
    read_timeout: 30000
    write_timeout: 30000
  route:
    strip_path: true
    preserve_host: true
```

### User Service API

#### Authentication Endpoints
```yaml
# POST /api/v1/auth/register
Request:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "displayName": "John Doe"
}

Response:
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER",
    "profile": {
      "displayName": "John Doe"
    }
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440001",
    "expiresIn": 3600
  }
}

# POST /api/v1/auth/login
Request:
{
  "username": "john_doe",
  "password": "SecurePass123!"
}

# POST /api/v1/auth/refresh
Request:
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440001"
}

# POST /api/v1/auth/logout
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Profile Management
```yaml
# GET /api/v1/users/{userId}/profile
Response:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "john_doe",
  "displayName": "John Doe",
  "bio": "Software developer passionate about learning",
  "avatarUrl": "https://cdn.01blog.com/avatars/john_doe.jpg",
  "location": "San Francisco, CA",
  "followersCount": 125,
  "followingCount": 89,
  "postsCount": 42
}

# PUT /api/v1/users/profile
Request:
{
  "displayName": "John Doe",
  "bio": "Updated bio",
  "location": "San Francisco, CA",
  "website": "https://johndoe.dev"
}

# POST /api/v1/users/{userId}/follow
# DELETE /api/v1/users/{userId}/unfollow
```

### Content Service API

#### Post Management
```yaml
# POST /api/v1/posts
Request:
{
  "title": "My Learning Journey with Spring Boot",
  "content": "Today I learned about...",
  "excerpt": "A brief overview of my Spring Boot experience",
  "categories": ["programming", "spring-boot"],
  "tags": ["java", "backend", "learning"],
  "status": "PUBLISHED",
  "mediaIds": ["media-uuid-1", "media-uuid-2"]
}

Response:
{
  "id": "post-uuid-123",
  "title": "My Learning Journey with Spring Boot",
  "slug": "my-learning-journey-with-spring-boot",
  "author": {
    "id": "user-uuid-456",
    "username": "john_doe",
    "displayName": "John Doe",
    "avatarUrl": "https://cdn.01blog.com/avatars/john_doe.jpg"
  },
  "publishedAt": "2024-01-15T10:30:00Z",
  "metrics": {
    "likesCount": 0,
    "commentsCount": 0,
    "viewsCount": 1
  }
}

# GET /api/v1/posts?page=1&size=20&sort=publishedAt,desc
# GET /api/v1/posts/{postId}
# PUT /api/v1/posts/{postId}
# DELETE /api/v1/posts/{postId}
```

### Social Interactions API

```yaml
# POST /api/v1/posts/{postId}/like
Response:
{
  "liked": true,
  "likesCount": 15
}

# DELETE /api/v1/posts/{postId}/like
# POST /api/v1/posts/{postId}/comments
Request:
{
  "content": "Great post! Thanks for sharing your experience.",
  "parentCommentId": null
}

# GET /api/v1/posts/{postId}/comments?page=1&size=20
```

### Media Service API

```yaml
# POST /api/v1/media/upload
Content-Type: multipart/form-data
Request:
- file: [binary data]
- type: "IMAGE"

Response:
{
  "id": "media-uuid-789",
  "originalFilename": "screenshot.png",
  "filePath": "/uploads/2024/01/15/screenshot-uuid.png",
  "cdnUrl": "https://cdn.01blog.com/uploads/2024/01/15/screenshot-uuid.png",
  "fileSize": 1024768,
  "mimeType": "image/png",
  "isProcessed": false
}

# GET /api/v1/media/{mediaId}
# DELETE /api/v1/media/{mediaId}
```

## 4. Database Design

### Database-per-Service Architecture

Each microservice maintains its own PostgreSQL database instance to ensure data isolation and service autonomy. Here's the complete database configuration:

#### Connection Pool Configuration
```yaml
# Database configuration for each service
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000
      connection-timeout: 20000
      leak-detection-threshold: 60000
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true
```

### Event-Driven Data Consistency

#### Saga Pattern Implementation
```java
// User Registration Saga
@Component
public class UserRegistrationSaga {
    
    @SagaStart
    @EventHandler
    public void handle(UserRegistrationStartedEvent event) {
        // Step 1: Create user account
        commandGateway.send(new CreateUserCommand(event.getUserData()));
    }
    
    @EventHandler
    public void handle(UserCreatedEvent event) {
        // Step 2: Create user profile
        commandGateway.send(new CreateUserProfileCommand(event.getUserId()));
    }
    
    @EventHandler
    public void handle(UserProfileCreatedEvent event) {
        // Step 3: Initialize notification preferences
        commandGateway.send(new InitializeNotificationPreferencesCommand(event.getUserId()));
    }
    
    @EventHandler
    public void handle(UserRegistrationFailedEvent event) {
        // Compensation: Rollback user creation
        commandGateway.send(new DeleteUserCommand(event.getUserId()));
    }
}
```

#### Event Schema Definitions
```json
{
  "UserCreatedEvent": {
    "eventId": "uuid",
    "userId": "uuid",
    "username": "string",
    "email": "string",
    "role": "string",
    "timestamp": "ISO8601"
  },
  "PostPublishedEvent": {
    "eventId": "uuid",
    "postId": "uuid",
    "authorId": "uuid",
    "title": "string",
    "slug": "string",
    "publishedAt": "ISO8601"
  },
  "PostLikedEvent": {
    "eventId": "uuid",
    "postId": "uuid",
    "userId": "uuid",
    "timestamp": "ISO8601"
  }
}
```

### Migration Strategy

#### Flyway Configuration
```sql
-- V1__Initial_schema.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC) WHERE status = 'PUBLISHED';
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_user_subscriptions_follower ON user_subscriptions(follower_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

-- Full-text search indexes
CREATE INDEX idx_posts_search ON posts USING gin(to_tsvector('english', title || ' ' || content));
```

## 5. Kubernetes Production Configuration

### Namespace Configuration
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: 01blog
  labels:
    name: 01blog
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: 01blog-quota
  namespace: 01blog
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
    persistentvolumeclaims: "10"
```

### ConfigMaps and Secrets
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: 01blog-config
  namespace: 01blog
data:
  SPRING_PROFILES_ACTIVE: "production"
  KAFKA_BOOTSTRAP_SERVERS: "kafka-cluster:9092"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
---
apiVersion: v1
kind: Secret
metadata:
  name: 01blog-secrets
  namespace: 01blog
type: Opaque
data:
  JWT_SECRET: "base64-encoded-secret"
  DB_PASSWORD: "base64-encoded-password"
  KAFKA_PASSWORD: "base64-encoded-kafka-password"
  REDIS_PASSWORD: "base64-encoded-redis-password"
```

### PostgreSQL StatefulSet
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres-user-service
  namespace: 01blog
spec:
  serviceName: postgres-user-service
  replicas: 1
  selector:
    matchLabels:
      app: postgres-user-service
  template:
    metadata:
      labels:
        app: postgres-user-service
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: user_service_db
        - name: POSTGRES_USER
          value: postgres
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: 01blog-secrets
              key: DB_PASSWORD
        - name: PGDATA
          value: /var/lib/postgresql/data/pgdata
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - postgres
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - postgres
          initialDelaySeconds: 5
          periodSeconds: 5
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
      storageClassName: fast-ssd
```

### User Service Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: 01blog
  labels:
    app: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: 01blog/user-service:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          valueFrom:
            configMapKeyRef:
              name: 01blog-config
              key: SPRING_PROFILES_ACTIVE
        - name: DATABASE_URL
          value: "jdbc:postgresql://postgres-user-service:5432/user_service_db"
        - name: DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: 01blog-secrets
              key: DB_PASSWORD
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: 01blog-secrets
              key: JWT_SECRET
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        startupProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          failureThreshold: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
  namespace: 01blog
spec:
  selector:
    app: user-service
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
```

### Horizontal Pod Autoscaler
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: user-service-hpa
  namespace: 01blog
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
```

### Ingress Configuration with SSL
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: 01blog-ingress
  namespace: 01blog
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/rewrite-target: /$2
    nginx.ingress.kubernetes.io/rate-limit-connections: "20"
    nginx.ingress.kubernetes.io/rate-limit-requests-per-minute: "100"
spec:
  tls:
  - hosts:
    - api.01blog.com
    secretName: 01blog-tls
  rules:
  - host: api.01blog.com
    http:
      paths:
      - path: /api/v1/users(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: user-service
            port:
              number: 80
      - path: /api/v1/posts(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: content-service
            port:
              number: 80
      - path: /api/v1/media(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: media-service
            port:
              number: 80
```

### Network Policies
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: user-service-network-policy
  namespace: 01blog
spec:
  podSelector:
    matchLabels:
      app: user-service
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    - podSelector:
        matchLabels:
          app: api-gateway
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: postgres-user-service
    ports:
    - protocol: TCP
      port: 5432
  - to:
    - podSelector:
        matchLabels:
          app: kafka
    ports:
    - protocol: TCP
      port: 9092
```

## 6. Security Implementation

### JWT Token Management

#### JWT Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withSecretKey(getSecretKey())
            .macAlgorithm(MacAlgorithm.HS256)
            .build();
    }
    
    @Bean
    public JwtEncoder jwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(getSecretKey()));
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/posts/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(customAuthenticationEntryPoint())
                .accessDeniedHandler(customAccessDeniedHandler())
            )
            .build();
    }
}
```

#### Token Service Implementation
```java
@Service
public class TokenService {
    
    private final JwtEncoder jwtEncoder;
    private final RefreshTokenRepository refreshTokenRepository;
    
    public TokenResponse generateTokens(User user) {
        Instant now = Instant.now();
        
        // Access token (15 minutes)
        JwtClaimsSet accessClaims = JwtClaimsSet.builder()
            .issuer("01blog")
            .issuedAt(now)
            .expiresAt(now.plus(15, ChronoUnit.MINUTES))
            .subject(user.getId().toString())
            .claim("username", user.getUsername())
            .claim("role", user.getRole())
            .build();
            
        String accessToken = jwtEncoder.encode(JwtEncoderParameters.from(accessClaims)).getTokenValue();
        
        // Refresh token (7 days)
        RefreshToken refreshToken = RefreshToken.builder()
            .userId(user.getId())
            .tokenHash(generateSecureToken())
            .expiresAt(now.plus(7, ChronoUnit.DAYS))
            .isActive(true)
            .build();
            
        refreshTokenRepository.save(refreshToken);
        
        return TokenResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken.getTokenHash())
            .expiresIn(900) // 15 minutes
            .tokenType("Bearer")
            .build();
    }
}
```

### Rate Limiting Implementation

#### Redis-based Rate Limiter
```java
@Component
public class RateLimitingService {
    
    private final RedisTemplate<String, String> redisTemplate;
    
    @Value("${rate-limiting.requests-per-minute:60}")
    private int requestsPerMinute;
    
    public boolean isAllowed(String userId, String endpoint) {
        String key = String.format("rate_limit:%s:%s", userId, endpoint);
        String currentCount = redisTemplate.opsForValue().get(key);
        
        if (currentCount == null) {
            redisTemplate.opsForValue().set(key, "1", Duration.ofMinutes(1));
            return true;
        }
        
        int count = Integer.parseInt(currentCount);
        if (count >= requestsPerMinute) {
            return false;
        }
        
        redisTemplate.opsForValue().increment(key);
        return true;
    }
}
```

#### Rate Limiting Filter
```java
@Component
public class RateLimitingFilter implements OncePerRequestFilter {
    
    private final RateLimitingService rateLimitingService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String userId = extractUserId(request);
        String endpoint = request.getRequestURI();
        
        if (!rateLimitingService.isAllowed(userId, endpoint)) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Rate limit exceeded\"}");
            return;
        }
        
        filterChain.doFilter(request, response);
    }
}
```

### Input Validation and Sanitization

#### Custom Validation Annotations
```java
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = SafeHtmlValidator.class)
public @interface SafeHtml {
    String message() default "Content contains unsafe HTML";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

@Component
public class SafeHtmlValidator implements ConstraintValidator<SafeHtml, String> {
    
    private final PolicyFactory policy = Sanitizers.FORMATTING
        .and(Sanitizers.LINKS)
        .and(Sanitizers.BLOCKS);
    
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) return true;
        
        String sanitized = policy.sanitize(value);
        return sanitized.equals(value);
    }
}
```

#### Request DTOs with Validation
```java
public class CreatePostRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @NotBlank(message = "Content is required")
    @SafeHtml
    private String content;
    
    @Size(max = 500, message = "Excerpt must not exceed 500 characters")
    private String excerpt;
    
    @Valid
    private List<@Pattern(regexp = "^[a-zA-Z0-9-_]+$", message = "Invalid category format") String> categories;
    
    // Getters and setters
}
```

### CORS Configuration
```java
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "https://01blog.com",
            "https://*.01blog.com"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```

### Encryption for Sensitive Data
```java
@Service
public class EncryptionService {
    
    @Value("${encryption.key}")
    private String encryptionKey;
    
    private final AESUtil aesUtil = new AESUtil();
    
    public String encrypt(String plainText) {
        try {
            return aesUtil.encrypt(plainText, encryptionKey);
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }
    
    public String decrypt(String encryptedText) {
        try {
            return aesUtil.decrypt(encryptedText, encryptionKey);
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }
}

// Entity field encryption
@Entity
@Table(name = "users")
public class User {
    
    @Convert(converter = EncryptedStringConverter.class)
    @Column(name = "email")
    private String email;
    
    // Other fields...
}
```

## 7. Development Workflow

### Project Structure
```
01blog/
├── services/
│   ├── user-service/
│   │   ├── src/main/java/com/blog01/user/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── entity/
│   │   │   ├── dto/
│   │   │   ├── config/
│   │   │   └── UserServiceApplication.java
│   │   ├── src/main/resources/
│   │   │   ├── application.yml
│   │   │   ├── application-prod.yml
│   │   │   └── db/migration/
│   │   ├── Dockerfile
│   │   └── pom.xml
│   ├── content-service/
│   ├── social-service/
│   ├── media-service/
│   ├── notification-service/
│   └── admin-service/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   ├── shared/
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   ├── posts/
│   │   │   │   ├── profile/
│   │   │   │   └── admin/
│   │   │   └── app.module.ts
│   │   ├── environments/
│   │   └── assets/
│   ├── angular.json
│   ├── package.json
│   └── Dockerfile
├── infrastructure/
│   ├── kubernetes/
│   │   ├── base/
│   │   ├── environments/
│   │   │   ├── dev/
│   │   │   ├── staging/
│   │   │   └── prod/
│   │   └── monitoring/
│   ├── terraform/
│   └── docker-compose.yml
├── scripts/
│   ├── build.sh
│   ├── deploy.sh
│   └── test.sh
└── docker-compose.yml
```

### Docker Configuration

#### User Service Dockerfile
```dockerfile
# Multi-stage build for Spring Boot service
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
RUN addgroup -g 1001 appgroup && adduser -u 1001 -G appgroup -s /bin/sh -D appuser
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY --chown=appuser:appgroup docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER appuser
EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["java", "-jar", "app.jar"]
```

#### Angular Frontend Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build:prod

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/01blog /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Development Docker Compose
```yaml
version: '3.8'
services:
  postgres-user:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: user_service_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_user_data:/var/lib/postgresql/data

  postgres-content:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: content_service_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5433:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --requirepass password

  kafka:
    image: confluentinc/cp-kafka:latest
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    ports:
      - "9092:9092"
    depends_on:
      - zookeeper

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

volumes:
  postgres_user_data:
  postgres_content_data:
```

### Spring Boot Service Template

#### Main Application Class
```java
@SpringBootApplication
@EnableJpaRepositories
@EnableConfigurationProperties
@EnableScheduling
public class UserServiceApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
    
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

#### Application Configuration
```yaml
# application.yml
server:
  port: 8080
  servlet:
    context-path: /api/v1

spring:
  application:
    name: user-service
  
  datasource:
    url: jdbc:postgresql://localhost:5432/user_service_db
    username: postgres
    password: ${DB_PASSWORD:password}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000
      connection-timeout: 20000

  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    show-sql: false

  kafka:
    bootstrap-servers: ${KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    consumer:
      group-id: user-service
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer

  redis:
    host: ${REDIS_HOST:localhost}
    port: ${REDIS_PORT:6379}
    password: ${REDIS_PASSWORD:password}

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true

logging:
  level:
    com.blog01: DEBUG
    org.springframework.security: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"

jwt:
  secret: ${JWT_SECRET:your-secret-key}
  expiration: 900 # 15 minutes
  refresh-expiration: 604800 # 7 days
```

### Angular Frontend Architecture

#### Core Module
```typescript
// core.module.ts
@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    AuthService,
    ApiService,
    NotificationService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only once.');
    }
  }
}
```

#### Authentication Service
```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/v1/auth/login', credentials)
      .pipe(
        tap(response => this.setCurrentUser(response))
      );
  }

  logout(): void {
    this.http.post('/api/v1/auth/logout', {}).subscribe();
    this.clearCurrentUser();
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthResponse>('/api/v1/auth/refresh', 
      { refreshToken })
      .pipe(
        tap(response => this.setCurrentUser(response))
      );
  }

  private setCurrentUser(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.tokens.accessToken);
    localStorage.setItem('refreshToken', authResponse.tokens.refreshToken);
    this.currentUserSubject.next(authResponse.user);
  }
}
```

#### HTTP Interceptor
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshToken().pipe(
      switchMap(() => {
        const newToken = localStorage.getItem('accessToken');
        const newReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`
          }
        });
        return next.handle(newReq);
      }),
      catchError(() => {
        this.authService.logout();
        return throwError('Token refresh failed');
      })
    );
  }
}
```

## 8. Monitoring and Observability

### Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "01blog_rules.yml"

scrape_configs:
  - job_name: '01blog-services'
    kubernetes_sd_configs:
      - role: endpoints
        namespaces:
          names:
            - 01blog
    relabel_configs:
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

#### Alert Rules
```yaml
# 01blog_rules.yml
groups:
  - name: 01blog.rules
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Service {{ $labels.service }} has error rate of {{ $value }}"

      - alert: HighMemoryUsage
        expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage detected"

      - alert: DatabaseConnectionPool
        expr: hikaricp_connections_active / hikaricp_connections_max > 0.8
        for: 3m
        labels:
          severity: warning
        annotations:
          summary: "Database connection pool usage is high"
```

### Grafana Dashboard Configuration
```json
{
  "dashboard": {
    "title": "01Blog Services Overview",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total[5m])) by (service)",
            "legendFormat": "{{ service }}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))",
            "legendFormat": "95th percentile - {{ service }}"
          }
        ]
      },
      {
        "title": "Database Connections",
        "type": "graph",
        "targets": [
          {
            "expr": "hikaricp_connections_active",
            "legendFormat": "Active - {{ service }}"
          },
          {
            "expr": "hikaricp_connections_idle",
            "legendFormat": "Idle - {{ service }}"
          }
        ]
      }
    ]
  }
}
```

### ELK Stack Configuration

#### Logstash Pipeline
```ruby
# logstash.conf
input {
  beats {
    port => 5044
  }
}

filter {
  if [kubernetes][container][name] =~ /01blog/ {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} - %{GREEDYDATA:log_message}" }
    }
    
    if [log_message] =~ /ERROR/ {
      mutate {
        add_tag => ["error"]
      }
    }
    
    if [kubernetes][container][name] {
      mutate {
        add_field => { "service_name" => "%{[kubernetes][container][name]}" }
      }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "01blog-logs-%{+YYYY.MM.dd}"
  }
}
```

#### Filebeat Configuration
```yaml
# filebeat.yml
filebeat.inputs:
- type: container
  paths:
    - /var/log/containers/*01blog*.log
  processors:
  - add_kubernetes_metadata:
      host: ${NODE_NAME}
      matchers:
      - logs_path:
          logs_path: "/var/log/containers/"

output.logstash:
  hosts: ["logstash:5044"]

logging.level: info
```

### Custom Metrics Implementation
```java
@Component
public class CustomMetrics {
    
    private final Counter userRegistrations = Counter.builder()
        .name("user_registrations_total")
        .description("Total number of user registrations")
        .register(Metrics.globalRegistry);
    
    private final Timer requestDuration = Timer.builder()
        .name("http_request_duration_seconds")
        .description("HTTP request duration")
        .register(Metrics.globalRegistry);
    
    private final Gauge activeUsers = Gauge.builder()
        .name("active_users")
        .description("Number of active users")
        .register(Metrics.globalRegistry, this, CustomMetrics::getActiveUserCount);
    
    public void incrementUserRegistrations() {
        userRegistrations.increment();
    }
    
    public Timer.Sample startRequestTimer() {
        return Timer.start(Metrics.globalRegistry);
    }
    
    private double getActiveUserCount() {
        // Implementation to count active users
        return userService.getActiveUserCount();
    }
}
```

## 9. Deployment Strategy

### CI/CD Pipeline with GitHub Actions

#### Build and Test Workflow
```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-services:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [user-service, content-service, social-service, media-service]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
    
    - name: Cache Maven dependencies
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
    
    - name: Run tests
      run: |
        cd services/${{ matrix.service }}
        mvn clean test
    
    - name: Generate test report
      uses: dorny/test-reporter@v1
      if: success() || failure()
      with:
        name: Maven Tests - ${{ matrix.service }}
        path: services/${{ matrix.service }}/target/surefire-reports/*.xml
        reporter: java-junit

  build-and-push:
    needs: test-services
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    strategy:
      matrix:
        service: [user-service, content-service, social-service, media-service, notification-service, admin-service]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ secrets.REGISTRY_URL }}
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}
    
    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: ./services/${{ matrix.service }}
        push: true
        tags: |
          ${{ secrets.REGISTRY_URL }}/01blog/${{ matrix.service }}:latest
          ${{ secrets.REGISTRY_URL }}/01blog/${{ matrix.service }}:${{ github.sha }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: 'v1.28.0'
    
    - name: Set up Kustomize
      run: |
        curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh" | bash
        sudo mv kustomize /usr/local/bin/
    
    - name: Deploy to Kubernetes
      run: |
        echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > ~/.kube/config
        cd infrastructure/kubernetes/environments/prod
        kustomize edit set image user-service=${{ secrets.REGISTRY_URL }}/01blog/user-service:${{ github.sha }}
        kustomize edit set image content-service=${{ secrets.REGISTRY_URL }}/01blog/content-service:${{ github.sha }}
        kubectl apply -k .
    
    - name: Verify deployment
      run: |
        kubectl rollout status deployment/user-service -n 01blog --timeout=300s
        kubectl rollout status deployment/content-service -n 01blog --timeout=300s
```

### Blue-Green Deployment Strategy

#### Deployment Script
```bash
#!/bin/bash
# blue-green-deploy.sh

set -e

NAMESPACE="01blog"
SERVICE_NAME=$1
NEW_IMAGE=$2
C... (18 KB left)