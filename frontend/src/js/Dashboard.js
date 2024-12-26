import { React, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Dashboard.css';
import '../css/App.css';
import starIcon from '../images/icons8-star-64.png';
import frogIcon from '../images/icons8-frog-96.png';
import bulbIcon from '../images/icons8-light-bulb-48.png';

const Dashboard = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(null);
  const [surveys, setSurveys] = useState({ new: [], inProgress: [] });
  const [awards, setAwards] = useState([]);
  const [notifications] = useState([
    { message: "Complete your data!", date: "2024-12-19" },
    { message: "New survey available!", date: "2024-12-18" },
  ]);

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
        const awardsResponse = await fetch(`http://localhost:8000/user/${userId}/rewards`);

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.toUpperCase());
        }
        if (pointsResponse.ok) {
          const pointsData = await pointsResponse.json();
          setPoints(pointsData.points);
        }
        if (surveysResponse.ok) {
          const surveysData = await surveysResponse.json();
          setSurveys({
            new: surveysData.surveys.filter(survey => survey.survey_state === 'not_started').slice(0, 3), // 3 most recent
            inProgress: surveysData.surveys.filter(survey => survey.survey_state !== 'not_started').slice(0, 3), // 3 with shortest deadlines
          });
        }
        if (awardsResponse.ok) {
          const awardsData = await awardsResponse.json();
          setAwards(awardsData.rewards);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

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
      <h1>WELCOME {user}</h1>
      <div className="sidebar">
        <ul>
          <li><h3>NAVIGATE</h3></li>
          <li><a href="#surveys">surveys</a></li>
          <li><a href="#awards">awards</a></li>
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
            {surveys.new.map((survey, index) => (
              <p key={index}>{survey.survey_id}</p>
            ))}
          </div>
          <div className="inner_surveys">
            <h3>in progress</h3>
            {surveys.inProgress.map((survey, index) => (
              <p key={index}>{survey.survey_id}</p>
            ))}
          </div>
        </div>
        <Link to="/surveys" className="link" id="view_more">view more</Link>
      </div>

      <div className="section">
        <h2 className="section_name" id="awards">awards</h2>
        <hr className="devide_line" />
        <div className="points">
          <p>you have</p>
          <p>{points}</p>
          <img src={starIcon} alt="star" />
        </div>
        <div className="all_awards">
          {awards.map((award, index) => (
            <div className="award_container" key={index}>
              <div className="points_required">
                <p>{award.points_required}</p>
                <img src={starIcon} alt="star" />
              </div>
              <div className="award">
                <img src={frogIcon} alt="award" />
                <p>{award.reward_description}</p>
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