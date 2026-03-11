# Architecture Patterns for Coding Practice Platforms

**Domain:** Online Judge / Coding Practice Platform
**Researched:** March 2026
**Confidence:** HIGH

## Executive Summary

Coding practice platforms like LeetCode, HackerRank, and Codeforces are complex distributed systems that must execute untrusted user code securely while handling thousands of concurrent submissions. The architecture follows an event-driven pattern with queue-based processing for code execution, separating the user-facing interface from the computationally intensive judging process. This document outlines the major components, their boundaries, how data flows through the system, and a recommended build order for implementing such a platform.

## 1. Component Architecture Overview

The architecture of a coding practice platform consists of several distinct layers, each with specific responsibilities. Understanding these components and their boundaries is essential for building a scalable and maintainable system.

### 1.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐│
│  │   Web App       │  │   Mobile App    │  │   API Consumer          ││
│  │  (React/Next)   │  │   (React Native)│  │   (Third-party)         ││
│  └────────┬────────┘  └────────┬────────┘  └────────────┬────────────┘│
└───────────┼────────────────────┼──────────────────────┼──────────────┘
            │                    │                      │
            ▼                    ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY LAYER                               │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                    API Gateway / Load Balancer                      ││
│  │         (Rate Limiting, Authentication, Request Routing)           ││
│  └─────────────────────────────────────────────────────────────────────┘│
└───────────┬──────────────────────────────────────────────────┬─────────┘
            │                                                  │
            ▼                                                  ▼
┌───────────────────────────┐              ┌────────────────────────────────┐
│    PRESENTATION LAYER     │              │       EXECUTION LAYER           │
│  ┌─────────────────────┐  │              │  ┌──────────────────────────┐  │
│  │   Problem Service   │  │              │  │    Message Queue         │  │
│  │   (CRUD, Search)    │  │              │  │  (RabbitMQ, Redis, SQS) │  │
│  └─────────────────────┘  │              │  └────────────┬─────────────┘  │
│  ┌─────────────────────┐  │              │               │                │
│  │   Submission       │  │              │               ▼                │
│  │   Service          │  │              │  ┌──────────────────────────┐   │
│  └─────────────────────┘  │              │  │   Worker Pool            │   │
│  ┌─────────────────────┐  │              │  │   (Sandboxed Execution) │   │
│  │   User Service      │  │              │  └──────────────────────────┘   │
│  │   (Auth, Profile)   │  │              │                                │
│  └─────────────────────┘  │              │                                │
└───────────────────────────┘              └────────────────────────────────┘
            │                                                  ▲
            │                                                  │
            ▼                                                  │
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                       │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────────────┐│
│  │  PostgreSQL   │  │    Redis      │  │      Object Storage          ││
│  │  (Problems,  │  │  (Cache,      │  │   (Test Cases, Submissions)  ││
│  │   Users,      │  │   Sessions,   │  │                             ││
│  │   Submissions)│  │   Queue)      │  │                             ││
│  └───────────────┘  └───────────────┘  └───────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

## 2. Component Boundaries and Responsibilities

Each component in the architecture has clearly defined responsibilities and communicates with other components through well-defined interfaces. This separation of concerns enables independent scaling and maintenance of each layer.

### 2.1 Client Layer

The client layer encompasses all user-facing applications that interact with the platform. These applications are responsible for presenting the user interface, capturing user input, and displaying results.

| Component | Responsibility | Technology Options |
|-----------|---------------|-------------------|
| Web Application | Browser-based UI for problem viewing, code editing, and submission | React, Next.js, Vue.js |
| Mobile Application | Native mobile experience for practicing on-the-go | React Native, Flutter |
| API Consumer | Third-party integrations for programmatic access | REST API, GraphQL |

### 2.2 API Gateway Layer

The API gateway serves as the single entry point for all client requests. It handles cross-cutting concerns that would otherwise be duplicated across multiple services.

| Component | Responsibility | Key Features |
|-----------|---------------|---------------|
| API Gateway | Route requests to appropriate backend services | Load balancing, SSL termination |
| Authentication | Validate user credentials and tokens | JWT, OAuth 2.0 |
| Rate Limiting | Prevent abuse and ensure fair usage | Token bucket, sliding window |
| Request Routing | Direct traffic to available service instances | Service discovery integration |

### 2.3 Presentation Layer (Backend Services)

The presentation layer contains the core business logic for user-facing features. These services handle the application-specific logic and coordinate with the data layer and execution layer.

**Problem Service**

The problem service manages the coding challenges available on the platform. It handles CRUD operations for problems, supports search and filtering, and serves problem descriptions to clients.

