import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./auth/Login";
import Register from "./auth/Register";

import Student from "./pages/Student";
import Admin from "./pages/Admin";
import Unauthorized from "./pages/Unauthorized";
import MyCourses from "./pages/MyCourses";
import CourseDetails from "./pages/CourseDetails";

import MentorAnalytics from "./mentor/MentorAnalytics";
import Mentor from "./pages/Mentor";
import MentorCourses from "./mentor/MentorCourses";
import CreateCourse from "./mentor/CreateCourse";
import CourseChapters from "./mentor/CreateChapters"; 

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* STUDENT */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Student />
            </ProtectedRoute>
          }
        />

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
{/* Mentor */}
<Route
  path="/mentor"
  element={
    <ProtectedRoute allowedRoles={["mentor"]}>
      <Mentor />
    </ProtectedRoute>
  }
/>

<Route
  path="/mentor/courses"
  element={
    <ProtectedRoute allowedRoles={["mentor"]}>
      <MentorCourses />
    </ProtectedRoute>
  }
/>

<Route
  path="/mentor/create-course"
  element={
    <ProtectedRoute allowedRoles={["mentor"]}>
      <CreateCourse />
    </ProtectedRoute>
  }
/>

<Route
  path="/mentor/courses/:courseId"
  element={
    <ProtectedRoute allowedRoles={["mentor"]}>
      <CourseChapters />
    </ProtectedRoute>
  }
/>

<Route
  path="/mentor/analytics"
  element={
    <ProtectedRoute allowedRoles={["mentor"]}>
      <MentorAnalytics />
    </ProtectedRoute>
  }
/>


        {/* MENTOR
        <Route
          path="/mentor"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <MentorDashboard />
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/mentor/courses"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <MentorCourses />
            </ProtectedRoute>
          }
        /> */}
{/* 
        <Route
          path="/mentor/courses/:courseId"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <MentorCourseChapters />
            </ProtectedRoute>
          }
        /> */}

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
