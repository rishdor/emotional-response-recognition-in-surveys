import React from 'react';
import '../css/SurveyWindow.css';
import '../css/Dashboard.css';
import { Link } from 'react-router-dom';
import '../css/App.css';
import logo from '../images/photos/logo_surveys3.png';


function SurveyQuestions() {
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
    <div className="SurveyQuestions">
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
        
      <div class='stop_button_container'>
        <Link to="/surveys" class='link'><button class='stop_button'>Stop survey</button></Link>
      </div>
      <div class="question_container">
          <h3>Question 1</h3> {/*Replace with question number */}
          <hr class='question_underline'/>
          <div class="question">
              <p>question</p> {/*Replace with question */}
              <div class="singular_choice">
                  <div class="answer">
                      <input type="radio" id="answer_radioA" name="answer_radio" value="A"/>  {/*Replace value with answer value */}
                      <label for="answer_radioA">A answer</label>   {/*Replace with answer */}
                  </div>
              </div>
          </div>
      </div>
      
      <div class="question_container">
          <h3>Question 1</h3> {/*Replace with question number */}
          <hr class='question_underline'/>
          <div class="question">
              <p>question</p> {/*Replace with question */}
              <div class="multiple_choice">
                  <div class="answer">
                      <input type="checkbox" id="answer_checkboxA" name="answer_checkbox" value="A"/>   {/*Replace value with answer value */}
                      <label for="answer_checkboxA">A answer</label>   {/*Replace with answer */}
                  </div>
              </div>
          </div>
      </div>

      <div class='finish'>
        <input type="submit" value="Next question"/>  {/* FOR ALL QUESTIONS EXCEPT THE LAST ONE*/}
      </div>

      <div class='finish'>
        <Link to="/thankyou" class='link'><input type="submit" value="Finish survey" /></Link>  {/*ONLY FOR THE LAST QUESTION */}
      </div>
      
    </div>
  );
}

export default SurveyQuestions;

