import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./user/Login";
import ResetEmailLink from "./user/ResetEmailLink";
import ResetPassword from "./user/ResetPassword";
import Signup from "./user/Signup";
import VerifyEmail from "./user/VerifyEmail";
import Home from "./weather/Home";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route exact path="/login" element={<Login />} />
      <Route exact path="/signup" element={<Signup />} />

      <Route
        exact
        path="/reset/:verificationToken"
        element={<ResetPassword />}
      />

      <Route exact path="/resetEmailLink" element={<ResetEmailLink />} />

      <Route exact path="/verify/:verificationCode" element={<VerifyEmail />} />

      {/* Unknown URLs go home; ProtectedRoute bounces logged-out users to /login */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default App;
