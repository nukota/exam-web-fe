import type {
  User,
  Question,
  Submission,
  AllExamsPageDTO,
  GradingPageDTO,
  ExamAttemptsPageDTO,
} from "./dtos";

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
export const mockExams: AllExamsPageDTO = [
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
    question_amount: 12,
    status: "ended",
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
    end_at: "2025-11-24T19:00:00",
    created_at: "2025-11-02T10:00:00",
    question_amount: 0,
    status: "started",
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
    question_amount: 0,
    status: "started",
  },
];

// Mock Questions for Exam 1
export const mockQuestionsExam1: Question[] = [
  {
    question_id: "q1",
    exam_id: "1",
    question_text:
      "What is the time complexity of binary search in a sorted array?",
    order: 1,
    question_type: "single_choice",
    points: 2,
    correct_answer: ["q1c2"], // UUID of correct choice
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
    order: 2,
    question_type: "multiple_choice",
    points: 3,
    correct_answer: ["q2c1", "q2c2", "q2c4"], // UUIDs of correct choices
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
    order: 3,
    question_type: "short_answer",
    points: 1,
    correct_answer_text: ["Central Processing Unit", "central processing unit"],
  },
  {
    question_id: "q4",
    exam_id: "1",
    question_text:
      "Explain the concept of recursion in programming and provide an example.",
    order: 4,
    question_type: "essay",
    points: 5,
  },
  {
    question_id: "q5",
    exam_id: "1",
    question_text: "What is the primary purpose of a compiler?",
    order: 5,
    question_type: "single_choice",
    points: 2,
    correct_answer: ["q5c2"],
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
    order: 6,
    question_type: "multiple_choice",
    points: 2,
    correct_answer: ["q6c1", "q6c4"],
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
    order: 7,
    question_type: "short_answer",
    points: 1,
    correct_answer_text: [
      "HyperText Transfer Protocol",
      "hypertext transfer protocol",
    ],
  },
  {
    question_id: "q8",
    exam_id: "1",
    question_text:
      "Which of these are valid JavaScript data types? (Select all that apply)",
    order: 8,
    question_type: "multiple_choice",
    points: 3,
    correct_answer: ["q8c1", "q8c2", "q8c4"],
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
    order: 9,
    question_type: "short_answer",
    points: 2,
    correct_answer_text: ["const cannot be reassigned", "const is immutable"],
  },
  {
    question_id: "q10",
    exam_id: "1",
    question_text:
      "Describe the differences between SQL and NoSQL databases. Include examples of when you would use each.",
    order: 10,
    question_type: "essay",
    points: 5,
  },
  {
    question_id: "q11",
    exam_id: "1",
    question_text:
      "What is the main advantage of using version control systems like Git?",
    order: 11,
    question_type: "single_choice",
    points: 2,
    correct_answer: ["q11c2"],
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
    order: 12,
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
    description: "Basic concepts of programming and algorithms",
    submitted_at: "2025-11-14T10:30:00",
    score: 8,
    maxScore: 11,
    status: "graded",
    passed: true,
  },
  {
    exam_id: "2",
    title: "Python Programming Challenge",
    description: "Hands-on coding problems in Python",
    submitted_at: "2025-11-10T14:20:00",
    score: 7,
    maxScore: 10,
    status: "graded",
    passed: true,
  },
  {
    exam_id: "3",
    title: "Data Structures Basics",
    description: "Fundamental data structures and their operations",
    submitted_at: "2025-11-05T09:15:00",
    score: 5,
    maxScore: 10,
    status: "submitted",
    passed: false,
  },
];

