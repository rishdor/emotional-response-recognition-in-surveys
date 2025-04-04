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
import SurveyInfo from './SurveyInfo';
import Contact from './Contact'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canExpire, setCanExpire] = useState(false);

  const handleLoginSuccess = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/verify', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUserId(data.user_id);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      setIsAuthenticated(false);
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:8000/verify", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUserId(data.user_id);
          setCanExpire(true);
        } else {
          throw new Error("Unauthorized");
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUserId(null);
        if (canExpire) {
          alert("Your session has expired. Please log in again");
          setCanExpire(false);
        }
      } finally {
        setIsLoading(false)
      }
    };

    checkAuthStatus();

    const intervalId = setInterval(() => {
      checkAuthStatus();
    },  5 * 60 * 1000);

    return () => clearInterval(intervalId);
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

  if (isLoading) {
    return <div class="loading"><h1>Loading, please wait...</h1></div>;
  }

  return (
    <Router>
      <div className="App">
          <Routes>
            <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/signUp" element={<SignUp onAuthenticationSuccess={handleLoginSuccess} />} />
              <Route path="/signin"element={<SignIn onAuthenticationSuccess={handleLoginSuccess} />}/>
              <Route path="/" element={<Home />} />
            </Route>
            <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/user" element={<User userId={userId}/>} />
              <Route path="/dashboard" element={<Dashboard userId={userId}/>} />
              <Route path="/surveys" element={<Surveys />} />
              <Route path="/surveywindow" element={<SurveyWindow />} />
              <Route path="/thankyou" element={<ThankYou />} />
              <Route path='/surveyquestions' element={<SurveyQuestions />} />
              <Route path='/surveyinfo' element={<SurveyInfo />} />
            </Route>
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>

          <footer>
            <p>Ⓒ SmartSurveys</p>
            <p>Since 2025</p>
          </footer>
        </div>
    </Router>
  );
}

export default App;