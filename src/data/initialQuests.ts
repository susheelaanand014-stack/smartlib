import { QuestMission, LibraryQuiz, RewardItem, LibraryAnnouncement } from '../types/library';

export const INITIAL_MISSIONS: QuestMission[] = [
  {
    id: 'msn-01',
    title: 'Catalogue Navigator',
    description: 'Explore the library catalogue and locate physical book coordinates using the Shelf Finder.',
    category: 'DISCOVERY',
    rewardPoints: 50,
    currentProgress: 1,
    targetProgress: 1,
    unit: 'Search',
    isCompleted: true,
    isClaimed: true,
    badgeIcon: 'Compass'
  },
  {
    id: 'msn-02',
    title: 'Research Explorer',
    description: 'Borrow at least 2 recommended textbooks or reference manuals from your degree curriculum.',
    category: 'RESEARCH',
    rewardPoints: 100,
    currentProgress: 2,
    targetProgress: 2,
    unit: 'Books',
    isCompleted: true,
    isClaimed: false,
    badgeIcon: 'BookOpen'
  },
  {
    id: 'msn-03',
    title: 'Cross-Disciplinary Scholar',
    description: 'Check out books across at least two distinct departments (e.g., Computer Science and Management).',
    category: 'DIVERSITY',
    rewardPoints: 120,
    currentProgress: 1,
    targetProgress: 2,
    unit: 'Disciplines',
    isCompleted: false,
    isClaimed: false,
    badgeIcon: 'Sparkles'
  },
  {
    id: 'msn-04',
    title: 'Punctual Scholar',
    description: 'Return or renew your borrowed books at least 2 days before the due deadline without incurring any fine.',
    category: 'CITATIONS',
    rewardPoints: 75,
    currentProgress: 1,
    targetProgress: 1,
    unit: 'Return',
    isCompleted: true,
    isClaimed: false,
    badgeIcon: 'Clock'
  }
];

