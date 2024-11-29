import '../css/App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Home from './Home';
import About from './About';
import User from './User';
import Dashboard from './Dashboard';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Surveys from './Surveys';
import SurveyWindow from './SurveyWindow';
import Feedback from './Feedback';

function App() {
  // to be fixed
  const isLogged = document.cookie.includes("user_session");

  const handleLogout = () => {
    document.cookie = "user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.assign("/");
  }
  return (
    <Router>
      <div className="App">
          <nav>
            <ul class='navbar'>
              {!isLogged && (
              <li><Link to="/signUp" class='link'>sign up</Link></li>
              )}
              {!isLogged && (
              <li><Link to="/signIn" class='link'>sign in</Link></li>
              )}
              {isLogged && (
              <li onClick={handleLogout} style={{ cursor: "pointer" }}>sign out</li> 
              )}                                   
              <li><Link to="/" class='link'>SmartSurveys</Link></li>
              <li><Link to="/about" class='link'>about</Link></li>
              <li><Link to="/user" class='link'>user</Link></li>
              <li><Link to="/dashboard" class='link'>dashboard</Link></li>
            </ul>
          </nav>

          <Routes>
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/user" element={<User />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/surveys" element={<Surveys />} />
            <Route path="/surveywindow" element={<SurveyWindow />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </div>
    </Router>
  );
}

export default App;