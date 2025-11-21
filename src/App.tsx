import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./shared/providers/AuthProvider";
import { FeedbackProvider } from "./shared/providers/FeedbackProvider";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import {
  SignInPage,
  // Student Pages
  StudentExamListPage,
  StudentStandardExamPage,
  StudentCodingExamPage,
  StudentExamResultPage,
  StudentAllResultsPage,
  StudentProfilePage,
  // Admin Pages
  AdminDashboardPage,
  AdminExamsPage,
  AdminEditExamPage,
  AdminGradingPage,
  AdminLeaderboardPage,
  AdminStudentsPage,
  AdminProfilePage,
  AdminSubmissionDetailPage,
  AdminExamSubmissionsPage,
} from "./pages";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FeedbackProvider>
          <Routes>
            {/* Auth Route */}
            <Route path="/signin" element={<SignInPage />} />

            {/* Student Routes */}
            <Route
              path="/student/exams"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentExamListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/exam/:examId"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentStandardExamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/exam/coding/:examId"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentCodingExamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/exam/:examId/result"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentExamResultPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/results"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentAllResultsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/exams"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                  <AdminExamsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/exams/:examId/edit"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                  <AdminEditExamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/grading"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                  <AdminGradingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                  <AdminStudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/exams/:examId/leaderboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                  <AdminLeaderboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                  <AdminProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/grading/:examId"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                  <AdminExamSubmissionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/submissions/:submissionId"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                  <AdminSubmissionDetailPage />
                </ProtectedRoute>
              }
            />
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </FeedbackProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
