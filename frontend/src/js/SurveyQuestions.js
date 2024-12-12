import React from 'react';
import '../css/SurveyWindow.css';
import '../css/Dashboard.css';
import { Link } from 'react-router-dom';
import '../css/App.css';
import Singular from './Questions/Singular';
import Multiple from './Questions/Multiple';

function SurveyQuestions() {
  const handleLogout = () => {
    document.cookie = "user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.assign("/");
  }
  return (
    <div className="SurveyQuestions">
      <nav>
            <ul class='navbar'>
              <li onClick={handleLogout} style={{ cursor: "pointer" }}>sign out</li>
              <li><Link to="/about" class='link'>about</Link></li>
              <li><Link to="/user" class='link'>user</Link></li>
              <li><Link to="/dashboard" class='link'>dashboard</Link></li>
            </ul>
          </nav>
      
      <Singular/>

      <Multiple/>

      <div class='finish'>
        <Link to="/thankyou" class='link'><input type="submit" value="finish survey" /></Link>
      </div>
      <div class='next_question'>
        <input type="submit" value="next question" />
      </div>
    </div>
  );
}

export default SurveyQuestions;