import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/App.css';
import '../css/SurveyInfo.css';
import '../css/SurveyWindow.css';
import '../css/Dashboard.css';
import logo from '../images/photos/logo_surveys3.png';
import bottomImage from '../images/photos/circles.png';

function SurveyInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const { survey } = location.state;
  const userId = localStorage.getItem('userId');

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

  const handleStartSurvey = () => {
    navigate('/surveywindow', { state: { survey, userId } });
  };

  return (
    <div className="SurveyInfo">
      <nav>
        <ul className='navbar'>
          <div className='nav_side'>
            <li onClick={logout} style={{ cursor: "pointer" }}>Sign out</li> 
            <li><Link to="/about" className='link'>About</Link></li>
            <li><Link to="/contact" className='link'>Contact</Link></li>
          </div>
          <li><img src={logo} alt='logo'/></li>
          <div className='nav_side'>
            <li><Link to="/user" className='link'>User</Link></li>
            <li><Link to="/dashboard" className='link'>Dashboard</Link></li>
            <li><Link to="/surveys" className='link'>Surveys</Link></li>
          </div>
        </ul>
      </nav>
      <div className='fix_nav_position'/>
      <div className='survey_info_main_cointainer'>
          <h2>{survey.title}</h2>
          <p><strong>Description:</strong> {survey.description}</p>
          <p><strong>Deadline:</strong> {formatDateWithRemainingDays(survey.deadline)}</p>
          <p><strong>Issuer:</strong> {survey.issuer}</p>
          <p><strong>Points:</strong> {survey.points_awarded}</p>
          <div className='finish survey_info_button'>
              <button onClick={handleStartSurvey}>Start survey</button>
          </div>
      </div>
      <div>
        <img src={bottomImage} alt='circles' className='bottom_image'/>
      </div>

      <footer>
      </footer>
    </div>
  );
}

export default SurveyInfo;