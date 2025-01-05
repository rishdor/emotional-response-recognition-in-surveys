import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../css/SurveyWindow.css';
import arrowIcon from '../images/icons8-arrow-left-96.png';
import '../css/App.css';
import logo from '../images/photos/logo_surveys3.png';

function SurveyWindow() {
  const location = useLocation();
  const navigate = useNavigate();
  const { survey, user } = location.state || {};

  const logout = async () => {
    try {
      await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.assign("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleStartClick = () => {
    console.log("Navigating to survey questions with survey:", survey);
    navigate('/surveyquestions', { state: { survey, user } });
  };

  console.log("Survey object in SurveyWindow:", survey);

  return (
    <div className="SurveyWindow">
      <nav>
        <ul class='navbar'>
          <div class='nav_side'>
            <li onClick={logout} style={{ cursor: "pointer" }}>Sign out</li> 
            <li><Link to="/about" class='link'>About</Link></li>
            <li><Link to="/contact" class='link'>Contact</Link></li>
          </div>
          <li><img src={logo} alt='logo'/></li>
          <div class='nav_side'>
            <li><Link to="/user" class='link'>User</Link></li>
            <li><Link to="/dashboard" class='link'>Dashboard</Link></li>
            <li><Link to="/surveys" class='link'>Surveys</Link></li>
          </div>
        </ul>
      </nav>
      <div class='fix_nav_position'/>
      <div className="video_container">
        <iframe
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="working on rick roll"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
      <div className="go_to_questions_container">
        <h3>go to the questions</h3>
        <button onClick={handleStartClick} className="link" id="go_to_questions">
          <img src={arrowIcon} alt="mail" />
        </button>
      </div>
    </div>
  );
}

export default SurveyWindow;