- **Responsibilities:** Problem CRUD, search and filtering, difficulty categorization, topic tagging
- **Data Model:** Problems, test cases, difficulty levels, topics, companies
- **Dependencies:** PostgreSQL (problem storage), Redis (caching)

**Submission Service**

The submission service manages the lifecycle of code submissions from submission to result retrieval. It acts as the orchestrator between the user interface and the execution engine.

- **Responsibilities:** Submit code for execution, track submission status, store submission history, return results
- **Data Model:** Submissions, submission test results, execution time, memory usage
- **Dependencies:** Message Queue (enqueue execution jobs), PostgreSQL (submission storage)

**User Service**

The user service handles all user-related functionality including authentication, authorization, profiles, and progress tracking.

- **Responsibilities:** User registration, login, profile management, progress tracking, achievement system
- **Data Model:** Users, roles, permissions, progress, submissions
- **Dependencies:** PostgreSQL (user data), Redis (session management)

### 2.4 Execution Layer

The execution layer is responsible for the most critical and computationally intensive operation: safely executing untrusted user code. This layer must be isolated from the rest of the system to prevent security breaches.

**Message Queue**

The message queue decouples the submission process from code execution, allowing the system to handle burst traffic without overwhelming the execution infrastructure.

- **Responsibilities:** Accept submission jobs, distribute work to workers, provide buffering during traffic spikes
- **Technology Options:** RabbitMQ, Redis Streams, AWS SQS, Apache Kafka
- **Message Format:** Submission ID, language, code, test cases, time limits, memory limits

**Worker Pool**

The worker pool consists of multiple worker instances that execute user code in isolated sandbox environments. Workers pull jobs from the queue, execute the code, and report results back to the system.

- **Responsibilities:** Pull submission jobs, execute code in sandbox, run test cases, measure performance, report results
- **Isolation Method:** Docker containers, lightweight VMs (Firecracker), or OS-level sandboxing
- **Security Measures:** Resource limits (CPU time, memory), network isolation, filesystem restrictions

### 2.5 Data Layer

The data layer provides persistent storage for all platform data. Different data types require different storage solutions based on their access patterns and consistency requirements.

**Relational Database (PostgreSQL)**

The primary database for structured data with strict schema requirements and relational queries.

- **Tables:** Users, problems, submissions, test cases, topics, companies
- **Use Cases:** User data, problem data, submission records, progress tracking

**In-Memory Cache (Redis)**

Redis provides high-speed caching and session management, significantly reducing database load for frequently accessed data.

- **Use Cases:** Session storage, API response caching, rate limiting counters, leaderboard data

**Object Storage**

Object storage handles large binary files that are not suitable for relational databases.

- **Use Cases:** Test case inputs and outputs, submission artifacts, uploaded files

## 3. Data Flow

Understanding how data flows through the system is crucial for debugging issues, optimizing performance, and planning capacity. The following sections describe the major data flows in a coding practice platform.

### 3.1 Submission Flow (Primary Use Case)

The submission flow represents the most critical path in the system, where users submit code solutions for evaluation. This flow must be reliable, secure, and performant.

```
User Action: Submit Code
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. CLIENT                                                                 │
│    - User writes code in Monaco/Ace editor                              │
│    - Selects programming language                                       │
│    - Clicks "Submit" button                                              │
│    - Code sent via POST /api/submissions                                │
└─────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. API GATEWAY                                                           │
│    - Validates authentication token                                     │
│    - Applies rate limiting                                              │
│    - Routes request to Submission Service                               │
│    - Returns 202 Accepted (async processing)                           │
└─────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. SUBMISSION SERVICE                                                    │
│    - Validates request (language, code size, etc.)                     │
│    - Creates submission record in database (status: PENDING)           │
│    - Enqueues job to message queue                                      │
│    - Returns submission ID to client                                    │
└─────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 4. MESSAGE QUEUE                                                         │
│    - Job added to submission queue                                      │
│    - Job contains: submission_id, language, code, test_cases            │
│    - Worker picks up job when available                                 │
└─────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 5. WORKER (Sandboxed Execution)                                          │
│    - Pulls job from queue                                               │
│    - Creates isolated container/VM                                     │
│    - Compiles code (if needed)                                         │
│    - Executes code against test cases                                  │
│    - Measures execution time and memory usage                          │
│    - Compares output against expected results                          │
│    - Updates submission record with results                           │
│    - Marks submission as COMPLETED or FAILED                          │
│    - Container destroyed after execution                               │
└─────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 6. RESULT NOTIFICATION                                                   │
│    - Client polls /api/submissions/:id for status                      │
│    - Or WebSocket push on completion                                    │
│    - Results displayed: Accepted/Wrong Answer/Time Limit/etc.          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Problem Browsing Flow

The problem browsing flow handles how users discover and view coding challenges. This flow is read-heavy and benefits significantly from caching.

```
User Action: Browse Problems
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. CLIENT                                                                 │
│    - User navigates to problems list                                    │
│    - May apply filters (difficulty, topic, status)                      │
│    - GET /api/problems                                                  │
└─────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. API GATEWAY                                                           │
│    - Validates authentication (optional for public problems)           │
│    - Routes to Problem Service                                         │
└─────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. PROBLEM SERVICE                                                      │
│    - Checks Redis cache for problem list                                │
│    - Cache hit: return cached data                                      │
│    - Cache miss: query PostgreSQL                                      │
│    - Cache results                                                      │
│    - Return paginated problem list                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Real-Time Contest Flow

