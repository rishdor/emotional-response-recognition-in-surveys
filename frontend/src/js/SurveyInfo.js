import React from 'react';
import { Link } from 'react-router-dom';
import '../css/App.css';
import '../css/SurveyInfo.css';
import '../css/SurveyWindow.css';
import '../css/Dashboard.css';
import logo from '../images/photos/logo_surveys3.png';
import bottomImage from '../images/photos/circles.png';

function SurveyInfo() {
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
    <div className="SurveyInfo">
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
        <img src={bottomImage} alt='circles' class='bottom_image'/>
      </div>

      <footer>
      </footer>
    </div>
  );
}

export default SurveyInfo;