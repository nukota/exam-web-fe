import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./shared/providers/AuthProvider";
import { FeedbackProvider } from "./shared/providers/FeedbackProvider";
import { ExamTimerProvider } from "./shared/providers/ExamTimerProvider";
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
  AdminEditStandardExamPage,
  AdminEditCodingExamPage,
  AdminGradingPage,
  AdminLeaderboardPage,
  AdminStudentsPage,
  AdminProfilePage,
  AdminSubmissionDetailPage,
  AdminExamSubmissionsPage,
} from "./pages";
import "./App.css";
import { StudentCodeCompilerPage } from "./pages/student/CodeCompilerPage";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FeedbackProvider>
          <ExamTimerProvider>
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
                path="/student/exam/coding/:examId/compiler/:questionId"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentCodeCompilerPage />
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
                path="/student/submissions/:submissionId"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <AdminSubmissionDetailPage />
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
                path="/admin/exams/:examId/edit-standard"
                element={
                  <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                    <AdminEditStandardExamPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/exams/:examId/edit-coding"
                element={
                  <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                    <AdminEditCodingExamPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/exams/:examId/edit-coding"
                element={
                  <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                    <AdminEditCodingExamPage />
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
              <Route
                path="/admin/submissions/:submissionId/grade"
                element={
                  <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                    <AdminSubmissionDetailPage grading={true} />
                  </ProtectedRoute>
                }
              />

              {/* Default Route */}
              <Route path="/" element={<Navigate to="/signin" replace />} />
              <Route path="*" element={<Navigate to="/signin" replace />} />
            </Routes>
          </ExamTimerProvider>
        </FeedbackProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
