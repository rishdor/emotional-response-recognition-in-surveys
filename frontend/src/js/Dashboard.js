import { React, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';
import '../css/App.css';
import logo from '../images/photos/logo_surveys3.png';
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

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }, [userId]);

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
          setUser(userData);
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
    navigate('/surveyinfo', { state: { survey, user } });
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

  const handleRedeem = async (reward) => {
    try {
      const response = await fetch(`http://localhost:8000/user/${userId}/rewards/${reward.reward_id}/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        alert("Yay, next time you can redeem the reward is in one month.");

        const updatedRewards = rewards.map(r => r.reward_id === reward.reward_id ? { ...r, last_redeemed: new Date() } : r);
        setRewards(updatedRewards);

        // Update user points
        const pointsResponse = await fetch(`http://localhost:8000/user/${userId}/points`);
        if (pointsResponse.ok) {
          const pointsData = await pointsResponse.json();
          setPoints(pointsData.points);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.detail);
      }
    } catch (error) {
      console.error("Error redeeming reward:", error);
      alert("Failed to redeem reward");
    }
  };

  const calculateDaysLeft = (lastRedeemed) => {
    const now = new Date();
    const lastRedeemedDate = new Date(lastRedeemed);
    const daysSinceLastRedeemed = Math.ceil((now - lastRedeemedDate) / (1000 * 60 * 60 * 24));
    return 30 - daysSinceLastRedeemed;
  };

  return (
    <div className="Dashboard">
      <nav>
        <ul className='navbar'>
          <div className='nav_side'>
            <li onClick={logout} style={{ cursor: "pointer" }}>Sign Out</li> 
            <li><Link to="/about" className='link'>About</Link></li>
            <li><Link to="/contact" className='link'>Contact</Link></li>
          </div>
          <li><img src={logo} alt='Logo'/></li>
          <div className='nav_side'>
            <li><Link to="/user" className='link'>User</Link></li>
            <li><Link to="/dashboard" className='link'>Dashboard</Link></li>
            <li><Link to={`/surveys?userId=${userId}`} className='link'>Surveys</Link></li>
          </div>
        </ul>
      </nav>
      <div className='fix_nav_position'/>
      <h1>Welcome {user}</h1> 
      <div className='sidebar'>
        <ul>
            <li><h3>Navigate</h3></li>
            <li><a href="#surveys">Surveys</a></li>
            <li><a href="#awards">Awards</a></li>
            <li><a href="#messages">Messages</a></li>
        </ul>
      </div>

      {/* <div className="section">
        <h2 className="section_name" id="messages">Notifications</h2>
        <hr className="devide_line" />
        <div className="all_messages">
          <div className="message_headers">
            <p>Notification</p>
            <p>Date</p>
          </div>
          {notifications.map((note, index) => (
            <div className="message_container" key={index}>
              <img src={bulbIcon} alt="Notification" />
              <p>{note.message}</p>
              <p>{note.date}</p>
            </div>
          ))}
        </div>
      </div> */}

      <div className="section">
        <h2 className="section_name" id="surveys">Surveys</h2>
        <hr className="devide_line" />
        <div className="survey_container">
          <div className="inner_surveys">
            <h3>New</h3>
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
            <h3>In Progress</h3>
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
        <Link to={`/surveys?userId=${userId}`} className="link view_more">View More</Link>
      </div>
      <div className="section">
        <h2 className="section_name" id="rewards">Rewards</h2>
        <hr className="devide_line" />
        <div className="points">
          <p>You Have</p>
          <p>{points}</p>
          <img src={starIcon} alt="Star" />
        </div>
        <div className="all_rewards">
          {rewards.sort((a, b) => a.points_required - b.points_required).map((reward, index) => {
            const daysLeft = reward.last_redeemed ? calculateDaysLeft(reward.last_redeemed) : 0;
            const canRedeem = points >= reward.points_required && daysLeft <= 0;

            return (
              <div className="reward_container" key={index}>
                <div className="points_required">
                  <p>{reward.points_required}</p>
                  <img src={starIcon} alt="Star" />
                </div>
                <div className="reward">
                  <img src={frogIcon} alt="Reward" />
                  <p>{reward.reward_description}</p>
                  <input 
                    type="submit" 
                    value={canRedeem ? "Redeem Now" : points < reward.points_required ? "Not Enough Points" : `Available in ${daysLeft} days`} 
                    onClick={() => handleRedeem(reward)} 
                    disabled={!canRedeem}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer></footer>
    </div>
  );
};

export default Dashboard;