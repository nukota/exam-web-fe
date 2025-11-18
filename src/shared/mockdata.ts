import type { User, Exam, Question, Submission } from "./dtos";

// Mock Users
export const mockUsers: User[] = [
  {
    user_id: "student1",
    username: "alice.johnson",
    full_name: "Alice Johnson",
    email: "alice@example.com",
    role: "student",
    dob: "2005-03-15",
    class_name: "Class 12A",
    school_name: "Demo High School",
  },
  {
    user_id: "student2",
    username: "bob.smith",
    full_name: "Bob Smith",
    email: "bob@example.com",
    role: "student",
    dob: "2005-07-22",
    class_name: "Class 12B",
    school_name: "Demo High School",
  },
  {
    user_id: "teacher1",
    username: "admin.teacher",
    full_name: "Dr. Sarah Admin",
    email: "admin@example.com",
    role: "admin",
    school_name: "Demo High School",
  },
];

// Mock Exams
export const mockExams: Exam[] = [
  {
    exam_id: "1",
    teacher_id: "teacher1",
    title: "Introduction to Computer Science",
    description: "Basic concepts of programming and algorithms",
    type: "standard",
    access_code: "CS101",
    duration_minutes: 60,
    start_at: "2025-11-15T09:00:00",
    end_at: "2025-11-15T18:00:00",
    created_at: "2025-11-01T10:00:00",
  },
  {
    exam_id: "2",
    teacher_id: "teacher1",
    title: "Python Programming Challenge",
    description: "Test your Python coding skills with real-world problems",
    type: "coding",
    access_code: "PY202",
    duration_minutes: 90,
    start_at: "2025-11-14T10:00:00",
    end_at: "2025-11-20T19:00:00",
    created_at: "2025-11-02T10:00:00",
  },
  {
    exam_id: "3",
    teacher_id: "teacher1",
    title: "Data Structures Fundamentals",
    description: "Arrays, Linked Lists, Stacks, Queues, Trees, and Graphs",
    type: "standard",
    access_code: "DS301",
    duration_minutes: 75,
    start_at: "2025-11-17T09:00:00",
    end_at: "2025-11-21T17:00:00",
    created_at: "2025-11-03T10:00:00",
  },
];

export const mockExam: Exam = {
  exam_id: "1",
  teacher_id: "teacher1",
  title: "Introduction to Computer Science",
  description: "Basic concepts of programming and algorithms",
  type: "standard",
  access_code: "CS101",
  duration_minutes: 60,
  start_at: "2025-11-15T09:00:00",
  end_at: "2025-11-15T18:00:00",
};

