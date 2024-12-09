import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import '../css/App.css';
import checkIcon from '../images/icons8-checkmark-50.png';
import heroPhoto from '../images/photos/portrait-stylish-young-woman-brunette-girl-with-laptop-sitting-outdoors-using-computer.jpg'

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
                <img src={checkIcon}/>
                <p>fill in surveys with your mimicry</p>
              </div>
              <div class='hero_elem'>
                <img src={checkIcon}/>
                <p>exchange survey points for awards</p>
              </div>
              <div class='hero_elem'>
                <img src={checkIcon}/>
                <p>keep track of your surveys</p>
              </div>
            </div>
            <hr class='quarter_circle'/>
          </div>
          <div class='hero_photo_container'>
              <img src={heroPhoto} class='hero_photo'/>
          </div>
        </div>
        <div>
          <h2>ABOUT US</h2>
          <p>SmartSurveys is a platform that allows you to fill in surveys just with your mimicry. You can exchange survey points for awards, keep track of your surveys and much more. Sign up now and start earning!</p>
        </div>
        <footer>
        </footer>
      </div>
    );
  }
  
  export default Home;