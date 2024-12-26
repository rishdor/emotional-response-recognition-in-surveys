import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../css/Dashboard.css';
import '../css/Surveys.css';
import '../css/App.css';

function Surveys() {
  const [surveys, setSurveys] = useState({ new: [], inProgress: [] });
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');

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

          // Ensure surveysData.surveys is an array and flatten it
          const surveysArray = Array.isArray(surveysData.surveys) ? surveysData.surveys.flat() : Object.values(surveysData.surveys).flat();
          console.log("Surveys Array:", surveysArray);

          const notStartedSurveys = surveysArray.filter(survey => survey.survey_state === 'not_started');
          const inProgressSurveys = surveysArray.filter(survey => survey.survey_state === 'started');

          console.log("Not Started Surveys:", notStartedSurveys);
          console.log("In Progress Surveys:", inProgressSurveys);

          setSurveys({
            new: notStartedSurveys, // All new surveys
            inProgress: inProgressSurveys.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)), // All in-progress surveys sorted by deadline
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const handleSurveyClick = (survey) => {
    navigate('/surveywindow', { state: { survey } });
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
        <ul className="navbar">
          <li onClick={logout} style={{ cursor: "pointer" }}>sign out</li>
          <li><Link to="/about" className="link">about</Link></li>
          <li><Link to="/user" className="link">user</Link></li>
          <li><Link to="/dashboard" className="link">dashboard</Link></li>
        </ul>
      </nav>
      <h1>all surveys in one place</h1>
      <div className="sidebar">
        <ul>
          <li><h3>NAVIGATE</h3></li>
          <li><a href="#in_progress">in progress</a></li>
          <li><a href="#new">new</a></li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section_name" id="in_progress">in progress</h2>
        <hr className="devide_line" />
        <div className="survey_list">
          <div className="survey_headers">
            <p>survey name</p>
            <p className="deadline">deadline</p>
          </div>
          {surveys.inProgress.length > 0 ? (
            surveys.inProgress.map((survey, index) => (
              <div key={index} className="survey_cont_surv" onClick={() => handleSurveyClick(survey)}>
                <p className="sur_name">{survey.title}</p>
                <p className="deadline">{formatDateWithRemainingDays(survey.deadline)}</p>
                <Link to="/surveywindow" className="link">View details</Link>
              </div>
            ))
          ) : (
            <p>No surveys in progress.</p>
          )}
        </div>
      </div>

      <div className="section">
        <h2 className="section_name" id="new">new</h2>
        <hr className="devide_line" />
        <div className="survey_list">
          <div className="survey_headers">
            <p>survey name</p>
            <p className="deadline">deadline</p>
          </div>
          {surveys.new.length > 0 ? (
            surveys.new.map((survey, index) => (
              <div key={index} className="survey_cont_surv" onClick={() => handleSurveyClick(survey)}>
                <p className="sur_name">{survey.title}</p>
                <p className="deadline">{formatDateWithRemainingDays(survey.deadline)}</p>
                <Link to="/surveywindow" className="link">View details</Link>
              </div>
            ))
          ) : (
            <p>No new surveys available.</p>
          )}
        </div>
      </div>

      <footer></footer>
    </div>
  );
}

export default Surveys;