During competitive programming contests, the system must handle high volumes of submissions while providing real-time leaderboard updates. This requires additional infrastructure beyond the standard submission flow.

```
Contest Event: Submission During Contest
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. SUBMISSION EXECUTION (Same as standard flow)                         │
│    - Submission processed through worker pool                         │
│    - Result includes execution time for scoring                        │
└─────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. CONTEST SERVICE                                                       │
│    - Calculates penalty time based on wrong attempts                   │
│    - Updates contest leaderboard                                       │
│    - Publishes update event                                             │
└─────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. REAL-TIME NOTIFICATION                                                │
│    - WebSocket broadcasts leaderboard update                           │
│    - All contest participants see updated rankings                    │
└─────────────────────────────────────────────────────────────────────────┘
```

## 4. Component Communication Patterns

The architecture employs several communication patterns to ensure reliability, scalability, and maintainability. Understanding these patterns helps in making implementation decisions and debugging issues.

### 4.1 Synchronous Communication (Request-Response)

Synchronous communication is used for operations that require immediate feedback, such as user authentication, problem fetching, and submission status retrieval.

- **Protocol:** HTTP/REST or gRPC
- **Use Cases:** User login, problem details fetch, submission status check
- **Timeout:** Typically 5-30 seconds

### 4.2 Asynchronous Communication (Message Queue)

Asynchronous communication is essential for CPU-intensive operations like code execution, where the client can continue other tasks while waiting for results.

- **Protocol:** AMQP (RabbitMQ), Redis Streams, or cloud provider queues
- **Use Cases:** Code execution, batch processing, notifications
- **Delivery Guarantee:** At-least-once delivery with idempotent processing

### 4.3 Event-Driven Communication

Event-driven patterns enable loose coupling between components and support real-time features like leaderboard updates.

- **Protocol:** WebSocket, Server-Sent Events (SSE), or pub/sub systems
- **Use Cases:** Live leaderboards, contest updates, achievement notifications

## 5. Security Architecture

Security is paramount in a coding practice platform because the system executes untrusted code submitted by users. The security architecture must prevent malicious code from accessing sensitive resources.

### 5.1 Code Execution Isolation

The sandbox is the most critical security component. It must prevent user code from accessing the host system, other users' code, or sensitive data.

**Isolation Strategies:**

| Strategy | Description | Security Level | Performance |
|----------|-------------|---------------|-------------|
| Docker Containers | Process isolation using Linux containers | Medium | High |
| Firecracker MicroVMs | Lightweight VMs with strong isolation | High | Medium |
| gVisor | User-space kernel with minimal attack surface | High | Medium |
| Native Sandbox | OS-level sandboxing (seccomp, Landlock) | Medium-High | Very High |

**Resource Limits:**

- Maximum execution time (typically 1-5 seconds)
- Maximum memory usage (typically 256MB-1GB)
- Maximum output size
- Forbidden system calls (network access, file system outside tmp)

### 5.2 Network Security

- Workers run in isolated network namespaces
- No external network access from sandboxed code
- Internal communication over private networks only
- TLS for all external communication

### 5.3 Application Security

- Input validation on all user inputs
- SQL injection prevention through parameterized queries
- XSS prevention in problem descriptions and user content
- CSRF protection for state-changing operations

## 6. Scalability Considerations

A successful coding practice platform must handle varying loads, from individual practice sessions to competitive programming contests with thousands of participants. The architecture must support horizontal scaling at each layer.

### 6.1 Scaling Dimensions

