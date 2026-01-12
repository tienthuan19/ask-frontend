import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Component imports
import Homepage from "./components/pages/Homepage.js";
import About from "./components/pages/About.js";
import Contact from "./components/pages/Contact.js";
import Support from "./components/pages/Support.js";
import Terms from "./components/pages/Terms.js";
import GradingPage from "./components/teacher/GradingPage.js";
import Login from "./components/auth/Login.js";
import Student from "./components/student/Student.js";
import Teacher from "./components/teacher/Teacher.js";
import RoleSelector from "./components/auth/RoleSelector.js";
import AssignmentPage from "./components/student/AssignmentPage.js";
import ProtectedRoute from "./components/auth/ProtectedRoute.js";
import MultiAccountingDashboard from "./components/admin/MultiAccountingDashboard.js";
import OAuth2RedirectHandler from "./components/auth/OAuth2RedirectHandler.js";

/**
 * Main App Component
 * Handles routing for the educational platform with Fingerprint (Free version)
 */
function App() {
  return (
    <Router>
      <Routes>
          {/* Public routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/grading" element={<GradingPage />} />
          <Route path="/login" element={<Login />} />

          <Route path="/register-role" element={<RoleSelector />} />

          <Route path="/role-selector" element={<RoleSelector />} />

          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          
          <Route path="/student-dashboard" element={
            <ProtectedRoute requiredRole="student">
              <Student />
            </ProtectedRoute>
          } />
          <Route path="/assignment/:assignmentId" element={
            <ProtectedRoute requiredRole="student">
              <AssignmentPage />
            </ProtectedRoute>
          } />
          
          <Route path="/teacher-dashboard" element={
            <ProtectedRoute requiredRole="teacher">
              <Teacher />
            </ProtectedRoute>
          } />
          
          <Route path="/multi-accounting-dashboard" element={
            <MultiAccountingDashboard />
          } />
        </Routes>
      </Router>
  );
}

export default App;