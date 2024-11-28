import React from 'react';
import { Link } from 'react-router-dom';
import '../css/SurveyWindow.css';
import arrowIcon from '../images/icons8-arrow-left-96.png';

function SurveyWindow() {
  return (
    <div className="SurveyWindow">
      <div className="video_container">
      <iframe
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="working on rick roll"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </div>
    <div class="go_to_questions_container">
      <h3>go to the questions</h3>
      <Link to="/surveyquestions" class='link' id='go_to_questions'><img src={arrowIcon} alt='mail'></img></Link>
    </div>
    </div>
  );
}

export default SurveyWindow;