| Component | Scaling Strategy | Challenges |
|-----------|------------------|------------|
| API Gateway | Horizontal (multiple instances) | Session affinity, rate limiting state |
| Presentation Services | Horizontal (stateless instances) | Cache invalidation |
| Message Queue | Partition by submission ID | Ordering guarantees |
| Worker Pool | Horizontal (auto-scaling) | Container startup time, image caching |
| PostgreSQL | Read replicas, eventual consistency | Write bottleneck |
| Redis | Cluster mode | Memory vs. durability tradeoff |

### 6.2 Traffic Patterns

**Steady State (Practice Mode):**

- Moderate submission rate (tens per minute)
- Problem browsing dominates traffic
- Caching highly effective

**Peak Load (Contests):**

- High submission rate (thousands per minute)
- Leaderboard updates critical
- Pre-scaled infrastructure required

## 7. Suggested Build Order

Building a coding practice platform is a significant undertaking. The following build order prioritizes delivering value early while establishing a foundation for more advanced features. This order minimizes integration complexity and allows for iterative validation of each component.

### Phase 1: Foundation (Weeks 1-4)

**Objective:** Establish the core infrastructure and basic functionality

| Priority | Component | Deliverable | Dependencies |
|----------|-----------|-------------|--------------|
| 1 | Database Schema | PostgreSQL tables for users, problems, submissions | None |
| 2 | Authentication | User registration, login, JWT tokens | Database |
| 3 | Problem Service | CRUD API for problems, basic listing | Database |
| 4 | Frontend - Problem Viewer | Web interface to view problem descriptions | Problem Service |
| 5 | Frontend - Code Editor | Monaco Editor integration with language selection | None |

**Rationale:** These components provide the minimum viable product for users to view problems and write code. No code execution is required in this phase; users can practice writing code locally.

### Phase 2: Basic Execution (Weeks 5-8)

**Objective:** Enable code execution with simple test case validation

| Priority | Component | Deliverable | Dependencies |
|----------|-----------|-------------|--------------|
| 1 | Message Queue | RabbitMQ/Redis setup for job processing | None |
| 2 | Worker Service | Basic code execution with Docker sandbox | Message Queue |
| 3 | Submission Service | Accept submissions, enqueue for execution | Problem Service, Queue |
| 4 | Result Display | Show execution results (Accepted/Wrong Answer) | Submission Service |
| 5 | Frontend - Submit Button | Integrate submission flow | Submission Service |

**Rationale:** This phase delivers the core value proposition: users can submit code and receive automated feedback. The sandbox provides security isolation from the beginning.

### Phase 3: Enhanced Features (Weeks 9-12)

**Objective:** Add features that improve user experience and engagement

| Priority | Component | Deliverable | Dependencies |
|----------|-----------|-------------|--------------|
| 1 | Test Case Management | Support multiple test cases per problem | Database, Worker |
| 2 | Progress Tracking | User statistics, solved problems, streaks | User Service, Submissions |
| 3 | Problem Search & Filter | Search by difficulty, topic, company | Problem Service |
| 4 | Caching Layer | Redis caching for problems and submissions | Redis |
| 5 | Code Snippets | Starter templates per language | Problem Service |

**Rationale:** These features transform the platform from a simple judge into a useful learning tool. Users can track their progress and find problems suited to their skill level.

### Phase 4: Contest Infrastructure (Weeks 13-16)

**Objective:** Support competitive programming events

| Priority | Component | Deliverable | Dependencies |
|----------|-----------|-------------|--------------|
| 1 | Contest Service | Create and manage contests | User Service, Problem Service |
| 2 | Real-time Leaderboard | Live rankings during contests | Contest Service, WebSocket |
| 3 | Penalty Calculation | Time-based scoring system | Contest Service |
| 4 | Contest Registration | User enrollment in contests | User Service, Contest Service |
| 5 | Contest Problems | Private problem sets for contests | Problem Service |

**Rationale:** Contest support requires additional infrastructure but shares most components with the practice platform. Building this after core features are stable reduces risk.

### Phase 5: Scale and Polish (Weeks 17-20)

**Objective:** Improve performance, reliability, and user experience

| Priority | Component | Deliverable | Dependencies |
|----------|-----------|-------------|--------------|
| 1 | Auto-scaling Workers | Dynamic worker pool based on load | Cloud infrastructure |
| 2 | Performance Optimization | Query optimization, caching strategies | All services |
| 3 | Additional Languages | Support more programming languages | Worker Service |
| 4 | Mobile App | React Native/Flutter mobile client | Existing APIs |
| 5 | Analytics | Usage analytics, popular problems | Database |

**Rationale:** This phase focuses on production readiness and expanding the platform's reach. Auto-scaling ensures cost efficiency while handling traffic spikes.

