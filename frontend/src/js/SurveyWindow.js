import React from 'react';
import { Link } from 'react-router-dom';
import '../css/SurveyWindow.css';
import arrowIcon from '../images/icons8-arrow-left-96.png';
import '../css/App.css';

function SurveyWindow() {
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
  return (
    <div className="SurveyWindow">
      <nav>
            <ul class='navbar'>
              <li onClick={logout} style={{ cursor: "pointer" }}>sign out</li>
              <li><Link to="/about" class='link'>about</Link></li>
              <li><Link to="/user" class='link'>user</Link></li>
              <li><Link to="/dashboard" class='link'>dashboard</Link></li>
            </ul>
          </nav>
      <div className="video_container">
      <iframe
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="working on rick roll"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </div>
    <div class="go_to_questions_container">
      <h3>go to the questions</h3>
      <Link to="/surveyquestions" class='link' id='go_to_questions'><img src={arrowIcon} alt='mail'></img></Link>
    </div>
    </div>
  );
}

export default SurveyWindow;