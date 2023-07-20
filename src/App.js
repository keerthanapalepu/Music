import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/privateRoute";
import { AuthProvider } from "./context/authContext";
import {UserSongsProvider} from "./context/songsContext";
import HomePage from "./components/home.js";
import Login from "./components/login.js";
import Test from "./components/test.js";

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
              <Route
                path="/test"
                element={<PrivateRoute component=<Test /> />}
              />
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
