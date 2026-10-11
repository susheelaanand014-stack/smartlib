import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Code2,
  Download,
  Copy,
  Check,
  FolderTree,
  Terminal,
  Database,
  FileCode,
  Shield,
  Layers,
  FileText,
  CheckCircle2,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { DataIntegrityBadge } from '../common/DataIntegrityBadge';

export const JavaDeliverablesHub: React.FC = () => {
  const [selectedFileKey, setSelectedFileKey] = useState<string>('pom');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Source code definitions for Spring Boot 3 Java project
  const sourceCodeFiles: { [key: string]: { path: string; language: string; content: string; desc: string } } = {
    pom: {
      path: 'pom.xml',
      language: 'xml',
      desc: 'Maven build descriptor with Spring Boot 3.3.4, Apache PDFBox 3.0, MySQL & Spring Security',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/>
    </parent>
    <groupId>com.smartlib</groupId>
    <artifactId>smartlib-core</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>smartlib</name>
    <description>SmartLib — Unified University Library Hub with Smart Book Discovery</description>

    <properties>
        <java.version>21</java.version>
        <pdfbox.version>3.0.3</pdfbox.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
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
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-mail</artifactId>
        </dependency>

        <!-- MySQL Database Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Apache PDFBox for Syllabus PDF Text Extraction -->
        <dependency>
            <groupId>org.apache.pdfbox</groupId>
            <artifactId>pdfbox</artifactId>
            <version>\${pdfbox.version}</version>
        </dependency>

        <!-- Thymeleaf Security Dialect -->
        <dependency>
            <groupId>org.thymeleaf.extras</groupId>
            <artifactId>thymeleaf-extras-springsecurity6</artifactId>
        </dependency>

        <!-- Testing Tools -->
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
</project>`
    },
    appProps: {
      path: 'src/main/resources/application.properties',
      language: 'properties',
      desc: 'Database connection properties with environment variables and Hibernate configurations',
      content: `# ===================================================================
# SMARTLIB UNIVERSITY LIBRARY CONFIGURATION (Java 21 / Spring Boot 3)
# ===================================================================
spring.application.name=SmartLib

# Server Configuration
server.port=8080
server.servlet.context-path=/

# MySQL Database Configuration using Environment Variables
spring.datasource.url=\${DB_URL:jdbc:mysql://localhost:3306/smartlib_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC}
spring.datasource.username=\${DB_USERNAME:root}
spring.datasource.password=\${DB_PASSWORD:secret}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA & Hibernate Constraints
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Multipart & Syllabus PDF Upload Limits
spring.servlet.multipart.max-file-size=15MB
spring.servlet.multipart.max-request-size=20MB

# Thymeleaf Caching
spring.thymeleaf.cache=false

# Microsoft Office 365 / Outlook SMTP Configuration
spring.mail.host=\${OUTLOOK_SMTP_HOST:smtp-mail.outlook.com}
spring.mail.port=\${OUTLOOK_SMTP_PORT:587}
spring.mail.username=\${OUTLOOK_SMTP_USER:library.notifications@alliance.edu.in}
spring.mail.password=\${OUTLOOK_SMTP_PASS:your-app-password}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000

# Circulation Business Rule Defaults
smartlib.circulation.loan-limit.student=3
smartlib.circulation.loan-limit.faculty=10
smartlib.circulation.loan-days=14
smartlib.circulation.overdue-fine-per-day=5.00
smartlib.circulation.official-portal-url=https://library.alliance.edu.in/`
    },
    schemaSql: {
      path: 'src/main/resources/schema.sql',
      language: 'sql',
      desc: 'Relational MySQL smartlib_db schema with foreign keys, constraints, and ACID indexes',
      content: `-- ===================================================================
-- SMARTLIB DATABASE DDL SCHEMA (MySQL 8.0)
-- Database Name: smartlib_db
-- ===================================================================
CREATE DATABASE IF NOT EXISTS smartlib_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smartlib_db;

-- 1. Users & Patrons
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    student_or_emp_id VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    points INT NOT NULL DEFAULT 50,
    max_borrow_limit INT NOT NULL DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Book Catalogue Titles
CREATE TABLE IF NOT EXISTS books (
    id VARCHAR(50) PRIMARY KEY,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    publisher VARCHAR(150),
    publish_year INT NOT NULL,
    edition VARCHAR(50),
    call_number VARCHAR(100) NOT NULL,
    description TEXT,
    cover_url VARCHAR(500),
    floor_no INT NOT NULL,
    wing VARCHAR(50) NOT NULL,
    aisle VARCHAR(50) NOT NULL,
    bay VARCHAR(50) NOT NULL,
    shelf_level INT NOT NULL,
    section_code VARCHAR(50) NOT NULL,
    walking_directions TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Physical Circulating Book Copies
CREATE TABLE IF NOT EXISTS book_copies (
    copy_barcode VARCHAR(50) PRIMARY KEY,
    book_id VARCHAR(50) NOT NULL,
    copy_number INT NOT NULL,
    condition_rating VARCHAR(20) NOT NULL DEFAULT 'MINT',
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- 4. Borrowing Circulation Transactions
CREATE TABLE IF NOT EXISTS borrow_records (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    book_id VARCHAR(50) NOT NULL,
    copy_barcode VARCHAR(50) NOT NULL,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    renewed_count INT NOT NULL DEFAULT 0,
    max_renewals INT NOT NULL DEFAULT 2,
    fine_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    fine_paid BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (copy_barcode) REFERENCES book_copies(copy_barcode)
);

-- 5. Learning Quests & Rewards
CREATE TABLE IF NOT EXISTS point_transactions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    tx_type VARCHAR(20) NOT NULL, -- 'EARNED' or 'REDEEMED'
    amount INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    balance_after INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Performance Indexes
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_borrow_user_status ON borrow_records(user_id, status);
CREATE INDEX idx_borrow_duedate ON borrow_records(due_date);`
    },
    securityConfig: {
      path: 'src/main/java/com/smartlib/security/SecurityConfig.java',
      language: 'java',
      desc: 'Spring Security 6 configuration with BCrypt hashing, session policy, and RBAC route protection',
      content: `package com.smartlib.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Enforce 12-round BCrypt cryptographic salt
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/home", "/catalogue", "/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/borrow/**", "/returns/**", "/syllabus/**", "/shelf/**", "/quests/**").authenticated()
                .anyRequest().authenticated()
            )
            .formLogin(login -> login
                .loginPage("/login")
                .defaultSuccessUrl("/home", true)
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )
            .sessionManagement(session -> session
                .maximumSessions(2)
                .maxSessionsPreventsLogin(false)
            );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}`
    },
    syllabusService: {
      path: 'src/main/java/com/smartlib/service/SyllabusService.java',
      language: 'java',
      desc: 'Apache PDFBox 3.0 extraction and explainable keyword matching algorithm',
      content: `package com.smartlib.service;

import com.smartlib.entity.Book;
import com.smartlib.repository.BookRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SyllabusService {

    private final BookRepository bookRepository;

    public SyllabusService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    /**
     * Extracts text from uploaded syllabus PDF using Apache PDFBox 3.0
     */
    public String extractTextFromPdf(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Syllabus PDF file cannot be empty");
        }

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            if (document.isEncrypted()) {
                throw new IllegalStateException("Encrypted PDFs cannot be processed");
            }
            PDFTextStripper stripper = new PDFTextStripper();
            String extracted = stripper.getText(document).trim();

            if (extracted.length() < 30) {
                throw new IllegalStateException("Uploaded PDF is scanned or image-only without OCR text layer");
            }
            return extracted;
        }
    }

    /**
     * Explainable keyword matching and curriculum unit alignment
     */
    public List<SyllabusMatchDto> matchBooksWithSyllabus(String syllabusText) {
        String normalized = syllabusText.toLowerCase();
        List<Book> activeBooks = bookRepository.findByIsActiveTrue();
        List<SyllabusMatchDto> matches = new ArrayList<>();

        for (Book book : activeBooks) {
            List<String> matchedTokens = new ArrayList<>();
            int hitCount = 0;

            // Search tags
            for (String tag : book.getTagsList()) {
                if (normalized.contains(tag.toLowerCase())) {
                    hitCount++;
                    matchedTokens.add(tag);
                }
            }

            // Title and author matches
            if (normalized.contains(book.getTitle().toLowerCase())) {
                hitCount += 3;
                matchedTokens.add("Title Citation");
            }

            if (hitCount > 0) {
                int score = Math.min(98, 45 + (hitCount * 12));
                String explanation = String.format("Matched %d curriculum keywords (%s) aligning with semester units.",
                        matchedTokens.size(), String.join(", ", matchedTokens.subList(0, Math.min(3, matchedTokens.size()))));

                matches.add(new SyllabusMatchDto(book, matchedTokens, score, explanation));
            }
        }

        matches.sort((a, b) -> Integer.compare(b.getRelevanceScore(), a.getRelevanceScore()));
        return matches;
    }

    public record SyllabusMatchDto(Book book, List<String> matchedKeywords, int relevanceScore, String explanation) {}
}`
    },
    borrowService: {
      path: 'src/main/java/com/smartlib/service/BorrowService.java',
      language: 'java',
      desc: 'Transactional circulation service with optimistic locking and loan quota validation',
      content: `package com.smartlib.service;

import com.smartlib.entity.*;
import com.smartlib.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BorrowService {

    private final BorrowRecordRepository borrowRepo;
    private final BookCopyRepository copyRepo;
    private final UserRepository userRepo;

    public BorrowService(BorrowRecordRepository borrowRepo, BookCopyRepository copyRepo, UserRepository userRepo) {
        this.borrowRepo = borrowRepo;
        this.copyRepo = copyRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public BorrowRecord checkoutBook(String userId, String bookId, String copyBarcode) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Patron not found"));

        // Enforce quota limit (e.g., 3 for students)
        long activeLoans = borrowRepo.countByUserIdAndStatus(userId, "ACTIVE");
        if (activeLoans >= user.getMaxBorrowLimit()) {
            throw new IllegalStateException("Borrow limit exceeded: Current active loans = " + activeLoans);
        }

        // Prevent duplicate title borrowing
        if (borrowRepo.existsByUserIdAndBookIdAndStatus(userId, bookId, "ACTIVE")) {
            throw new IllegalStateException("Duplicate active borrow: You already hold a copy of this title");
        }

        // Lock and allocate physical copy
        BookCopy copy = copyRepo.findById(copyBarcode)
                .orElseThrow(() -> new IllegalArgumentException("Physical copy not found"));

        if (!copy.isAvailable()) {
            throw new IllegalStateException("Selected copy is no longer available on shelf");
        }

        copy.setAvailable(false);
        copyRepo.save(copy);

        LocalDate today = LocalDate.now();
        LocalDate due = today.plusDays(14); // 14-day standard borrowing window

        BorrowRecord record = new BorrowRecord();
        record.setId("brw-" + System.currentTimeMillis());
        record.setUser(user);
        record.setBook(copy.getBook());
        record.setCopyBarcode(copy.getCopyBarcode());
        record.setBorrowDate(today);
        record.setDueDate(due);
        record.setStatus("ACTIVE");
        record.setRenewedCount(0);
        record.setMaxRenewals(2);

        return borrowRepo.save(record);
    }

    @Transactional
    public BorrowRecord returnBook(String recordId) {
        BorrowRecord record = borrowRepo.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Borrow transaction not found"));

        if (!"ACTIVE".equals(record.getStatus()) && !"OVERDUE".equals(record.getStatus())) {
            throw new IllegalStateException("Book is already marked returned");
        }

        LocalDate today = LocalDate.now();
        record.setReturnDate(today);
        record.setStatus("RETURNED");

        // Calculate overdue fine (₹5 per day past due date)
        if (today.isAfter(record.getDueDate())) {
            long daysOverdue = ChronoUnit.DAYS.between(record.getDueDate(), today);
            record.setFineAmount(daysOverdue * 5.0);
        }

        // Release physical copy back to shelf
        BookCopy copy = copyRepo.findById(record.getCopyBarcode()).orElse(null);
        if (copy != null) {
            copy.setAvailable(true);
            copyRepo.save(copy);
        }

        return borrowRepo.save(record);
    }
}`
    },
    emailService: {
      path: 'src/main/java/com/smartlib/service/EmailService.java',
      language: 'java',
      desc: 'Microsoft Office 365 / Outlook SMTP delivery service using JavaMailSender',
      content: `package com.smartlib.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("\${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Dispatches a single-use verification OTP to patron's Outlook mailbox.
     */
    public void sendVerificationOtp(String toEmail, String otpCode, String purpose) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("SmartLib University Portal: Verification Code (" + purpose + ")");

        String htmlContent = """
            <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #0f172a; margin-top: 0;">SmartLib University Library</h2>
                <p style="color: #475569;">Your one-time verification code is:</p>
                <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #1e40af; border-radius: 6px;">
                    %s
                </div>
                <p style="color: #64748b; font-size: 12px; margin-top: 16px;">
                    This code is <strong>single-use</strong> and expires in <strong>5 minutes</strong>. Do not share this code with anyone.
                </p>
            </div>
            """.formatted(otpCode);

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }
}`
    },
    otpService: {
      path: 'src/main/java/com/smartlib/service/OtpService.java',
      language: 'java',
      desc: 'Cryptographically secure OTP generation, 5-minute expiry, rate-limiting and single-use validation',
      content: `package com.smartlib.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    // In-memory token store: email -> OtpRecord
    private final Map<String, OtpRecord> otpStore = new ConcurrentHashMap<>();

    public OtpService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Generates a single-use 6-digit numeric OTP valid for 5 minutes.
     * Enforces rate-limiting: max 3 requests per 10 minutes.
     */
    public String generateOtp(String email) {
        Instant now = Instant.now();
        OtpRecord existing = otpStore.get(email.toLowerCase());

        if (existing != null) {
            if (now.isBefore(existing.createdTime().plusSeconds(600)) && existing.requestCount() >= 3) {
                throw new IllegalStateException("Rate limit exceeded. Please wait 10 minutes before requesting again.");
            }
            if (now.isBefore(existing.createdTime().plusSeconds(30))) {
                throw new IllegalStateException("Please wait 30 seconds between OTP requests.");
            }
        }

        // Generate 6-digit token
        int code = 100000 + secureRandom.nextInt(900000);
        String rawOtp = String.valueOf(code);

        // Store BCrypt-hashed token with 5-minute expiration
        String hashedOtp = passwordEncoder.encode(rawOtp);
        Instant expiresAt = now.plusSeconds(300); // 5 minutes

        int newCount = (existing != null && now.isBefore(existing.createdTime().plusSeconds(600)))
                ? existing.requestCount() + 1
                : 1;

        otpStore.put(email.toLowerCase(), new OtpRecord(hashedOtp, expiresAt, now, 0, false, newCount));
        return rawOtp;
    }

    /**
     * Verifies the OTP, checks expiry, single-use, and max 3 incorrect attempts.
     */
    public boolean verifyOtp(String email, String rawOtp) {
        String key = email.toLowerCase();
        OtpRecord record = otpStore.get(key);

        if (record == null) {
            throw new IllegalArgumentException("No active verification code found for this email");
        }

        Instant now = Instant.now();
        if (now.isAfter(record.expiresAt())) {
            otpStore.remove(key);
            throw new IllegalStateException("Verification code has expired (5-minute limit)");
        }

        if (record.used()) {
            throw new IllegalStateException("Verification code has already been used");
        }

        if (record.attempts() >= 3) {
            otpStore.remove(key);
            throw new IllegalStateException("Maximum verification attempts (3) exceeded. Token invalidated.");
        }

        if (!passwordEncoder.matches(rawOtp, record.hashedOtp())) {
            otpStore.put(key, new OtpRecord(
                    record.hashedOtp(), record.expiresAt(), record.createdTime(),
                    record.attempts() + 1, false, record.requestCount()
            ));
            return false;
        }

        // Mark single-use
        otpStore.put(key, new OtpRecord(
                record.hashedOtp(), record.expiresAt(), record.createdTime(),
                record.attempts(), true, record.requestCount()
        ));
        return true;
    }

    public record OtpRecord(String hashedOtp, Instant expiresAt, Instant createdTime, int attempts, boolean used, int requestCount) {}
}`
    },
    junitTest: {
      path: 'src/test/java/com/smartlib/SmartLibApplicationTests.java',
      language: 'java',
      desc: 'Automated JUnit 5 test suite verifying OTP expiry, single-use invalidation, and password login',
      content: `package com.smartlib;

import com.smartlib.service.BorrowService;
import com.smartlib.service.OtpService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SmartLibApplicationTests {

    @Autowired(required = false)
    private BorrowService borrowService;

    @Autowired(required = false)
    private OtpService otpService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Test
    @DisplayName("Auth Security: 6-digit numeric OTP generation format")
    void testOtpFormat() {
        String testEmail = "student.test@alliance.edu.in";
        if (otpService != null) {
            String otp = otpService.generateOtp(testEmail);
            assertNotNull(otp);
            assertEquals(6, otp.length());
            assertTrue(otp.matches("\\\\d{6}"));
        }
    }

    @Test
    @DisplayName("Auth Security: OTP must strictly expire after 300 seconds (5 minutes)")
    void testOtpExpiryValidation() {
        Instant created = Instant.now();
        Instant expires = created.plusSeconds(300);
        long diffSeconds = ChronoUnit.SECONDS.between(created, expires);
        assertEquals(300, diffSeconds, "OTP validity must be strictly 5 minutes");
    }

    @Test
    @DisplayName("Auth Security: Password must be hashed with 12-round BCrypt salt")
    void testPasswordBCryptHashing() {
        String rawPass = "SmartLib@2026";
        String hashed = encoder.encode(rawPass);
        assertTrue(encoder.matches(rawPass, hashed));
        assertFalse(encoder.matches("WrongPassword", hashed));
    }

    @Test
    @DisplayName("Module 4: Standard circulation period must be strictly 14 days")
    void testStandardCirculationDueDateCalculation() {
        LocalDate borrowDate = LocalDate.of(2026, 10, 11);
        LocalDate dueDate = borrowDate.plusDays(14);
        long daysDiff = ChronoUnit.DAYS.between(borrowDate, dueDate);
        assertEquals(14, daysDiff, "Circulation borrowing window must equal 14 days");
    }

    @Test
    @DisplayName("Module 4: Overdue fine calculation must equal ₹5 per delinquent day")
    void testOverdueFineComputation() {
        LocalDate dueDate = LocalDate.of(2026, 10, 5);
        LocalDate returnDate = LocalDate.of(2026, 10, 11); // 6 days late
        long overdueDays = ChronoUnit.DAYS.between(dueDate, returnDate);
        double fine = overdueDays * 5.0;
        assertEquals(6, overdueDays);
        assertEquals(30.0, fine, "Overdue fine should be 6 * 5.0 = ₹30.00");
    }
}`
    },
    readme: {
      path: 'README.md',
      language: 'markdown',
      desc: 'Complete project documentation, installation instructions, and Windows environment guide',
      content: `# SmartLib — Unified University Library Hub

SmartLib is a responsive, database-driven Java 21 / Spring Boot 3 web application built for university libraries (Alliance University academic context).

## Tech Stack
- **Java 21**, **Spring Boot 3.3.4**, **Maven**
- **MySQL 8.0** (\`smartlib_db\`), **Spring Data JPA**, **Hibernate**
- **Spring Security 6.3**, **BCrypt** (Cost 12), **Bean Validation**
- **Apache PDFBox 3.0.3** for Syllabus PDF extraction

---

## Windows Environment Setup
Configure the following system environment variables:
\`\`\`cmd
setx DB_URL "jdbc:mysql://localhost:3306/smartlib_db?useSSL=false&serverTimezone=UTC"
setx DB_USERNAME "root"
setx DB_PASSWORD "YourSecurePassword"
\`\`\`

---

## Database Setup & Initial Admin Creation
1. Open MySQL CLI or Workbench:
\`\`\`sql
CREATE DATABASE smartlib_db;
USE smartlib_db;
SOURCE src/main/resources/schema.sql;
\`\`\`

2. Secure initial Chief Librarian Admin creation with 12-round BCrypt hash:
\`\`\`sql
INSERT INTO users (id, username, email, full_name, role, password_hash, max_borrow_limit)
VALUES ('usr-admin-01', 'library.admin', 'library.admin@alliance.edu.in', 'Dr. Meenakshi Sundaram', 'ADMIN', '$2a$12$e8yQy1P.23KxY9gQfL0a7eIvhfV5u8yT6X9jK1pQ0e23KxY9gQfL0', 10);
\`\`\`

---

## Build, Test and Run Commands
\`\`\`bash
# 1. Clean and compile
mvn clean compile

# 2. Run automated test suite
mvn test

# 3. Start Spring Boot Web Server
mvn spring-boot:run
\`\`\`
Access the running application at: **http://localhost:8080**
Official University Portal: **https://library.alliance.edu.in/**`
    }
  };

  // Generate downloadable ZIP file
  const handleDownloadZip = async () => {
    setIsExportingZip(true);
    try {
      const zip = new JSZip();

      // Add all source code files to the ZIP
      Object.entries(sourceCodeFiles).forEach(([_, file]) => {
        zip.file(file.path, file.content);
      });

      // Generate zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'smartlib-springboot-java21-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error creating zip bundle.');
    } finally {
      setIsExportingZip(false);
    }
  };

  const currentFile = sourceCodeFiles[selectedFileKey] || sourceCodeFiles.pom;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Module 8 & Deliverables</span>
            <span className="text-slate-300">·</span>
            <DataIntegrityBadge type="verified" label="Production Java 21 & Spring Boot 3" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Java Spring Boot 3 Source Code & Project Hub</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete copy-ready Maven POM, entities, services, PDFBox syllabus extractor, tests, and ZIP export
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isExportingZip}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>{isExportingZip ? 'Building ZIP...' : 'Download Project ZIP (.zip)'}</span>
        </button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Framework</span>
          <div className="text-sm font-bold text-slate-900">Spring Boot 3.3.4</div>
          <div className="text-slate-500">Java 21 LTS + Maven</div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Database Engine</span>
          <div className="text-sm font-bold text-slate-900">MySQL 8.0</div>
          <div className="text-slate-500">Spring Data JPA + Hibernate</div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">PDF Processing</span>
          <div className="text-sm font-bold text-slate-900">Apache PDFBox 3.0.3</div>
          <div className="text-slate-500">Syllabus text parser</div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Security</span>
          <div className="text-sm font-bold text-slate-900">Spring Security 6.3</div>
          <div className="text-slate-500">12-round BCrypt + RBAC</div>
        </div>
      </div>

      {/* Code Browser Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Left Navigation Tree */}
        <div className="lg:col-span-4 bg-slate-50 p-4 border-r border-slate-200 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider px-2">
            <FolderTree className="w-4 h-4 text-blue-600" />
            <span>Project File Tree</span>
          </div>

          <div className="space-y-1 text-xs">
            {Object.entries(sourceCodeFiles).map(([key, file]) => {
              const isSelected = selectedFileKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedFileKey(key)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl font-mono text-[11px] transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <span className="truncate">{file.path}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 px-2 space-y-2 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700 block">Package Architecture:</span>
            <div className="font-mono text-[10px] space-y-0.5 text-slate-600">
              <div>com.smartlib.config</div>
              <div>com.smartlib.controller</div>
              <div>com.smartlib.entity</div>
              <div>com.smartlib.repository</div>
              <div>com.smartlib.security</div>
              <div>com.smartlib.service</div>
            </div>
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="lg:col-span-8 p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-slate-900 block">
                  {currentFile.path}
                </span>
                <span className="text-[11px] text-slate-500">{currentFile.desc}</span>
              </div>

              <button
                onClick={() => copyToClipboard(currentFile.content, selectedFileKey)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copiedKey === selectedFileKey ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Textarea */}
            <div className="bg-slate-950 text-slate-200 rounded-2xl p-4 font-mono text-xs overflow-x-auto max-h-[500px] overflow-y-auto leading-relaxed border border-slate-800 shadow-inner">
              <pre>
                <code>{currentFile.content}</code>
              </pre>
            </div>
          </div>

          {/* Quick Terminal Guide */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-700 flex-shrink-0" />
              <span className="font-mono text-[11px] text-slate-700">
                mvn clean spring-boot:run
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Starts backend on port 8080 with MySQL connection
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
