import React from 'react';
import { Link } from 'react-router-dom';
import '../css/App.css';
import '../css/SurveyInfo.css';
import '../css/SurveyWindow.css';
import '../css/Dashboard.css';

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
              <h2>survey title</h2> {/* from db*/}
              <hr class='question_underline'></hr>
              <p class='surv_deadline'>deadline</p> {/* from db*/}
              <p>issuer</p> {/* from db*/}
              <p>survey description</p> {/* from db*/}
              <div class='finish survey_info_button'>
                  <Link to="/surveywindow" class='link'><input type="submit" value="start survey" /></Link>
              </div>
          </div>
    </div>
  );
}

export default SurveyInfo;