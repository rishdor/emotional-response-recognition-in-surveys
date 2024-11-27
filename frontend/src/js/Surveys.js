import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import '../css/Dashboard.css';
import '../css/Surveys.css';
import SurveyWindow from './SurveyWindow';

function Surveys() {
  return (
    <div className="Surveys">
      <h1>all surveys in one place</h1> {/* Replace NAME with the user's name */}
      <div class='sidebar'>
        <ul>
            <li><h3>NAVIGATE</h3></li>
            <li><a href="#in_progress">in progress</a></li>
            <li><a href="#new">new</a></li>
        </ul>
      </div>

      <div class='section'>
        <h2 class='section_name' id='surveys'>in progress</h2>
        <hr class='devide_line'></hr>
        <div class='survey_list'>
          <div class='survey_headers'>
            <p>survey name</p>
            <p class='deadline'>deadline</p>
          </div>

          <div class='survey_cont_surv'>
            <p class='sur_name'>survey name</p> {/* Replace message with the name of the survey */}
            <p class='deadline'>deadline</p> {/* Replace date with the date */}
            <Link to="/surveywindow" className='link'>start</Link>
          </div>
        </div>
      </div>

      <div class='section'>
        <h2 class='section_name' id='surveys'>new</h2>
        <hr class='devide_line'></hr>
        <div class='survey_list'>
          <div class='survey_headers'>
            <p>survey name</p>
            <p class='deadline'>deadline</p>
          </div>

          <div class='survey_cont_surv'>
            <p class='sur_name'>survey name</p> {/* Replace message with the name of the survey */}
            <p class='deadline'>deadline</p> {/* Replace date with the date */}
            <Link to="/surveywindow" className='link'>start</Link>
          </div>
        </div>
      </div>

      <footer>
      </footer>
    </div>
  );
}

export default Surveys;