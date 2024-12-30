import React from 'react';
import { Link } from 'react-router-dom';
import '../css/App.css';
import '../css/SurveyInfo.css';
//import '../css/SurveyQuestions.css';

function SurveyInfo() {
  const isLogged = document.cookie.includes("user_session");
  const handleLogout = () => {
    document.cookie = "user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.assign("/");
  }
  return (
    <div className="SurveyInfo">
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
              {!isLogged &&(
              <li><Link to="/" class='link'>SmartSurveys</Link></li>
              )}    
              <li><Link to="/about" class='link'>about</Link></li>                            
              {isLogged &&(
                <li><Link to="/user" class='link'>user</Link></li>
              )}
              {isLogged &&(
                <li><Link to="/dashboard" class='link'>dashboard</Link></li>
              )}
            </ul>
          </nav>
          <div  class='survey_info_main_cointainer'>
              <h2>survey name</h2> {/* Replace survey name with the name of the survey */}
              <hr class='question_underline'></hr>

          </div>
    </div>
  );
}

export default SurveyInfo;