import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/SurveyWindow.css';
import arrowIcon from '../images/icons8-arrow-left-96.png';
import '../css/App.css';

function SurveyWindow() {
  const location = useLocation();
  const { survey } = location.state || {};

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

  const formatDateWithRemainingDays = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const timeDiff = deadlineDate - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = deadlineDate.toLocaleDateString('en-US', options);

    return `${formattedDate} (${daysLeft} days left)`;
  };

  return (
    <div className="SurveyWindow">
      <nav>
        <ul className="navbar">
          <li onClick={logout} style={{ cursor: "pointer" }}>sign out</li>
          <li><Link to="/about" className="link">about</Link></li>
          <li><Link to="/user" className="link">user</Link></li>
          <li><Link to="/dashboard" className="link">dashboard</Link></li>
        </ul>
      </nav>
      {survey ? (
        <div className="survey_details">
          <h2>{survey.title}</h2>
          <p><strong>Description:</strong> {survey.description}</p>
          <p><strong>Deadline:</strong> {formatDateWithRemainingDays(survey.deadline)}</p>
          <p><strong>Issuer:</strong> {survey.issuer}</p>
          <p><strong>Points:</strong> {survey.points_awarded}</p>
        </div>
      ) : (
        <p>No survey details available.</p>
      )}
      <div className="video_container">
        <iframe
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="working on rick roll"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
      <div className="go_to_questions_container">
        <h3>go to the questions</h3>
        <Link to="/surveyquestions" className="link" id="go_to_questions">
          <img src={arrowIcon} alt="mail" />
        </Link>
      </div>
    </div>
  );
}

export default SurveyWindow;