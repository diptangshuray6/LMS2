import { Route, Routes, useMatch } from "react-router";
import Home from "./pages/Student/Home";
import CoursesList from "./pages/Student/CoursesList";
import CourseDetails from "./pages/Student/CourseDetails";
import MyEnrollments from "./pages/Student/MyEnrollments";
import Player from "./pages/Student/Player";
import Loading from "./components/student/Loading";
import Educator from "./pages/educator/Educator";
import AddCourse from "./pages/educator/AddCourse";
import MyCourses from "./pages/educator/MyCourses";
import StudentsEnrolled from "./pages/educator/StudentsEnrolled";
import Dashboard from "./pages/educator/Dashboard";
import  Navbar  from "./components/student/Navbar";
import "quill/dist/quill.snow.css";
import { ToastContainer } from 'react-toastify';

function App() {
  

  const isEducatorRoute = useMatch('/educator/*');


  return (
    <div className="min-h-screen bg-white text-default">
    <ToastContainer />
    {!isEducatorRoute && <Navbar/>}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="/educator" element={<Educator />}>
          <Route path="/educator" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentsEnrolled />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
