import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Dashboard.css';
import '../css/Surveys.css';
import '../css/App.css';
import logo from '../images/photos/logo_surveys3.png';

function Surveys() {
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
    <div className="Surveys">
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
      <h1>ALL SURVEYS IN ONE PLACE</h1>
      <div class='sidebar'>
        <ul>
            <li><h3>NAVIGATE</h3></li>
            <li><a href="#in_progress">In progress</a></li>
            <li><a href="#new">New</a></li>
        </ul>
      </div>

      <div class='section'>
        <h2 class='section_name' id='surveys'>In progress</h2>
        <hr class='devide_line'></hr>
        <div class='survey_list'>
          <div class='survey_headers'>
            <p>Survey name</p>
            <p class='deadline'>Deadline</p>
          </div>

          <div class='survey_cont_surv'>
            <p class='sur_name'>survey name</p> {/* Replace message with the name of the survey */}
            <p class='deadline'>deadline</p> {/* Replace date with the date */}
            <Link to="/surveyinfo" className='link'>Start</Link>
          </div>
        </div>
      </div>

      <div class='section'>
        <h2 class='section_name' id='surveys'>New</h2>
        <hr class='devide_line'></hr>
        <div class='survey_list'>
          <div class='survey_headers'>
            <p>Survey name</p>
            <p class='deadline'>Deadline</p>
          </div>

          <div class='survey_cont_surv'>
            <p class='sur_name'>survey name</p> {/* Replace message with the name of the survey */}
            <p class='deadline'>deadline</p> {/* Replace date with the date */}
            <Link to="/surveyinfo" className='link'>start</Link>
          </div>
        </div>
      </div>

      <footer>
      </footer>
    </div>
  );
}

export default Surveys;