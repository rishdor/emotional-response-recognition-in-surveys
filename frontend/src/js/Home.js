import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import '../css/App.css';
import checkIcon from '../images/icons8-checkmark-50.png';
import heroPhoto from '../images/photos/portrait-stylish-young-woman-brunette-girl-with-laptop-sitting-outdoors-using-computer.jpg'
import arrowIcon from '../images/icons8-arrow-left-96.png';

function Home() {
    return (
      <div className="Home">
        <nav>
            <ul class='navbar'>
              <li><Link to="/signUp" class='link'>sign up</Link></li> {/*Visible only when user not signed in*/}
              <li><Link to="/signIn" class='link'>sign in</Link></li> {/*Visible only when user not signed in*/}
              <li><Link to="/" class='link'>SmartSurveys</Link></li>
              <li><Link to="/about" class='link'>about</Link></li>
            </ul>
          </nav>
        <div class='hero'>
          <div class='left_side'>
            <h1>SURVEYS OF TOMORROW</h1>
            <div class='hero_check_list'>
              <div class='hero_elem'>
                <img src={checkIcon} alt="check"/>
                <p>fill in surveys with your mimicry</p>
              </div>
              <div class='hero_elem'>
                <img src={checkIcon} alt="check"/>
                <p>exchange survey points for awards</p>
              </div>
              <div class='hero_elem'>
                <img src={checkIcon} alt="check"/>
                <p>keep track of your surveys</p>
              </div>

              <div class='hero_elem'>
                <div class='arrow_top'>
                  <img src={arrowIcon} alt="arrow"/>
                </div>
                <div class='hero_button'>
                  <Link to="/signUp" class='link'>Start today!</Link>
                </div>
                <div class='arrow_bottom'>
                  <img src={arrowIcon} alt="arrow"/>
                </div>
              </div>
              
            </div>
            <div class='quarter_circle_container'>
              <hr class='quarter_circle'/>
            </div>
          </div>

          <div class='hero_photo_container'>
              <img src={heroPhoto} class='hero_photo' alt="woman with laptop"/>
          </div>
        </div>
        <div class='under_hero'>
          <h2>NO IDEA WHAT TO PUT IN HERE, WILL FIGURE IT OUT IN THE FUTURE</h2>
          <p>???</p>
        </div>
        <footer>
        </footer>
      </div>
    );
  }
  
  export default Home;