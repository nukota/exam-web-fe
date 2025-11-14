# ExamWeb - Online Exam Management System

A comprehensive web application for online exam management and taking, built with React, TypeScript, Material-UI, and Firebase.

## Features

### User Roles

#### Student
- View available exams
- Take standard exams (multiple choice, essay, short answer)
- Take coding exams with integrated code editor
- View exam results with detailed breakdown
- View leaderboard rankings
- Track all past exam results
- Manage personal profile

#### Admin/Teacher
- Dashboard with statistics overview
- Create and manage exams
- Edit exam details
- Grade essay questions manually
- View exam leaderboards
- Manage personal profile

### Exam Types

1. **Standard Exam**
   - Single choice questions
   - Multiple choice questions
   - Short answer questions
   - Essay questions (manually graded)

2. **Coding Exam**
   - Integrated Monaco code editor
   - Support for multiple programming languages
   - Test cases display
   - Real-time code editing

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Routing**: React Router DOM
- **UI Library**: Material-UI (MUI) v7
- **Authentication**: Firebase Google OAuth
- **Code Editor**: Monaco Editor
- **Styling**: Tailwind CSS + Material-UI
- **Build Tool**: Vite

## Project Structure

```
exam-web-fe/
├── src/
│   ├── components/
│   │   ├── common/          # Shared components (Layout, ProtectedRoute, CodeEditor)
│   │   ├── admin/           # Admin-specific components
│   │   └── student/         # Student-specific components
│   ├── pages/
│   │   ├── admin/           # Admin pages (7 pages)
│   │   ├── student/         # Student pages (6 pages)
│   │   └── SignInPage.tsx   # Authentication page
│   ├── shared/
│   │   ├── dtos/            # TypeScript interfaces and types
│   │   ├── lib/             # Firebase configuration
│   │   ├── providers/       # React context providers
│   │   └── mockdata.ts      # Mock data for development
│   ├── App.tsx              # Main app with routing
│   └── main.tsx             # App entry point
├── public/                  # Static assets
└── package.json
```

## Pages Overview

### Authentication
- **Sign In Page** - Firebase Google OAuth authentication

### Student Pages (6 pages)
1. **Exam List Page** - View and join available exams
2. **Standard Exam Page** - Take standard exams with various question types
3. **Coding Exam Page** - Take coding exams with code editor
4. **Exam Result Page** - View detailed results with leaderboard
5. **All Results Page** - View all past exam results
6. **Profile Page** - Manage personal information

### Admin Pages (7 pages)
1. **Dashboard** - Overview with statistics
2. **All Exams Page** - Manage all exams
3. **Create Exam Page** - Create new exams with questions
4. **Edit Exam Page** - Edit existing exams
5. **Grading Page** - Grade essay questions
6. **Leaderboard Page** - View exam leaderboards
7. **Profile Page** - Manage personal information

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account (for authentication)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd exam-web-fe
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Google Authentication
   - Copy your Firebase configuration
   - Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
   - Fill in your Firebase configuration values in `.env`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Authentication Demo

For demonstration purposes, the app uses a simple role assignment:
- Emails containing "admin" will be assigned the **admin** role
- All other emails will be assigned the **student** role

Example:
- `admin@example.com` → Admin
- `student@example.com` → Student

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Features Implementation

### Authentication
- Firebase Google OAuth integration
- Protected routes based on user roles
- Automatic redirection based on role

### Exam Taking
- Timer countdown for exam duration
- Question flagging for review
- Progress tracking
- Submit confirmation dialog

### Code Editor
- Monaco Editor integration
- Syntax highlighting
- Multiple language support
- Code execution placeholder (for future implementation)

### Grading System
- Auto-grading for objective questions
- Manual grading interface for essay questions
- Score calculation and storage
- Leaderboard generation

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts
- Touch-friendly controls

## Future Enhancements

1. **Backend Integration**
   - Connect to actual backend API
   - Real-time data synchronization
   - Database integration

2. **Code Execution**
   - Implement code compiler/runner
   - Test case validation
   - Performance metrics

3. **Advanced Features**
   - Question bank management
   - Exam analytics and reports
   - Plagiarism detection
   - Real-time proctoring
   - Export results to PDF/Excel
   - Bulk exam operations

4. **Collaboration**
   - Group exams
   - Peer review system
   - Discussion forums

## Database Schema

The application is designed to work with the following database schema (PostgreSQL):

- **users** - User information and roles
- **exams** - Exam details and configuration
- **questions** - Exam questions with various types
- **choices** - Multiple choice options
- **coding_test_cases** - Test cases for coding questions
- **submissions** - Student exam submissions
- **answers** - Individual question answers
- **flags** - Flagged questions for review

See `instruction.md` for detailed schema information.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue in the GitHub repository.
