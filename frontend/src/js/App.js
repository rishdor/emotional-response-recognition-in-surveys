import '../css/App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Home from './Home';
import About from './About';
import User from './User';
import Dashboard from './Dashboard';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Surveys from './Surveys';
import SurveyWindow from './SurveyWindow';
import ThankYou from './ThankYou';
import SurveyQuestions from './SurveyQuestions';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const cookieExists = document.cookie.includes("user_session");
    setIsAuthenticated(cookieExists);
  }, []);

  const PublicRoute = ({isAuthenticated}) => {
    if (isAuthenticated) {
      return <Navigate to="/dashboard" />;
    }
    return <Outlet />;
  }
  const PrivateRoute = ({isAuthenticated }) => {
    if (!isAuthenticated) {
      return <Navigate to="/signin" />;
    }
    return <Outlet />;
  };

  return (
    <Router>
      <div className="App">
          <Routes>
            <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/signUp" element={<SignUp setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/signIn" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/" element={<Home />} />
            </Route>
            <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/user" element={<User />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/surveys" element={<Surveys />} />
              <Route path="/surveywindow" element={<SurveyWindow />} />
              <Route path="/thankyou" element={<ThankYou />} />
              <Route path='/surveyquestions' element={<SurveyQuestions />} />
            </Route>
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
    </Router>
  );
}

export default App;