export const INITIAL_QUIZZES: LibraryQuiz[] = [
  {
    id: 'qz-algo',
    title: 'Algorithms & Complexity Mastery',
    subject: 'Computer Science',
    description: 'Test your understanding of Big-O notations, binary search tree balanced properties, and dynamic programming.',
    rewardPoints: 80,
    durationMinutes: 5,
    isCompleted: false,
    questions: [
      {
        id: 'q1',
        question: 'What is the worst-case time complexity of QuickSort when a naive first-element pivot is picked on a sorted array?',
        options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
        correctIndex: 1,
        explanation: 'When the partition is completely unbalanced on already sorted inputs, QuickSort degenerates to O(n²).'
      },
      {
        id: 'q2',
        question: 'Which algorithmic paradigm solves subproblems only once and memoizes results in a lookup table?',
        options: ['Greedy method', 'Divide and conquer', 'Dynamic programming', 'Backtracking'],
        correctIndex: 2,
        explanation: 'Dynamic programming optimizes overlapping subproblems by storing calculated subproblem solutions.'
      },
      {
        id: 'q3',
        question: 'In Dijkstra’s shortest path algorithm with a min-priority heap, what is the running time for graph G=(V, E)?',
        options: ['O(V²)', 'O((V + E) log V)', 'O(V * E)', 'O(E log E)'],
        correctIndex: 1,
        explanation: 'Using a binary min-heap priority queue, Dijkstra executes in O((V + E) log V).'
      }
    ]
  },
  {
    id: 'qz-dbs',
    title: 'Database Transactions & ACID Properties',
    subject: 'Database Systems',
    description: 'Verify your proficiency in SQL isolation levels, serializability, and transaction atomicity.',
    rewardPoints: 70,
    durationMinutes: 4,
    isCompleted: true,
    lastScore: 100,
    questions: [
      {
        id: 'qd1',
        question: 'Which ACID property guarantees that all operations within a transaction are completed or none are executed?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correctIndex: 0,
        explanation: 'Atomicity enforces the "all-or-nothing" rule in database transactions.'
      },
      {
        id: 'qd2',
        question: 'Which isolation level prevents Dirty Reads and Non-Repeatable Reads, but may still permit Phantom Reads in standard SQL?',
        options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
        correctIndex: 2,
        explanation: 'Repeatable Read locks read rows preventing modifications, but newly inserted range rows (phantoms) can still appear unless gap locks are held.'
      }
    ]
  },
  {
    id: 'qz-citation',
    title: 'Academic Integrity & Research Citation Standards',
    subject: 'Research Methodology',
    description: 'Learn ethical citation practices, avoiding plagiarism, and navigating peer-reviewed journal indexes.',
    rewardPoints: 60,
    durationMinutes: 4,
    isCompleted: false,
    questions: [
      {
        id: 'qc1',
        question: 'When citing an author’s exact words in APA 7th edition, what information MUST accompany the author and year in parenthetical citations?',
        options: ['ISBN number', 'Page or paragraph number', 'Library shelf code', 'Publisher address'],
        correctIndex: 1,
        explanation: 'Direct quotations require the specific page number (e.g., p. 45) or paragraph number in APA 7.'
      },
      {
        id: 'qc2',
        question: 'What is the primary indicator of a peer-reviewed academic article versus a general web post?',
        options: ['It contains color photographs', 'Rigorous editorial critique and blind evaluation by domain subject experts', 'It is published on social media', 'It has more than 50 pages'],
        correctIndex: 1,
        explanation: 'Peer review involves critical evaluation by independent subject-matter scholars before publication.'
      }
    ]
  }
];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'rw-01',
    title: '7-Day Book Loan Extension Pass',
    description: 'Extend any active book loan period by an extra 7 days beyond standard loan policies without renewal count deduction.',
    pointsRequired: 120,
    category: 'PRIVILEGE',
    stockRemaining: 18,
    isDemonstrationOnly: false,
    iconName: 'CalendarPlus',
    terms: 'Valid once per semester on any non-reserved general circulating item.'
  },
  {
    id: 'rw-02',
    title: 'Quiet Study Carrel Reservation (3 Hours)',
    description: 'Reserve a soundproof single-occupancy study cubicle with ergonomic chair and high-speed LAN dock on Floor 2.',
    pointsRequired: 150,
    category: 'STUDY_BENEFIT',
    stockRemaining: 8,
    isDemonstrationOnly: false,
    iconName: 'DoorClosed',
    terms: 'Reserve at least 2 hours in advance. Subject to library operating hours.'
  },
  {
    id: 'rw-03',
    title: 'Late Fine Exemption Pass (Up to ₹50)',
    description: 'Waive overdue circulation fines up to ₹50 for a returned book item.',
    pointsRequired: 100,
    category: 'PRIVILEGE',
    stockRemaining: 25,
    isDemonstrationOnly: false,
    iconName: 'ShieldCheck',
    terms: 'Applicable once per academic term; cannot be applied to lost book replacement fees.'
  },
  {
    id: 'rw-04',
    title: 'Campus Cafeteria Coffee Voucher (Demo Perk)',
    description: 'Complimentary artisan roast or cappuccino at the Central Campus Library Atrium Bistro.',
    pointsRequired: 200,
    category: 'CAMPUS_PERK',
    stockRemaining: 15,
    isDemonstrationOnly: true, // Clearly marked as demo perk
    iconName: 'Coffee',
    terms: 'Demonstration item: prototype partnership with campus catering.'
  },
  {
    id: 'rw-05',
    title: 'University Library Commemorative Bookmark & Notebook',
    description: 'Official SmartLib embossed leatherette bookmark with Alliance University crest and reading tracker notepad.',
    pointsRequired: 180,
    category: 'STUDY_BENEFIT',
    stockRemaining: 12,
    isDemonstrationOnly: false,
    iconName: 'Bookmark',
    terms: 'Collect at the Circulation Help Desk on Floor 1 upon presenting verified code.'
  }
];

export const INITIAL_ANNOUNCEMENTS: LibraryAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Mid-Term Examination Extended Library Hours',
    content: 'Starting Monday, the Central Library reading halls and Digital Resource Center will remain open 24/7. Circulation desks will operate until 10:00 PM.',
    date: 'Oct 10, 2026',
    category: 'EXAM_PREP',
    isImportant: true
  },
  {
    id: 'ann-2',
    title: 'New Springer & IEEE Xplore Institutional Subscriptions Active',
    content: 'Full-text access to over 3,200 peer-reviewed journals is now accessible campus-wide and via institutional proxy login.',
    date: 'Oct 08, 2026',
    category: 'RESOURCES'
  },
  {
    id: 'ann-3',
    title: 'Official Library Portal Notice',
    content: 'For remote book holds, off-campus VPN authentication, and formal academic thesis repository deposits, visit https://library.alliance.edu.in/.',
    date: 'Oct 05, 2026',
    category: 'CIRCULATION'
  }
];

