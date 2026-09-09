import { Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { TeacherDashboard } from './pages/TeacherDashboard'
import { StudentProfilePage } from './pages/StudentProfilePage'
import { InviteStudentPage } from './pages/InviteStudentPage'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="teacher/:teacherId" element={<TeacherDashboard />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="students/:studentId" element={<StudentProfilePage />} />
          <Route path="invite" element={<InviteStudentPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
