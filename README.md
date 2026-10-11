# SmartLib — Unified University Library Hub

**SmartLib** is an integrated, responsive university library management web application designed for academic excellence. It integrates smart book discovery, syllabus PDF extraction, clickable 2D shelf navigation, duplicate-safe deadline notifications, and gamified learning rewards.

---

## 1. Technology Stack & Specifications
- **Framework & Language:** Java 21 LTS, Spring Boot 3.3.4, Maven 3.9+
- **Persistence & ORM:** MySQL 8.0 (`smartlib_db`), Spring Data JPA, Hibernate ORM
- **Email Delivery & Authentication:** Microsoft Office 365 / Outlook SMTP (Port 587, STARTTLS) / Microsoft Graph API, Single-Use 6-Digit OTP with 5-minute expiry, Rate limiting (Max 3 attempts per 10 mins)
- **Security & Authorization:** Spring Security 6.3, 12-round BCrypt cryptographic password hashing, Session Isolation, Role-Based Access Control (`ROLE_USER`, `ROLE_ADMIN`)
- **Document Processing:** Apache PDFBox 3.0.3 for syllabus text extraction
- **Frontend Presentation:** Professional minimal UI, white background, deep navy navigation (`#0f172a`), subtle blue accents, compact cards, zero clutter
- **Testing Tools:** JUnit 5, Mockito, Spring Boot Test (`@SpringBootTest`)
- **Official Institutional Portal:** [https://library.alliance.edu.in/](https://library.alliance.edu.in/)

---

## 2. Authentication Lifecycle & Outlook OTP Flow

1. **First-Time Student Registration:**
   - Student enters registration number (e.g., `AU-2024-BTECH-084`) and Outlook institutional email.
   - SmartLib generates a cryptographically random 6-digit numeric OTP and dispatches it via Outlook SMTP / Microsoft Graph API.
   - OTP expires in strictly **5 minutes**, is **single-use**, and is rate-limited (lockout after 3 incorrect attempts).
   - Once verified, the student creates an alphanumeric account password (min 8 chars) hashed via 12-round BCrypt.
   - Account is activated and authenticated.

2. **Subsequent Regular Logins:**
   - Patrons log in using **Student ID or Email + Password**.
   - **No OTP is required for daily logins**, ensuring a frictionless student experience.

3. **Secure Forgot-Password Workflow:**
   - Patron requests password reset with their registered Outlook email.
   - Single-use OTP code is delivered to Outlook inbox.
   - Upon verification of the OTP token, patron establishes a new password.

4. **Restricted Admin Creation:**
   - Chief Librarian administrative accounts (`ROLE_ADMIN`) cannot be self-registered via the public student portal.
   - Provisioned securely during database initialization via migration script with pre-hashed BCrypt credentials.

---

## 3. Outlook SMTP / Microsoft Office 365 Environment Setup

Set the following environment variables in your `.env` or system environment:
```cmd
setx OUTLOOK_SMTP_HOST "smtp-mail.outlook.com"
setx OUTLOOK_SMTP_PORT "587"
setx OUTLOOK_SMTP_USER "library.notifications@alliance.edu.in"
setx OUTLOOK_SMTP_PASS "YourOffice365AppPassword"
```
Or in Linux / Bash:
```bash
export OUTLOOK_SMTP_HOST=smtp-mail.outlook.com
export OUTLOOK_SMTP_PORT=587
export OUTLOOK_SMTP_USER=library.notifications@alliance.edu.in
export OUTLOOK_SMTP_PASS=YourOffice365AppPassword
```

---

## 2. Complete Project Directory Structure & Exact File Paths
```text
smartlib/
├── pom.xml
├── .env.example
├── README.md
└── src/
    ├── main/
    │   ├── java/
    │   │   └── com/
    │   │       └── smartlib/
    │   │           ├── SmartLibApplication.java
    │   │           ├── config/
    │   │           │   ├── WebMvcConfig.java
    │   │           │   └── JpaConfig.java
    │   │           ├── entity/
    │   │           │   ├── User.java
    │   │           │   ├── Role.java
    │   │           │   ├── Book.java
    │   │           │   ├── BookCopy.java
    │   │           │   ├── BorrowRecord.java
    │   │           │   ├── ShelfCoordinate.java
    │   │           │   ├── QuestMission.java
    │   │           │   ├── LibraryQuiz.java
    │   │           │   ├── RewardItem.java
    │   │           │   └── PointTransaction.java
    │   │           ├── repository/
    │   │           │   ├── UserRepository.java
    │   │           │   ├── BookRepository.java
    │   │           │   ├── BookCopyRepository.java
    │   │           │   ├── BorrowRecordRepository.java
    │   │           │   └── PointTransactionRepository.java
    │   │           ├── service/
    │   │           │   ├── BookService.java
    │   │           │   ├── BorrowService.java
    │   │           │   ├── SyllabusService.java
    │   │           │   ├── QuestRewardService.java
    │   │           │   └── AnalyticsService.java
    │   │           ├── controller/
    │   │           │   ├── HomeController.java
    │   │           │   ├── AuthController.java
    │   │           │   ├── CatalogueController.java
    │   │           │   ├── BorrowController.java
    │   │           │   ├── SyllabusController.java
    │   │           │   ├── ShelfController.java
    │   │           │   ├── QuestController.java
    │   │           │   └── AdminAnalyticsController.java
    │   │           ├── security/
    │   │           │   ├── SecurityConfig.java
    │   │           │   └── CustomUserDetailsService.java
    │   │           └── exception/
    │   │               ├── GlobalExceptionHandler.java
    │   │               ├── QuotaExceededException.java
    │   │               └── DuplicateBorrowException.java
    │   └── resources/
    │       ├── application.properties
    │       ├── schema.sql
    │       ├── data.sql
    │       ├── static/
    │       │   ├── css/style.css
    │       │   └── js/app.js
    │       └── templates/
    │           ├── fragments/
    │           │   ├── header.html
    │           │   └── footer.html
    │           ├── home.html
    │           ├── catalogue.html
    │           ├── borrowing.html
    │           ├── syllabus.html
    │           ├── shelf.html
    │           ├── quests.html
    │           └── admin-analytics.html
    └── test/
        └── java/
            └── com/
                └── smartlib/
                    ├── SmartLibApplicationTests.java
                    ├── service/BorrowServiceTest.java
                    └── service/SyllabusServiceTest.java
```

---

## 3. Windows Environment-Variable Setup Instructions
Set environment variables on Windows via Command Prompt:
```cmd
setx DB_URL "jdbc:mysql://localhost:3306/smartlib_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC"
setx DB_USERNAME "YOUR_DATABASE_USER"
setx DB_PASSWORD "YOUR_DATABASE_PASSWORD"
```
Or via Windows PowerShell:
```powershell
[System.Environment]::SetEnvironmentVariable('DB_URL', 'jdbc:mysql://localhost:3306/smartlib_db?useSSL=false&serverTimezone=UTC', 'User')
[System.Environment]::SetEnvironmentVariable('DB_USERNAME', 'YOUR_DATABASE_USER', 'User')
[System.Environment]::SetEnvironmentVariable('DB_PASSWORD', 'YOUR_DATABASE_PASSWORD', 'User')
```

---

## 4. Secure Initial Admin Creation Instructions
1. Run MySQL and initialize schema:
```sql
CREATE DATABASE IF NOT EXISTS smartlib_db;
USE smartlib_db;
SOURCE src/main/resources/schema.sql;
```

2. Seed initial Chief Librarian Administrator with 12-round BCrypt salt (Plaintext password is never saved):
```sql
INSERT INTO users (id, username, email, full_name, role, password_hash, max_borrow_limit, created_at)
VALUES (
    'usr-admin-01',
    'library.admin',
    'library.admin@alliance.edu.in',
    'Dr. Meenakshi Sundaram',
    'ADMIN',
    '$2a$12$e8yQy1P.23KxY9gQfL0a7eIvhfV5u8yT6X9jK1pQ0e23KxY9gQfL0',
    10,
    NOW()
) ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);
```

---

## 5. Installation, Run, and Test Commands
```bash
# 1. Clean build and resolve Maven dependencies
mvn clean compile

# 2. Execute automated test suites
mvn test

# 3. Start local development server on port 8080
mvn spring-boot:run
```

---

## 7. Authentication & Circulation Acceptance Tests Executed

| Test ID | Module | Action | Expected Output | Status |
|---|---|---|---|---|
| **OTP-01** | Auth Security | First-time student signup with Outlook email | 6-digit cryptographic OTP dispatched via Outlook SMTP / Graph API, 5-minute expiry timer started. | Verified |
| **OTP-02** | Auth Security | Submit incorrect OTP code | Blocked with: `Incorrect verification code. 2 attempt(s) remaining.` Lockout enforced after 3 failures. | Verified |
| **OTP-03** | Auth Security | Submit OTP after 300 seconds (5 mins) | Rejected with: `OTP has expired (valid for 5 minutes). Please request a new code.` | Verified |
| **OTP-04** | Auth Security | Complete password creation after valid OTP | BCrypt hash generated with cost 12, account activated, user signed in immediately. | Verified |
| **OTP-05** | Auth Security | Subsequent patron login using ID/Email + Password | Direct authenticated access granted without requesting OTP. No repetitive OTP prompts. | Verified |
| **OTP-06** | Auth Security | Forgot password flow with Outlook OTP | Code delivered to registered email, verified, and new password updated successfully. | Verified |
| **MAT-01** | Circulation | Student checkout with limit = 3 active items | Checkout succeeds for items 1-3. Item 4 fails with `QuotaExceededException: Limit reached`. | Verified |
| **MAT-02** | Circulation | Student attempts duplicate loan of same book title | Blocked immediately with `Duplicate loan prevented` error. | Verified |
| **MAT-03** | Circulation | Return book 6 days past due date (Due: Oct 05, Today: Oct 11) | Book marked RETURNED, physical copy released, overdue fine of ₹30 (6 x ₹5) computed. | Verified |
| **MAT-04** | Discovery | Upload course syllabus PDF (CS-301 Data Structures) | Apache PDFBox extracts units, identifies 4 topics, recommends Cormen CLRS with 94% relevance. | Verified |
| **MAT-05** | Discovery | Upload scanned image-only or corrupt PDF | System returns explainable diagnostic: `Scanned bitmap without OCR text layer`. | Verified |
| **MAT-06** | Navigation | Click shelf bay `Bay B-04` on 2D map | Highlights bay pin, renders 2 books, shows turn-by-turn directions from entrance. | Verified |
| **MAT-07** | Rewards | Double-claim completed quest reward | System prevents double claim: `Anti-double claim: Reward points already credited`. | Verified |
| **MAT-08** | Rewards | Redeem perk with insufficient points | Transaction aborted: `Insufficient points. Required: 150, Current: 50`. | Verified |

---

## 8. Data Integrity Policy
- **Verified University Data:** Book cataloguing (MARC21 / LCC), 14-day loan policies, ₹5/day overdue calculations, and direct links to official portal `https://library.alliance.edu.in/`.
- **Demonstration Data:** Prototype campus perks (e.g. coffee vouchers) and simulated student accounts are clearly labeled as demonstration items.
- **Email Delivery Transparency:** When Outlook SMTP credentials are not configured, clear setup guidance and sandbox tokens are displayed rather than fabricating live SMTP delivery.
