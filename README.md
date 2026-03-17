# RevPay

> A full-stack monolithic & microservice financial web application for secure digital payments and money management. This repository contains the **Angular 18 frontend** for RevPay.

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Features](#features)
- [Pages & Routes](#pages--routes)
- [Authentication & Guards](#authentication--guards)
- [Microservice Architecture](#microservices-architecture)
- [Technology Stack](#technology-stack)
- [Team](#team)

---

## Overview

RevPay is a digital payments platform supporting both **Personal** and **Business** accounts. Personal users can send and receive money, manage payment cards, track transactions, and handle money requests. Business users get additional capabilities including invoicing, loan applications, business analytics, and payment acceptance.

The frontend is an **Angular 18 standalone component** application communicating with a Spring Boot REST API backend.

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Angular CLI >= 18.x

```bash
npm install -g @angular/cli
```

### Installation

```bash
# Clone the repository
git clone https://github.com/vsmidhun21/revpay.git
cd revpay

# Install dependencies
npm install
```

### Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200`. The app auto-reloads on file changes.

### Build

```bash
# Development build
ng build

# Production build
ng build --configuration production
```

Build artifacts are output to the `dist/` directory.

---

## Environment Configuration

**File:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'
};
```

**File:** `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://your-production-api.com/api'
};
```

Update `apiBaseUrl` to point to your backend before building for production.

---

## Features

### Personal Account

| Feature | Description |
|---|---|
| Registration | Multi-step registration with email, phone, password, and security questions |
| Login | Email/phone + password authentication |
| Dashboard | Wallet balance, live recent transactions, live notifications, quick actions |
| Send Money | 3-step flow — recipient → confirm → success with PIN verification |
| Request Money | Send payment requests, view incoming/outgoing, accept with PIN or decline |
| Add Funds | Top-up wallet from linked debit/credit card |
| Withdraw | Transfer wallet balance to linked bank account |
| Transactions | Full history with filters (type, status, date range, search), pagination, CSV/PDF export |
| Payment Methods | Add, edit, delete, set default debit/credit cards |
| Notifications | Real-time notification history, mark as read, notification preferences |
| Settings | Update profile, change password, update transaction PIN |

### Business Account

Includes all personal features plus:

| Feature | Description |
|---|---|
| Business Setup | Business profile with type, tax ID, contact, verification |
| Invoices | Create, send, mark paid, cancel invoices with line items and tax |
| Loans | Apply for business loans, view EMI schedule, make repayments |
| Analytics | Revenue reports, transaction summaries, payment trends, top customers |

### Static Pages

- Privacy Policy
- Terms & Conditions
- Security
- Contact

---

## Pages & Routes

```
/                        → Home (landing page)
/login                   → Login
/register                → Registration (3-step wizard)
/forgot-password         → Password reset (3-step)
/init                    → Profile init dispatcher (post-login)
/setup/personal          → Personal profile + bank account setup
/setup/business          → Business profile + bank account setup
/setup/mpin              → Transaction PIN (MPIN) setup

── Protected (requires login, inside ShellComponent) ──
/dashboard               → Main dashboard
/transactions            → Transaction history
/payment-methods         → Card management
/requests                → Money requests
/send-money              → Send money
/add-funds               → Add funds to wallet
/withdraw                → Withdraw from wallet
/notifications           → Notifications + preferences
/settings                → Account settings

── Business only (requires BUSINESS account type) ──
/invoices                → Invoice management
/loans                   → Loan management
/analytics               → Business analytics

── Public / Legal ──
/privacy-policy          → Privacy policy
/terms-conditions        → Terms of service
/security                → Security information
/contact                 → Contact + team
```

---

## Authentication & Guards

### `authGuard`

Protects all routes under `ShellComponent` and the setup pages. Redirects to `/login` if no token is found in `localStorage`.

### `businessGuard`

Protects `/invoices`, `/loans`, and `/analytics`. Checks `accountType === 'BUSINESS'` from the profile API. Redirects to `/dashboard` if the user has a personal account.

### Session Cleanup

`AuthService.clearSession()` clears all stored tokens and local state on logout:

```typescript
localStorage.removeItem('revpay_token');
```

---


# Microservices Architecture

> A full-stack financial web application built with Spring Boot microservices, enabling secure digital payments, wallet management, invoicing, and business loans for personal and business users.


---

## Services

| Service | Port | Description | Repo |
|---|---|---|---|
| **eureka-server** | 8761 | Service discovery and registry | [eureka-server](https://github.com/Conginzant-Java-FSE/RevPay-Eureka-Server) |
| **config-server** | 8888 | Centralized configuration | [config-server](https://github.com/Conginzant-Java-FSE/RevPay-Config-Server) |
| **api-gateway** | 8080 | Routing, JWT auth, circuit breakers | [api-gateway](https://github.com/Conginzant-Java-FSE/RevPay-API-Gateway) |
| **auth-service** | 8081 | Registration, login, JWT issuance | [auth-service](https://github.com/Conginzant-Java-FSE/RevPay-Auth-Service) |
| **user-service** | 8082 | Profile management, PIN | [user-service](https://github.com/Conginzant-Java-FSE/RevPay-User-Service) |
| **wallet-service** | 8083 | Wallets, cards, bank accounts | [wallet-service](https://github.com/Conginzant-Java-FSE/RevPay-Wallet-Service) |
| **transaction-service** | 8084 | Transfers, money requests, history | [transaction-service](https://github.com/Conginzant-Java-FSE/RevPay-Transaction-Service) |
| **invoice-loan-service** | 8085 | Invoices, loans (business only) | [invoice-loan-service](https://github.com/Conginzant-Java-FSE/RevPay-Invoice-Loan-Service) |
| **notification-service** | 8086 | In-app notifications, analytics | [notification-service](https://github.com/Conginzant-Java-FSE/RevPay-Notification-Service) |

---

## Technology Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Runtime |
| Spring Boot | 3.2.5 | Microservice framework |
| Spring Cloud | 2023.0.1 | Eureka, Config, Gateway, Feign |
| Spring Security | 6.x | Authentication + authorization |
| Spring Data JPA | 3.x | Database ORM |
| Hibernate | 6.4.4 | JPA implementation |
| Resilience4j | 2.x | Circuit breakers |
| JJWT | 0.11.5 | JWT generation and validation |
| Lombok | latest | Boilerplate reduction |

### Frontend
| Technology | Purpose |
|---|---|
| Angular | SPA framework |
| TypeScript | Language |
| nginx | Production serving |

### Database & Infrastructure
| Technology | Purpose |
|---|---|
| MySQL 8.0 | Persistent storage (6 schemas) |
| Netflix Eureka | Service discovery |
| Spring Cloud Config | Centralized configuration |
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |

---

## Team

RevPay was built by a team of 5 developers as part of a full-stack development project.

| Name | Role |
|---|---|
| Midhun V S | Full Stack Developer · Scrum Master |
| Manoj S | Full Stack Developer |
| Likhith M | Full Stack Developer |
| Ramesh P | Full Stack Developer |
| Kartheek C | Full Stack Developer |

---

## License

This project is developed for academic and demonstration purposes.

---

*RevPay —  Built with ❤ by the RevPay Team*