export const SAMPLE_SYLLABI = [
  {
    id: 'syl-cs301',
    code: 'CS-301',
    title: 'Data Structures and Analysis of Algorithms',
    department: 'Computer Science & Engineering',
    semester: 'Semester III',
    sampleText: `ALLIANCE UNIVERSITY - SCHOOL OF COMPUTING
COURSE CODE: CS-301
COURSE TITLE: Data Structures & Analysis of Algorithms
CREDITS: 4-0-0 (4 Credits)

UNIT I: Asymptotic Analysis and Linear Structures
- Time and space complexity, asymptotic notations (Big O, Omega, Theta)
- Array representations, linked lists (singly, doubly, circular)
- Stacks, queues, double-ended queues, applications in expression evaluation

UNIT II: Trees and Binary Search Structures
- Binary trees, traversals (inorder, preorder, postorder)
- Binary search trees (BST), AVL trees, red-black tree properties
- Priority queues, binary heaps, heapsort

UNIT III: Graph Algorithms and Advanced Paradigms
- Graph representations (adjacency matrix, adjacency list)
- Breadth-first search (BFS), Depth-first search (DFS)
- Minimum spanning trees (Prim's, Kruskal's algorithms)
- Single source shortest paths (Dijkstra, Bellman-Ford)
- Dynamic programming: matrix chain multiplication, longest common subsequence

UNIT IV: Complexity Theory and NP-Completeness
- P, NP, NP-Complete and NP-Hard classes
- Approximation algorithms and randomized heuristics

RECOMMENDED REFERENCE TEXTBOOKS:
1. Introduction to Algorithms - Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein. MIT Press.
2. The C Programming Language - Brian W. Kernighan and Dennis M. Ritchie.
3. Clean Code: Agile Software Craftsmanship - Robert C. Martin.`
  },
  {
    id: 'syl-cs302',
    code: 'CS-302',
    title: 'Operating Systems & Concurrency',
    department: 'Computer Science & Engineering',
    semester: 'Semester IV',
    sampleText: `ALLIANCE UNIVERSITY - SCHOOL OF COMPUTING
COURSE CODE: CS-302
COURSE TITLE: Operating Systems Architecture & Concurrency
CREDITS: 3-1-0 (4 Credits)

UNIT I: Operating System Structures & Process Management
- Kernel architectures, system calls, interrupt handling
- Process state diagrams, process control blocks (PCB), CPU scheduling algorithms
- Multi-threading models, race conditions, critical section problem, Peterson's algorithm, semaphores, mutexes

UNIT II: Concurrency, Deadlocks & Synchronization
- Deadlock characterization, Resource Allocation Graphs
- Deadlock prevention, avoidance (Banker's Algorithm), detection and recovery

UNIT III: Memory Management & Virtual Memory
- Contiguous memory allocation, paging architectures, segmentation
- Virtual memory concepts, demand paging, Page Replacement Algorithms (FIFO, LRU, Optimal)
- Thrashing and working set models

UNIT IV: Storage & File Systems
- Disk scheduling (FCFS, SSTF, SCAN, C-SCAN), RAID structures
- File system interface, directory implementation, free space management

RECOMMENDED TEXTBOOKS:
1. Operating System Concepts - Abraham Silberschatz, Peter B. Galvin, Greg Gagne. Wiley.
2. The C Programming Language - Brian Kernighan & Dennis Ritchie.`
  },
  {
    id: 'syl-mgmt401',
    code: 'MGT-401',
    title: 'Strategic Marketing Management',
    department: 'School of Business',
    semester: 'MBA Semester II',
    sampleText: `ALLIANCE UNIVERSITY - ALLIANCE SCHOOL OF BUSINESS
COURSE CODE: MGT-401
COURSE TITLE: Strategic Marketing Management

UNIT I: Understanding Marketing & Customer Value
- Modern marketing orientations, capturing customer lifetime value
- Competitive analysis, market segmentation, targeting and brand positioning (STP framework)

UNIT II: Product & Pricing Strategies
- Product life cycle management, brand equity models
- Value-based pricing, price skimming, dynamic pricing metrics

UNIT III: Distribution & Omnichannel Communication
- Marketing channels, supply chain logistics, direct marketing
- Integrated marketing communications (IMC), digital advertising and brand narratives

RECOMMENDED TEXTBOOKS:
1. Marketing Management - Philip Kotler, Kevin Lane Keller, Alexander Chernev. Pearson.`
  }
];