// Mock Submission Detail with Answers
export const mockSubmissionDetail = {
  submission_id: "sub1",
  exam_id: "1",
  exam_title: "Introduction to Computer Science",
  student_name: "Alice Johnson",
  student_email: "alice@example.com",
  submitted_at: "2025-11-14T10:30:00",
  cheated: true,
  flagged_questions: ["q4", "q5", "q10"],
  answers: [
    {
      answer_id: "a1",
      attempt_id: "sub1",
      question_id: "q1",
      selected_choices: ["q1c2"],
      score: 2,
    },
    {
      answer_id: "a2",
      attempt_id: "sub1",
      question_id: "q2",
      selected_choices: ["q2c1", "q2c2", "q2c4"],
      score: 3,
    },
    {
      answer_id: "a3",
      attempt_id: "sub1",
      question_id: "q3",
      answer_text: "Central Processing Unit",
      score: 1,
    },
    {
      answer_id: "a4",
      attempt_id: "sub1",
      question_id: "q4",
      answer_text:
        "Recursion is a programming technique where a function calls itself to solve a problem by breaking it down into smaller, similar subproblems. A recursive function typically has two parts: a base case that stops the recursion, and a recursive case that calls the function itself with modified parameters.\n\nExample:\nfunction factorial(n) {\n  if (n === 0 || n === 1) return 1; // base case\n  return n * factorial(n - 1); // recursive case\n}\n\nThis function calculates the factorial of a number by recursively multiplying n by the factorial of (n-1) until it reaches the base case.",
      score: 4.5,
    },
    {
      answer_id: "a5",
      attempt_id: "sub1",
      question_id: "q5",
      selected_choices: ["q5c2"],
      score: 2,
    },
    {
      answer_id: "a6",
      attempt_id: "sub1",
      question_id: "q6",
      selected_choices: ["q6c1", "q6c4"],
      score: 2,
    },
    {
      answer_id: "a7",
      attempt_id: "sub1",
      question_id: "q7",
      answer_text: "HyperText Transfer Protocol",
      score: 1,
    },
    {
      answer_id: "a8",
      attempt_id: "sub1",
      question_id: "q8",
      selected_choices: ["q8c1", "q8c2", "q8c4"],
      score: 3,
    },
    {
      answer_id: "a9",
      attempt_id: "sub1",
      question_id: "q9",
      answer_text: "const cannot be reassigned after initialization",
      score: 2,
    },
    {
      answer_id: "a10",
      attempt_id: "sub1",
      question_id: "q10",
      answer_text:
        "SQL databases are relational databases that use structured schemas with tables and predefined relationships. They are ideal for applications that require ACID compliance and complex queries. Examples include MySQL and PostgreSQL. Use SQL when data is highly structured and relationships are important.\n\nNoSQL databases are non-relational and can handle unstructured or semi-structured data. They offer flexibility in schema design and horizontal scalability. Examples include MongoDB and Cassandra. Use NoSQL for large-scale applications with rapidly changing data structures or when you need high performance for simple queries.",
      score: 4,
    },
    {
      answer_id: "a11",
      attempt_id: "sub1",
      question_id: "q11",
      selected_choices: ["q11c2"],
      score: 2,
    },
    {
      answer_id: "a12",
      attempt_id: "sub1",
      question_id: "q12",
      answer_text:
        "Big O notation describes the upper bound of an algorithm's time or space complexity in terms of input size. It helps us understand how an algorithm scales and compare different approaches. For example, O(n) means linear time, O(n²) means quadratic time, and O(log n) means logarithmic time. It's important because it allows developers to predict performance and choose the most efficient algorithm for their specific use case.",
      score: 4,
    },
  ],
};

