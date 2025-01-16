import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../css/Dashboard.css';
import '../css/Surveys.css';
import '../css/App.css';
import logo from '../images/photos/logo_surveys3.png';

function Surveys() {
  const [surveys, setSurveys] = useState({ new: [], inProgress: [] , abandoned: [] });
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId') || localStorage.getItem('userId');

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const surveysResponse = await fetch(`http://localhost:8000/user/${userId}/surveys`);

        if (surveysResponse.ok) {
          const surveysData = await surveysResponse.json();
          console.log("Surveys Data:", surveysData);

          const surveysArray = Array.isArray(surveysData.surveys) ? surveysData.surveys.flat() : Object.values(surveysData.surveys).flat();
          console.log("Surveys Array:", surveysArray);

          const notStartedSurveys = surveysArray.filter(survey => survey.survey_state === 'not_started');
          const inProgressSurveys = surveysArray.filter(survey => survey.survey_state === 'started');
          const abandonedSurveys = surveysArray.filter(survey => survey.survey_state === 'abandoned' || survey.survey_state === 'completed');

          console.log("Not Started Surveys:", notStartedSurveys);
          console.log("In Progress Surveys:", inProgressSurveys);
          console.log("Abandoned Surveys:", abandonedSurveys);

          setSurveys({
            new: notStartedSurveys, // All new surveys
            inProgress: inProgressSurveys.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)), // All in-progress surveys sorted by deadline
            abandoned: abandonedSurveys, // All abandoned surveys
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userId) {
      fetchData();
    } else {
      console.error("User ID is missing");
    }
  }, [userId]);

  const handleSurveyClick = (survey) => {
    navigate('/surveyinfo', { state: { survey, userId } });
  };

  const handleDropSurvey = async (survey) => {
    try {
      const response = await fetch(`http://localhost:8000/user/${userId}/surveys/${survey.survey_id}/drop`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setSurveys((prev) => {
          const updatedInProgress = prev.inProgress.filter(s => s.survey_id !== survey.survey_id);
          const updatedNew = prev.new.filter(s => s.survey_id !== survey.survey_id);
          const updatedAbandoned = [...prev.abandoned, { ...survey, survey_state: 'abandoned' }];
  
          return {
            ...prev,
            inProgress: updatedInProgress,
            new: updatedNew,
            abandoned: updatedAbandoned,
          };
        });
      }
    } catch (error) {
      console.error('Drop survey error:', error);
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
    <div className="Surveys">
      <nav>
        <ul className='navbar'>
          <div className='nav_side'>
            <li onClick={logout} style={{ cursor: "pointer" }}>Sign out</li> 
            <li><Link to="/about" className='link'>About</Link></li>
            <li><Link to="/contact" className='link'>Contact</Link></li>
          </div>
          <li><Link to="/dashboard" class='link'><img src={logo} alt='logo'/></Link></li>
          <div className='nav_side'>
            <li><Link to="/user" className='link'>User</Link></li>
            <li><Link to="/dashboard" className='link'>Dashboard</Link></li>
            <li><Link to="/surveys" className='link'>Surveys</Link></li>
          </div>
        </ul>
      </nav>
      <div className='fix_nav_position'/>
      <h1>ALL SURVEYS IN ONE PLACE</h1>
      <div className='sidebar'>
        <ul>
            <li><h3>NAVIGATE</h3></li>
            <li><a href="#in_progress">In progress</a></li>
            <li><a href="#new">New</a></li>
            <li><a href="#history">History</a></li>
        </ul>
      </div>

      <div className='section'>
        <h2 className='section_name' id='surveys'>In progress</h2>
        <hr className='devide_line'></hr>
        <div className='survey_list'>
          <div className='survey_headers'>
            <p>Survey name</p>
            <p className='deadline'>Deadline</p>
          </div>
          {surveys.inProgress.length > 0 ? (
            surveys.inProgress.map((survey, index) => (
              <div key={index} className="survey_cont_surv">
                <p className="sur_name" onClick={() => handleSurveyClick(survey)}>{survey.title}</p>
                <p className="deadline">{formatDateWithRemainingDays(survey.deadline)}</p>
                <button class="details" onClick={() => handleSurveyClick(survey)}>View details</button>
                <button class="drop_survey" onClick={() => handleDropSurvey(survey)}>Drop Survey</button>
              </div>
            ))
          ) : (
            <p>No surveys in progress.</p>
          )}
        </div>
      </div>
      <div className="section">
        <h2 className="section_name" id="new">New</h2>
        <hr className="devide_line" />
        <div className="survey_list">
          <div className="survey_headers">
            <p>Survey name</p>
            <p className="deadline">Deadline</p>
          </div>
          {surveys.new.length > 0 ? (
            surveys.new.map((survey, index) => (
              <div key={index} className="survey_cont_surv">
                <p className="sur_name" onClick={() => handleSurveyClick(survey)}>{survey.title}</p>
                <p className="deadline">{formatDateWithRemainingDays(survey.deadline)}</p>
                <button class="details" onClick={() => handleSurveyClick(survey)}>View details</button>
                <button class="drop_survey" onClick={() => handleDropSurvey(survey)}>Drop Survey</button>
              </div>
            ))
          ) : (
            <p>No new surveys available.</p>
          )}
        </div>
      </div>

      <div className="section">
        <h2 className="section_name" id="history">History</h2>
        <hr className="devide_line" />
        <div className="survey_list">
          <div className="survey_headers history">
            <p>Survey Name</p>
            <p>Status</p>
            <p>Points</p>
          </div>
          {surveys.abandoned.length > 0 ? (
            surveys.abandoned.map((survey, index) => (
              <div key={index} className="survey_cont_surv history">
                <p className="sur_name">{survey.title}</p>
                <p>{survey.survey_state === 'completed' ? 'Completed' : 'Not completed'}</p>
                <p>{survey.points_awarded}</p>
              </div>
            ))
          ) : (
            <p>No surveys in history.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Surveys;