// Mock Questions for Exam 1
export const mockQuestionsExam1: Question[] = [
  {
    question_id: "q1",
    exam_id: "1",
    question_text:
      "What is the time complexity of binary search in a sorted array?",
    question_type: "single_choice",
    points: 2,
    choices: [
      {
        choice_id: "q1c1",
        question_id: "q1",
        choice_text: "O(n)",
        is_correct: false,
      },
      {
        choice_id: "q1c2",
        question_id: "q1",
        choice_text: "O(log n)",
        is_correct: true,
      },
      {
        choice_id: "q1c3",
        question_id: "q1",
        choice_text: "O(n²)",
        is_correct: false,
      },
      {
        choice_id: "q1c4",
        question_id: "q1",
        choice_text: "O(1)",
        is_correct: false,
      },
    ],
  },
  {
    question_id: "q2",
    exam_id: "1",
    question_text:
      "Which of the following are programming paradigms? (Select all that apply)",
    question_type: "multiple_choice",
    points: 3,
    choices: [
      {
        choice_id: "q2c1",
        question_id: "q2",
        choice_text: "Object-Oriented Programming",
        is_correct: true,
      },
      {
        choice_id: "q2c2",
        question_id: "q2",
        choice_text: "Functional Programming",
        is_correct: true,
      },
      {
        choice_id: "q2c3",
        question_id: "q2",
        choice_text: "Binary Programming",
        is_correct: false,
      },
      {
        choice_id: "q2c4",
        question_id: "q2",
        choice_text: "Procedural Programming",
        is_correct: true,
      },
    ],
  },
  {
    question_id: "q3",
    exam_id: "1",
    question_text: "What does CPU stand for?",
    question_type: "short_answer",
    points: 1,
    correct_answer: ["Central Processing Unit", "central processing unit"],
  },
  {
    question_id: "q4",
    exam_id: "1",
    question_text:
      "Explain the concept of recursion in programming and provide an example.",
    question_type: "essay",
    points: 5,
  },
  {
    question_id: "q5",
    exam_id: "1",
    question_text: "What is the primary purpose of a compiler?",
    question_type: "single_choice",
    points: 2,
    choices: [
      {
        choice_id: "q5c1",
        question_id: "q5",
        choice_text: "To execute code directly",
        is_correct: false,
      },
      {
        choice_id: "q5c2",
        question_id: "q5",
        choice_text: "To translate source code to machine code",
        is_correct: true,
      },
      {
        choice_id: "q5c3",
        question_id: "q5",
        choice_text: "To debug programs",
        is_correct: false,
      },
      {
        choice_id: "q5c4",
        question_id: "q5",
        choice_text: "To format code",
        is_correct: false,
      },
    ],
  },
  {
    question_id: "q6",
    exam_id: "1",
    question_text:
      "Which data structures use LIFO principle? (Select all that apply)",
    question_type: "multiple_choice",
    points: 2,
    choices: [
      {
        choice_id: "q6c1",
        question_id: "q6",
        choice_text: "Stack",
        is_correct: true,
      },
      {
        choice_id: "q6c2",
        question_id: "q6",
        choice_text: "Queue",
        is_correct: false,
      },
      {
        choice_id: "q6c3",
        question_id: "q6",
        choice_text: "Array",
        is_correct: false,
      },
      {
        choice_id: "q6c4",
        question_id: "q6",
        choice_text: "Call Stack",
        is_correct: true,
      },
    ],
  },
  {
    question_id: "q7",
    exam_id: "1",
    question_text: "What does HTTP stand for?",
    question_type: "short_answer",
    points: 1,
    correct_answer: [
      "HyperText Transfer Protocol",
      "hypertext transfer protocol",
    ],
  },
  {
    question_id: "q8",
    exam_id: "1",
    question_text:
      "Which of these are valid JavaScript data types? (Select all that apply)",
    question_type: "multiple_choice",
    points: 3,
    choices: [
      {
        choice_id: "q8c1",
        question_id: "q8",
        choice_text: "String",
        is_correct: true,
      },
      {
        choice_id: "q8c2",
        question_id: "q8",
        choice_text: "Boolean",
        is_correct: true,
      },
      {
        choice_id: "q8c3",
        question_id: "q8",
        choice_text: "Character",
        is_correct: false,
      },
      {
        choice_id: "q8c4",
        question_id: "q8",
        choice_text: "Symbol",
        is_correct: true,
      },
    ],
  },
  {
    question_id: "q9",
    exam_id: "1",
    question_text:
      "What is the difference between a variable declared with let and const in JavaScript?",
    question_type: "short_answer",
    points: 2,
    correct_answer: ["const cannot be reassigned", "const is immutable"],
  },
  {
    question_id: "q10",
    exam_id: "1",
    question_text:
      "Describe the differences between SQL and NoSQL databases. Include examples of when you would use each.",
    question_type: "essay",
    points: 5,
  },
  {
    question_id: "q11",
    exam_id: "1",
    question_text:
      "What is the main advantage of using version control systems like Git?",
    question_type: "single_choice",
    points: 2,
    choices: [
      {
        choice_id: "q11c1",
        question_id: "q11",
        choice_text: "Faster code execution",
        is_correct: false,
      },
      {
        choice_id: "q11c2",
        question_id: "q11",
        choice_text: "Track changes and collaborate",
        is_correct: true,
      },
      {
        choice_id: "q11c3",
        question_id: "q11",
        choice_text: "Automatic bug fixing",
        is_correct: false,
      },
      {
        choice_id: "q11c4",
        question_id: "q11",
        choice_text: "Code compilation",
        is_correct: false,
      },
    ],
  },
  {
    question_id: "q12",
    exam_id: "1",
    question_text:
      "Explain the concept of Big O notation and why it is important in algorithm analysis.",
    question_type: "essay",
    points: 5,
  },
];

// Mock Submissions
export const mockSubmissions: Submission[] = [
  {
    submission_id: "sub1",
    exam_id: "1",
    user_id: "student1",
    submitted_at: "2025-11-14T10:30:00",
    total_score: 8,
    cheated: false,
    status: "graded",
    user: {
      full_name: "Alice Johnson",
      username: "alice.johnson",
      email: "alice@example.com",
    },
  },
  {
    submission_id: "sub2",
    exam_id: "1",
    user_id: "student2",
    submitted_at: "2025-11-14T10:45:00",
    total_score: 10,
    cheated: false,
    status: "graded",
    user: {
      full_name: "Bob Smith",
      username: "bob.smith",
      email: "bob@example.com",
    },
  },
];

// Mock Leaderboard Data
export const mockLeaderboardData = [
  {
    rank: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    score: 11,
    submitted_at: "2025-11-14T09:45:00",
  },
  {
    rank: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    score: 10,
    submitted_at: "2025-11-14T10:12:00",
  },
  {
    rank: 3,
    name: "Carol White",
    email: "carol@example.com",
    score: 9,
    submitted_at: "2025-11-14T10:05:00",
  },
  {
    rank: 4,
    name: "David Brown",
    email: "david@example.com",
    score: 9,
    submitted_at: "2025-11-14T10:20:00",
  },
  {
    rank: 5,
    name: "Eve Davis",
    email: "eve@example.com",
    score: 8,
    submitted_at: "2025-11-14T10:30:00",
  },
];

export const mockResults = [
  {
    exam_id: "1",
    title: "Introduction to Computer Science",
    submitted_at: "2025-11-14T10:30:00",
    score: 8,
    maxScore: 11,
    status: "graded",
    passed: true,
  },
  {
    exam_id: "2",
    title: "Python Programming Challenge",
    submitted_at: "2025-11-10T14:20:00",
    score: 7,
    maxScore: 10,
    status: "graded",
    passed: true,
  },
  {
    exam_id: "3",
    title: "Data Structures Basics",
    submitted_at: "2025-11-05T09:15:00",
    score: 5,
    maxScore: 10,
    status: "graded",
    passed: false,
  },
];
