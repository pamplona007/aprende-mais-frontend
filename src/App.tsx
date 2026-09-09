import { Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { TeacherDashboard } from './pages/TeacherDashboard'
import { StudentProfilePage } from './pages/StudentProfilePage'
import { InviteStudentPage } from './pages/InviteStudentPage'
import { StudentDashboard } from './pages/StudentDashboard'
import { ProtectedRoute } from './auth/ProtectedRoute'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Teacher area — gated to TEACHER role only. */}
        <Route
          path="teacher/:teacherId"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="teacher/:teacherId/students/:studentId"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <StudentProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="teacher/:teacherId/invite"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <InviteStudentPage />
            </ProtectedRoute>
          }
        />

        {/* Student area — gated to STUDENT role only. */}
        <Route
          path="student/:studentId"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}
