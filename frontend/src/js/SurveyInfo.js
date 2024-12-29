import React from 'react';
import { Link } from 'react-router-dom';
import '../css/App.css';
import '../css/SurveyInfo.css';
import '../css/SurveyWindow.css';
import '../css/Dashboard.css';
import bottomImage from '../images/photos/circles.png';

function SurveyInfo() {
  const isLogged = document.cookie.includes("user_session");
  const handleLogout = () => {
    document.cookie = "user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.assign("/");
  }
  return (
    <div className="SurveyInfo">
      <nav>
        <ul class='navbar'>
          {!isLogged && (
          <li><Link to="/signUp" class='link'>sign up</Link></li>
          )}
          {!isLogged && (
          <li><Link to="/signIn" class='link'>sign in</Link></li>
          )}
          {isLogged && (
          <li onClick={handleLogout} style={{ cursor: "pointer" }}>sign out</li> 
          )}
          {!isLogged &&(
          <li><Link to="/" class='link'>SmartSurveys</Link></li>
          )}    
          <li><Link to="/about" class='link'>about</Link></li>                            
          {isLogged &&(
            <li><Link to="/user" class='link'>user</Link></li>
          )}
          {isLogged &&(
            <li><Link to="/dashboard" class='link'>dashboard</Link></li>
          )}
        </ul>
      </nav>
      <div class='survey_info_main_cointainer'>
          <h2>survey title</h2> {/* from db*/}
          <hr class='question_underline'></hr>
          <div class='surv_info_inner_div'>
            <label>Deadline:</label>
            <p class='surv_deadline'>deadline</p> {/* from db*/}
          </div>
          <div class='surv_info_inner_div'>
            <label>Issuer:</label>
            <p>issuer</p> {/* from db*/}
          </div>
          <p> survey descripion: In finibus tempus aliquet. Integer porttitor porta malesuada. Praesent lectus risus, porta quis fermentum in, ultricies vitae ipsum. Curabitur felis odio, consequat a eros eu, scelerisque auctor dui. Vivamus maximus viverra orci in vestibulum. Cras fringilla et libero ac lobortis. Aliquam a viverra turpis, sed placerat est. In vel turpis fringilla, suscipit lectus a, pulvinar risus. Ut eget sem placerat, rutrum urna et, bibendum orci. Nulla cursus nunc non diam semper accumsan.
            Nam in turpis nisl. Integer neque neque, fermentum euismod est a, tempor volutpat magna. Duis vitae orci eu arcu viverra sollicitudin ac at turpis. Maecenas aliquam consectetur nisi, ac mollis quam ultricies in. Interdum et malesuada fames ac ante ipsum primis in faucibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla fringilla arcu velit, ut fringilla felis elementum id. Maecenas mollis diam nisl, in suscipit purus posuere nec. Donec bibendum, purus vitae blandit porta, arcu nisi tincidunt nibh, eget tempus purus nisi rhoncus metus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent suscipit mi sed sapien fringilla dapibus.
          </p>
          <div class='finish survey_info_button'>
              <Link to="/surveywindow" class='link'><input type="submit" value="Start survey" /></Link>
          </div>
      </div>
      <div>
        <img src={bottomImage} alt='bottom image' class='bottom_image'/>
      </div>

      <footer>
      </footer>
    </div>
  );
}

export default SurveyInfo;