// Mock Coding Questions for Exam 2
export const mockCodingQuestions: Question[] = [
  {
    question_id: "cq1",
    exam_id: "2",
    title: "Find the longest palindromic substring",
    question_text: `Given a string s, return the longest palindromic substring in s.

A string is called a palindrome string if the reverse of the string is the same as the original string.

Example 1:
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.

Example 2:
Input: s = "cbbd"
Output: "bb"

Constraints:
- 1 <= s.length <= 1000
- s consist of only digits and English letters.`,
    order: 1,
    question_type: "coding",
    points: 10,
    coding_template: {
      python:
        "def longest_palindrome(s: str) -> str:\n    # Your code here\n    pass",
      javascript: "function longestPalindrome(s) {\n    // Your code here\n}",
      java: 'public String longestPalindrome(String s) {\n    // Your code here\n    return "";\n}',
      "c++":
        'string longestPalindrome(string s) {\n    // Your code here\n    return "";\n}',
    },
    programming_languages: ["python", "javascript", "java", "c++"],
    codingTestCases: [
      {
        test_case_id: "tc1",
        question_id: "cq1",
        input_data: "babad",
        expected_output: "bab",
        is_hidden: false,
      },
      {
        test_case_id: "tc2",
        question_id: "cq1",
        input_data: "cbbd",
        expected_output: "bb",
        is_hidden: false,
      },
    ],
  },
  {
    question_id: "cq2",
    exam_id: "2",
    title: "Two Sum Problem",
    question_text: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
    order: 2,
    question_type: "coding",
    points: 8,
    coding_template: {
      python:
        "def two_sum(nums: List[int], target: int) -> List[int]:\n    # Your code here\n    pass",
      javascript: "function twoSum(nums, target) {\n    // Your code here\n}",
      java: "public int[] twoSum(int[] nums, int target) {\n    // Your code here\n    return new int[]{};\n}",
      "c++":
        "vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {};\n}",
    },
    programming_languages: ["python", "javascript", "java", "c++"],
    codingTestCases: [
      {
        test_case_id: "tc3",
        question_id: "cq2",
        input_data: "[2,7,11,15]\n9",
        expected_output: "[0,1]",
        is_hidden: false,
      },
      {
        test_case_id: "tc4",
        question_id: "cq2",
        input_data: "[3,2,4]\n6",
        expected_output: "[1,2]",
        is_hidden: false,
      },
    ],
  },
  {
    question_id: "cq3",
    exam_id: "2",
    title: "Reverse Linked List",
    question_text: `Given the head of a singly linked list, reverse the list, and return the reversed list.

Example 1:
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]

Example 2:
Input: head = [1,2]
Output: [2,1]

Example 3:
Input: head = []
Output: []

Constraints:
- The number of nodes in the list is the range [0, 5000].
- -5000 <= Node.val <= 5000

Follow up: A linked list can be reversed either iteratively or recursively. Could you implement both?`,
    order: 3,
    question_type: "coding",
    points: 12,
    coding_template: {
      python:
        "def reverse_list(head: ListNode) -> ListNode:\n    # Your code here\n    pass",
      javascript: "function reverseList(head) {\n    // Your code here\n}",
      java: "public ListNode reverseList(ListNode head) {\n    // Your code here\n    return null;\n}",
      "c++":
        "ListNode* reverseList(ListNode* head) {\n    // Your code here\n    return nullptr;\n}",
    },
    programming_languages: ["python", "javascript", "java", "c++"],
    codingTestCases: [
      {
        test_case_id: "tc5",
        question_id: "cq3",
        input_data: "1->2->3->4->5",
        expected_output: "5->4->3->2->1",
        is_hidden: false,
      },
      {
        test_case_id: "tc6",
        question_id: "cq3",
        input_data: "1->2",
        expected_output: "2->1",
        is_hidden: false,
      },
    ],
  },
  {
    question_id: "cq4",
    exam_id: "2",
    title: "Valid Parentheses",
    question_text: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "()[]{}"
Output: true

Example 3:
Input: s = "(]"
Output: false

Constraints:
- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}'.`,
    order: 4,
    question_type: "coding",
    points: 8,
    coding_template: {
      python: "def is_valid(s: str) -> bool:\n    # Your code here\n    pass",
      javascript: "function isValid(s) {\n    // Your code here\n}",
      java: "public boolean isValid(String s) {\n    // Your code here\n    return false;\n}",
      "c++":
        "bool isValid(string s) {\n    // Your code here\n    return false;\n}",
    },
    programming_languages: ["python", "javascript", "java", "c++"],
    codingTestCases: [
      {
        test_case_id: "tc7",
        question_id: "cq4",
        input_data: "()[]{}",
        expected_output: "true",
        is_hidden: false,
      },
      {
        test_case_id: "tc8",
        question_id: "cq4",
        input_data: "(]",
        expected_output: "false",
        is_hidden: false,
      },
    ],
  },
  {
    question_id: "cq5",
    exam_id: "2",
    title: "Binary Tree Maximum Path Sum",
    question_text: `A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. The path sum of a path is the sum of the node's values in the path.

Given the root of a binary tree, return the maximum path sum of any non-empty path.

Example 1:
Input: root = [1,2,3]
Output: 6
Explanation: The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.

Example 2:
Input: root = [-10,9,20,null,null,15,7]
Output: 42
Explanation: The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.

Constraints:
- The number of nodes in the tree is in the range [1, 3 * 10^4].
- -1000 <= Node.val <= 1000`,
    order: 5,
    question_type: "coding",
    points: 15,
    coding_template: {
      python:
        "def max_path_sum(root: TreeNode) -> int:\n    # Your code here\n    pass",
      javascript: "function maxPathSum(root) {\n    // Your code here\n}",
      java: "public int maxPathSum(TreeNode root) {\n    // Your code here\n    return 0;\n}",
      "c++":
        "int maxPathSum(TreeNode* root) {\n    // Your code here\n    return 0;\n}",
    },
    programming_languages: ["python", "javascript", "java", "c++"],
    codingTestCases: [
      {
        test_case_id: "tc9",
        question_id: "cq5",
        input_data: "[-10,9,20,null,null,15,7]",
        expected_output: "42",
        is_hidden: false,
      },
      {
        test_case_id: "tc10",
        question_id: "cq5",
        input_data: "[1,2,3]",
        expected_output: "6",
        is_hidden: false,
      },
    ],
  },
];

