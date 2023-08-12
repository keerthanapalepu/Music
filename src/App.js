import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/Login/privateRoute";
import { AuthProvider } from "./context/authContext";
import {UserSongsProvider} from "./context/songsContext";
import HomePage from "./components/Home/home.js";
import Login from "./components/Login/login.js";
import AboutPage from "./components/CompanyInfo/aboutus";
import PrivacyPolicyPage from "./components/CompanyInfo/privacyPolicy";
import RefundandReturn from "./components/CompanyInfo/refund";
import Terms from "./components/CompanyInfo/termsandcondition";
function App() {
  return (<>
    <Router >
      <AuthProvider>
        <UserSongsProvider>
          <Routes>
            <Route
                path="/"
                element={<PrivateRoute component=<HomePage /> />}
              />
              {/* <Route
                path="/test"
                element={<PrivateRoute component=<Test /> />}
              /> */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/refund" element={<RefundandReturn />} />
              <Route path="/privacy_policy" element={<PrivacyPolicyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<Login />} />
            </Routes>
        </UserSongsProvider>
      </AuthProvider>
    </Router>
    <ToastContainer />
    </>
  );
}

export default App;
