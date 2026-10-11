export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  studentOrEmpId: string;
  department: string;
  points: number;
  maxBorrowLimit: number;
  registeredAt: string;
  avatarUrl?: string;
  passwordHash?: string;
  isEmailVerified?: boolean;
}

export interface OtpSessionState {
  email: string;
  studentId: string;
  purpose: 'SIGNUP' | 'PASSWORD_RESET';
  verificationToken?: string;
  expiresInSeconds?: number;
  sandboxToken?: string;
}

export interface ShelfCoordinate {
  floor: number;
  wing: string;
  aisle: string;
  bay: string;
  shelfLevel: number;
  sectionCode: string;
  x: number; // For 2D map visualization (0-100%)
  y: number; // For 2D map visualization (0-100%)
  walkingDirections: string;
}

export interface BookCopy {
  copyBarcode: string;
  bookId: string;
  copyNumber: number;
  condition: 'MINT' | 'GOOD' | 'FAIR';
  isAvailable: boolean;
  currentBorrowerId?: string;
  currentDueDate?: string;
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  publisher: string;
  publishYear: number;
  edition: string;
  callNumber: string;
  description: string;
  coverUrl: string;
  totalCopies: number;
  availableCopies: number;
  isActive: boolean;
  shelf: ShelfCoordinate;
  tags: string[];
  copies: BookCopy[];
}

export interface BorrowRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCoverUrl: string;
  copyBarcode: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
  renewedCount: number;
  maxRenewals: number;
  fineAmount: number; // ₹5/day overdue
  finePaid: boolean;
  notes?: string;
}

export interface SyllabusRecommendation {
  book: Book;
  matchedKeywords: string[];
  relevanceScore: number;
  explanation: string;
  unitCoverage: string[];
}

export interface SyllabusExtractionResult {
  syllabusTitle: string;
  courseCode: string;
  detectedTopics: string[];
  extractedTextLength: number;
  confidenceScore: number;
  isScannedOrUnreadable: boolean;
  diagnosticMessage?: string;
  recommendations: SyllabusRecommendation[];
}

export interface QuestMission {
  id: string;
  title: string;
  description: string;
  category: 'RESEARCH' | 'DISCOVERY' | 'DIVERSITY' | 'CITATIONS';
  rewardPoints: number;
  currentProgress: number;
  targetProgress: number;
  unit: string;
  isCompleted: boolean;
  isClaimed: boolean;
  badgeIcon: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LibraryQuiz {
  id: string;
  title: string;
  subject: string;
  description: string;
  rewardPoints: number;
  durationMinutes: number;
  questions: QuizQuestion[];
  isCompleted: boolean;
  lastScore?: number;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  category: 'PRIVILEGE' | 'CAMPUS_PERK' | 'STUDY_BENEFIT';
  stockRemaining: number;
  isDemonstrationOnly: boolean; // Clearly distinct verified vs demo perk
  iconName: string;
  terms: string;
}

export interface PointTransaction {
  id: string;
  userId: string;
  type: 'EARNED' | 'REDEEMED';
  amount: number;
  description: string;
  timestamp: string;
  balanceAfter: number;
}

export interface LibraryAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'CIRCULATION' | 'EVENTS' | 'RESOURCES' | 'EXAM_PREP';
  isImportant?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'DUE_SOON' | 'OVERDUE' | 'REWARD' | 'ANNOUNCEMENT' | 'BORROW_CONFIRM';
  timestamp: string;
  read: boolean;
  actionTab?: string;
}