### Phase 6: Advanced Features (Weeks 21+)

**Objective:** Differentiate the platform with advanced capabilities

| Priority | Component | Deliverable | Dependencies |
|----------|-----------|-------------|--------------|
| 1 | AI Assistance | Hint system, solution analysis | Problem Service |
| 2 | Collaborative Coding | Pair programming feature | WebSocket |
| 3 | Video Solutions | Problem explanation videos | Content management |
| 4 | API for Educators | Integration with learning management systems | API Gateway |
| 5 | Custom Contests | Organization-specific problem sets | Contest Service |

## 8. Technology Stack Recommendations

Based on the architecture analysis, the following technology stack provides a balance of developer experience, performance, and operational simplicity.

### 8.1 Recommended Stack

| Layer | Technology | Version | Rationale |
|-------|------------|---------|------------|
| Frontend Framework | Next.js | 14+ | SSR for SEO, React ecosystem |
| Code Editor | Monaco Editor | Latest | VS Code editor, excellent DX |
| Backend Framework | Node.js/Express or Go | Latest | Non-blocking I/O for API services |
| Database | PostgreSQL | 15+ | ACID compliance, complex queries |
| Cache | Redis | 7+ | In-memory speed, versatile |
| Message Queue | RabbitMQ | Latest | Mature, reliable, feature-rich |
| Container Runtime | Docker | Latest | Industry standard, good isolation |
| Cloud Platform | AWS/GCP | N/A | Managed services reduce ops burden |

### 8.2 Alternative Considerations

| Use Case | Alternative | When to Choose |
|----------|-------------|----------------|
| Backend | Python/FastAPI | AI/ML integration needed |
| Database | CockroachDB | Global distribution required |
| Queue | Redis Streams | Simpler ops, already using Redis |
| Isolation | Firecracker | Higher security requirements |
| Frontend | React + Vite | Simpler SPA, no SSR needed |

## 9. Key Architectural Decisions

Several architectural decisions significantly impact the system's behavior and development trajectory. The following recommendations are based on common patterns in production coding platforms.

### 9.1 Sync vs. Async Code Execution

**Recommendation:** Always use asynchronous execution with polling or WebSocket notifications.

**Rationale:** Code execution time varies significantly based on problem complexity and language. Synchronous execution would either timeout frequently or require very long timeouts, degrading user experience. Async execution with message queues handles variable execution times gracefully.

### 9.2 Database Schema Design

**Recommendation:** Use a normalized schema with separate tables for problems, test cases, and submissions.

**Rationale:** This separation allows independent scaling of problem serving vs. submission tracking. Test cases can be stored in object storage if they become large. Submission history can be archived without affecting problem access.

### 9.3 Worker Scaling Strategy

**Recommendation:** Implement queue-based auto-scaling with a minimum of 2 workers for high availability.

**Rationale:** During contests, submission volume can increase 100x. Auto-scaling ensures capacity during peaks while minimizing costs during quiet periods. Minimum workers prevent single points of failure.

### 9.4 State Management

**Recommendation:** Keep the backend stateless; use Redis for session state and JWT for authentication.

**Rationale:** Stateless services scale horizontally without session affinity. JWT tokens reduce database lookups for authentication. Redis sessions provide fast access when validation is needed.

## 10. Conclusion

Building a coding practice platform requires careful attention to security, scalability, and user experience. The architecture described in this document provides a solid foundation that can start simple and scale to handle millions of users. The key insights are:

- **Separation of concerns** between presentation, execution, and data layers enables independent scaling and development.
- **Asynchronous processing** through message queues handles the variable nature of code execution while maintaining system responsiveness.
- **Sandboxed execution** is the cornerstone of security; invest in robust isolation from the beginning.
- **Incremental development** following the suggested build order delivers value early while establishing foundations for advanced features.

The suggested technology stack prioritizes developer productivity and operational simplicity while maintaining the performance characteristics required for competitive programming contexts. With proper implementation, this architecture can support everything from individual practice sessions to large-scale contests with thousands of concurrent participants.

## Sources

- System Design Handbook - "Design a Coding Platform Like LeetCode" (2025)
- AlgoMaster.io - "Design LeetCode | System Design Interview" (2025)
- Northflank - "Remote code execution sandbox: secure isolation at scale" (2026)
- TianPan.co - "Designing Online Judge or Leetcode" (2026)
- Medium - "Designing a competitive coding platform like leetcode" (2025)
- GeeksforGeeks - "Message Queues - System Design" (2024)
- Microsoft - Monaco Editor Documentation (2025)
