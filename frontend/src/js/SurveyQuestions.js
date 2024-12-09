import React from 'react';
import '../css/SurveyWindow.css';
import '../css/Dashboard.css';
import { Link } from 'react-router-dom';
import '../css/App.css';

function SurveyQuestions() {
  const handleLogout = () => {
    document.cookie = "user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.assign("/");
  }
  return (
    <div className="SurveyQuestions">
      <nav>
            <ul class='navbar'>
              <li onClick={handleLogout} style={{ cursor: "pointer" }}>sign out</li>
              <li><Link to="/about" class='link'>about</Link></li>
              <li><Link to="/user" class='link'>user</Link></li>
              <li><Link to="/dashboard" class='link'>dashboard</Link></li>
            </ul>
          </nav>
      <template class="question_container">
        <h3>Question 1</h3> {/*Replace with question number */}
        <hr class='question_underline'/>
        <div class="question">
            <p>question</p> {/*Replace with question */}
            <div class="singular_choice">
                <div class="answer">
                    <input type="radio" id="answer_radioA" name="answer_radio" value="A"/>  {/*Replace value with answer value */}
                    <label for="answer_radioA">A answer</label>   {/*Replace with answer */}
                </div>
                <div class="answer">
                    <input type="radio" id="answer_radioB" name="answer_radio" value="B"/>  {/*Replace value with answer value */}
                    <label for="answer_radioB">B answer</label>   {/*Replace with answer */}
                </div>
            </div>
        </div>
      </template>
      <div class="question_container">
        <h3>Question 2</h3> {/*Replace with question number */}
        <hr class='question_underline'/>
        <div class="question">
            <p>question</p> {/*Replace with question */}
            <div class="multiple_choice">
                <div class="answer">
                    <input type="checkbox" id="answer_checkboxA" name="answer_checkbox" value="A"/>   {/*Replace value with answer value */}
                    <label for="answer_checkboxA">A answer</label>   {/*Replace with answer */}
                </div>
                <div class="answer">
                    <input type="checkbox" id="answer_checkboxB" name="answer_checkbox" value="B"/>   {/*Replace value with answer value */}
                    <label for="answer_checkboxB">B answer</label>   {/*Replace with answer */}
                </div>
            </div>
        </div>
      </div>

      <div class='finish'>
        <Link to="/thankyou" class='link'><input type="submit" value="finish survey" /></Link>
      </div>
    </div>
  );
}

export default SurveyQuestions;