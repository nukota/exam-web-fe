Task: Implement a web application for online exam management and taking. The system has two types of users: Admin and Student, and supports two types of exams: Standard Exam and Coding Exam.

User Roles and Permissions:

Student

Can view available exams.

Can take exams (standard and coding).

Can view exam results and leaderboard.

Can view all past exam results.

Can view and edit their personal profile.

Admin

Can view dashboard with stats.

Can create, edit, and manage exams.

Can grade essay questions.

Can view leaderboard for each exam.

Can view and edit their personal profile.

Exams:

Standard Exam:

Contains at least one question.

Question types:

essay → manually graded by admin.

single_choice → auto-graded.

multiple_choice → auto-graded.

short_answer → auto-graded.

Admin provides the correct answers when creating the exam.

Coding Exam:

Requires a code editor in the exam page.

No need to implement the actual code compiler now, just the UI with code input box.

Required Pages:

Common:

Sign In / Authentication Page

Student Pages:

Exam list page, including an input box for starting new exams.

Exam detail page.

Standard exam taking page.

Coding exam taking page (with code editor).

Exam result page with leaderboard.

All exam results page.

Personal profile page.

Admin Pages:

Dashboard.

All exams page.

Create exam page.

Edit exam page.

Personal profile page.

Grading page for essay questions.

Exam leaderboard page.

Technical Notes / Requirements:

Use React with TypeScript for the frontend, React Router for routing, and Material-UI for all UI components and styling.

Authentication will use Firebase Google OAuth.

Backend should manage users, exams, questions, answers, and grading.

Standard exam non-essay questions are auto-graded.

Essay questions are graded manually by admin.

Coding exams should have a code editor component, but no compiler implementation is needed for now.

All pages should be responsive.

Include basic navigation between pages according to user role.

Use appropriate UI components for different question types (radio buttons, checkboxes, text areas, etc.).

this is the database schema:

Table users {
  user_id uuid [primary key, default: `gen_random_uuid()`]
  username varchar [unique, not null]
  password varchar [not null]
  full_name varchar
  email varchar [unique]
  role varchar [not null, note: 'student, teacher, admin']
  dob date // student only
  class_name varchar // student only
  school_name varchar 
  created_at timestamp [default: `now()`]
}

Table exams {
  exam_id uuid [primary key, default: `gen_random_uuid()`]
  teacher_id uuid [not null]
  title varchar
  description text
  type varchar [not null, note: 'essay, multiple_choice, coding']
  access_code varchar [unique, not null]
  start_at timestamp
  end_at timestamp 
  created_at timestamp [default: `now()`]
  duration_minutes integer
}

Table questions {
  question_id uuid [primary key, default: `gen_random_uuid()`]
  exam_id uuid [not null]
  question_text text
  question_type varchar [not null, note: 'essay, single_choice, multiple_choice, short_answer, coding']
  points float [default: 1]
  correct_answer uuid[] [note: 'store UUIDs of correct choices or NULL for essay/coding']
  coding_template varchar
  image_url varchar
}

Table choices {
  choice_id uuid [primary key, default: `gen_random_uuid()`]
  question_id uuid [not null]
  choice_text varchar
  is_correct boolean [default: false]
}

Table coding_test_cases {
  test_case_id uuid [primary key, default: `gen_random_uuid()`]
  question_id uuid [not null]
  input_data text
  expected_output text
  is_hidden boolean [default: false, note: 'true = hidden test case']
}

Table submissions {
  submission_id uuid [primary key, default: `gen_random_uuid()`]
  exam_id uuid [not null]
  user_id uuid [not null]
  submitted_at timestamp [default: `now()`]
  total_score float [default: 0]
  cheated bool
  status varchar [default: 'submitted', note: 'submitted, graded']
}

Table answers {
  answer_id uuid [primary key, default: `gen_random_uuid()`]
  submission_id uuid [not null]
  question_id uuid [not null]
  answer_text text [note: 'or code for coding exams, essay, short_answer']
  selected_choices uuid[] [note: 'for single_choice or multiple_choice questions']
  score float [note: 'null until graded']
  graded_by uuid [note: 'teacher_id if essay or coding exam']
  graded_at timestamp
}

Table flags {
  user_id uuid [not null]
  question_id uuid [not null]
  submission_id uuid [not null]
  flagged_at timestamp [default: `now()`]
  note text [note: 'optional note the user can add when flagging a question']
}

// ==========================
// Relationships
// ==========================
Ref: questions.exam_id > exams.exam_id
Ref: choices.question_id > questions.question_id
Ref: coding_test_cases.question_id > questions.question_id
Ref: submissions.exam_id > exams.exam_id
Ref: submissions.user_id > users.user_id
Ref: answers.submission_id > submissions.submission_id
Ref: answers.question_id > questions.question_id
Ref: answers.graded_by > users.user_id
Ref: flags.user_id > users.user_id
Ref: flags.question_id > questions.question_id
Ref: flags.submission_id > submissions.submission_id
