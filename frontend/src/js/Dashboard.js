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
  const [isLoading, setIsLoading] = useState(true);

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
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8000/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.toUpperCase());
        } else {
          throw new Error("Error fetching user data");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserPoints = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user/${userId}/points`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPoints(data.points);
        } else {
          throw new Error("Error fetching points");
        }
      } catch (error) {
        console.error("Error fetching points:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUser();
      fetchUserPoints();
    }
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Dashboard">
      <nav>
            <ul class='navbar'>
              <li onClick={logout} style={{ cursor: "pointer" }}>sign out</li> 
              <li><Link to="/about" class='link'>about</Link></li>
              <li><Link to="/user" class='link'>user</Link></li>
              <li><Link to="/dashboard" class='link'>dashboard</Link></li>
            </ul>
        </nav>
      <h1>WELCOME {user}</h1> 
      <div class='sidebar'>
        <ul>
            <li><h3>NAVIGATE</h3></li>
            <li><a href="#surveys">surveys</a></li>
            <li><a href="#awards">awards</a></li>
            <li><a href="#messages">messages</a></li>
        </ul>
      </div>

      <div class='section'>
        <h2 class='section_name' id='messages'>Notifications</h2>
        <hr class='devide_line'/>

        <div class='all_messages'>
          <div class='message_headers'>
            <p>Notification</p>
            <p>Date</p>
          </div>

          <div class='message_container'>
            <img src={bulbIcon} alt='mail'/>
            <p>message</p> {/* Replace message with the message */}
            <p>date</p> {/* Replace date with the date */}
          </div>
          
        </div>
      </div>
      

      <div class='section'>
        <h2 class='section_name' id='surveys'>surveys</h2>
        <hr class='devide_line'/>
        <div class='survey_container'>
            <div class='inner_surveys'>
                <h3>new</h3>
                <p>survey name</p> {/* Replace survey name with the name of the survey  and dislpay 3 most recect*/}
            </div>
            <div class='inner_surveys'>
                <h3>in progress</h3>
                <p>survey name</p> {/* Replace survey name with the name of the survey  and dislpay 3 with shortest deadline*/}
            </div>
        </div>
        <Link to="/surveys" class='link' id='view_more'>view more</Link>
      </div>

      <div class='section'>
        <h2 class='section_name' id='awards'>awards</h2>
        <hr class='devide_line'/>
        <div class='points'>
            <p>you have</p>
            <p> { points } </p> {/* Replace 1000 with the user's points */}
            <img src={starIcon} alt='star'/>
        </div>

        <div class='all_awards'>  {/* Display all awards */}
          <div class='award_container'>
            <div class='points_required'>
              <p>800</p> {/* Replace 800 with the required points */}
              <img src={starIcon} alt='star'/>
            </div>
            <div class='award'>
              <img src={frogIcon} alt='frog'/>
              <p>500 frogpoints</p> {/* Replace 500 frogpointswith the award*/}
              <input type="submit" value="redeem" />
            </div>
          </div>
        </div>
      </div>

      <footer>
      </footer>
    </div>
  );
}

export default Dashboard;