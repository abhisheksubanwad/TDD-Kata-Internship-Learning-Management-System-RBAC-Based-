import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Student from "./pages/Student";
import Mentor from "./pages/Mentor";
import Admin from "./pages/Admin";
import Unauthorized from "./pages/Unauthorized";
import MyCourses from "./pages/MyCourses";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import CourseDetails from "./pages/CourseDetails";
import CourseChapters from "./pages/CourseChapters";



function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Student />
            </ProtectedRoute>
          }
        />

        {/* Courses */}
        <Route
          path="/my-courses"
          element={
             <ProtectedRoute allowedRoles={["student"]}>
              <MyCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/:courseId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
            <CourseDetails />
           </ProtectedRoute>
          }
        />
       {/*Course Detail */}
        <Route
          path="/courses/:courseId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
            <CourseChapters />
            </ProtectedRoute>
          }
        />


        {/* Mentor */}
        <Route
          path="/mentor"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <Mentor />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