export const testCases = [
  {
    input: `121
232
343`,
    expectedOutput: `121
232
343`,
  },
  {
    input: `11
99
12321`,
    expectedOutput: `11
99
12321`,
  },
  {
    input: `ab121ba
cd232dc`,
    expectedOutput: `121
232`,
  },
  {
    input: `ab121ba
cd232dc`,
    expectedOutput: `121
232`,
  },
];

// Mock Exams for Grading Page
export const mockExamsForGrading: GradingPageDTO = [
  {
    exam_id: "1",
    title: "Introduction to Computer Science",
    description: "Basic concepts of programming and algorithms",
    end_at: "2025-11-15T18:00:00",
    total_submissions: 25,
    pending_submissions: 5,
    teacher_name: "Dr. Sarah Admin",
    teacher_email: "admin@example.com",
  },
  {
    exam_id: "2",
    title: "Advanced Data Structures",
    description: "Arrays, Linked Lists, Stacks, Queues, Trees, and Graphs",
    end_at: "2025-11-16T20:00:00",
    total_submissions: 18,
    pending_submissions: 0,
    teacher_name: "Dr. Sarah Admin",
    teacher_email: "admin@example.com",
  },
  {
    exam_id: "3",
    title: "Web Development Final",
    description: "HTML, CSS, JavaScript, and Modern Frameworks",
    end_at: "2025-11-20T22:00:00",
    total_submissions: 10,
    pending_submissions: 10,
    teacher_name: "Dr. Sarah Admin",
    teacher_email: "admin@example.com",
  },
];

// Mock Exam Attempts Page
export const mockExamAttemptsPage: ExamAttemptsPageDTO = {
  exam_id: "1",
  exam_title: "Introduction to Computer Science",
  max_score: 33,
  attempts: [
    {
      attempt_id: "sub1",
      student_name: "Alice Johnson",
      student_email: "alice@example.com",
      submitted_at: "2025-11-14T10:30:00",
      score: 30.5,
      status: "graded",
      cheated: false,
    },
    {
      attempt_id: "sub2",
      student_name: "Bob Smith",
      student_email: "bob@example.com",
      submitted_at: "2025-11-14T10:45:00",
      score: 28,
      status: "graded",
      cheated: false,
    },
    {
      attempt_id: "sub3",
      student_name: "Carol White",
      student_email: "carol@example.com",
      submitted_at: "2025-11-14T11:00:00",
      score: 25,
      status: "graded",
      cheated: true,
    },
    {
      attempt_id: "sub4",
      student_name: "David Brown",
      student_email: "david@example.com",
      submitted_at: "2025-11-14T11:15:00",
      score: 0,
      status: "overdue",
      cheated: false,
    },
    {
      attempt_id: "sub5",
      student_name: "Eve Davis",
      student_email: "eve@example.com",
      submitted_at: "2025-11-14T11:30:00",
      score: 0,
      status: "submitted",
      cheated: false,
    },
    {
      attempt_id: "sub6",
      student_name: "Frank Miller",
      student_email: "frank@example.com",
      submitted_at: "2025-11-14T11:45:00",
      score: 0,
      status: "cancelled",
      cheated: false,
    },
  ],
};
