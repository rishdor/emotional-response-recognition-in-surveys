import { React, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';
import '../css/App.css';
import starIcon from '../images/icons8-star-64.png';
import frogIcon from '../images/icons8-frog-96.png';
import bulbIcon from '../images/icons8-light-bulb-48.png';

const Dashboard = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(null);
  const [surveys, setSurveys] = useState({ new: [], inProgress: [] });
  const [rewards, setRewards] = useState([]);
  const [notifications] = useState([
    { message: "Complete your data!", date: "2024-12-19" },
    { message: "New survey available!", date: "2024-12-18" },
  ]);

  const navigate = useNavigate();

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
        const userResponse = await fetch(`http://localhost:8000/users/${userId}`);
        const pointsResponse = await fetch(`http://localhost:8000/user/${userId}/points`);
        const surveysResponse = await fetch(`http://localhost:8000/user/${userId}/surveys`);
        const rewardsResponse = await fetch(`http://localhost:8000/user/${userId}/rewards`);

        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log("User Data:", userData);
          setUser(userData.toUpperCase());
        }
        if (pointsResponse.ok) {
          const pointsData = await pointsResponse.json();
          console.log("Points Data:", pointsData);
          setPoints(pointsData.points);
        }
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
            new: notStartedSurveys.slice(0, 3), // 3 most recent
            inProgress: inProgressSurveys.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 3), // 3 with shortest deadlines
          });
        }
        if (rewardsResponse.ok) {
          const rewardsData = await rewardsResponse.json();
          console.log("Rewards Data:", rewardsData);
          setRewards(rewardsData.rewards);
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
    console.log("Navigating to survey window with survey:", survey);
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
    <div className="Dashboard">
      <nav>
        <ul className="navbar">
          <li onClick={logout} style={{ cursor: "pointer" }}>sign out</li>
          <li><Link to="/about" className="link">about</Link></li>
          <li><Link to="/user" className="link">user</Link></li>
          <li><Link to="/dashboard" className="link">dashboard</Link></li>
        </ul>
      </nav>
      <h1>WELCOME {user}!</h1>
      <div className="sidebar">
        <ul>
          <li><h3>NAVIGATE</h3></li>
          <li><a href="#surveys">surveys</a></li>
          <li><a href="#rewards">rewards</a></li>
          <li><a href="#messages">messages</a></li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section_name" id="messages">Notifications</h2>
        <hr className="devide_line" />
        <div className="all_messages">
          <div className="message_headers">
            <p>Notification</p>
            <p>Date</p>
          </div>
          {notifications.map((note, index) => (
            <div className="message_container" key={index}>
              <img src={bulbIcon} alt="notification" />
              <p>{note.message}</p>
              <p>{note.date}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section_name" id="surveys">surveys</h2>
        <hr className="devide_line" />
        <div className="survey_container">
          <div className="inner_surveys">
            <h3>new</h3>
            {surveys.new.length > 0 ? (
              surveys.new.map((survey, index) => (
                <div key={index} className="survey_block" onClick={() => handleSurveyClick(survey)}>
                  <p>{survey.title}</p>
                  <p>{formatDateWithRemainingDays(survey.deadline)}</p>
                </div>
              ))
            ) : (
              <p>No new surveys available.</p>
            )}
          </div>
          <div className="inner_surveys">
            <h3>in progress</h3>
            {surveys.inProgress.length > 0 ? (
              surveys.inProgress.map((survey, index) => (
                <div key={index} className="survey_block" onClick={() => handleSurveyClick(survey)}>
                  <p>{survey.title}</p>
                  <p>{formatDateWithRemainingDays(survey.deadline)}</p>
                </div>
              ))
            ) : (
              <p>No surveys in progress.</p>
            )}
          </div>
        </div>
        <Link to={`/surveys?userId=${userId}`} className="link" id="view_more">view more</Link>
      </div>

      <div className="section">
        <h2 className="section_name" id="rewards">rewards</h2>
        <hr className="devide_line" />
        <div className="points">
          <p>you have</p>
          <p>{points}</p>
          <img src={starIcon} alt="star" />
        </div>
        <div className="all_rewards">
          {rewards.map((reward, index) => (
            <div className="reward_container" key={index}>
              <div className="points_required">
                <p>{reward.points_required}</p>
                <img src={starIcon} alt="star" />
              </div>
              <div className="reward">
                <img src={frogIcon} alt="reward" />
                <p>{reward.reward_description}</p>
                <input type="submit" value="redeem" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer></footer>
    </div>
  );
};

export default Dashboard;