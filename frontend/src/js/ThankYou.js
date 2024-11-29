import React from 'react';
import { Link } from 'react-router-dom';
import '../css/ThankYou.css';
import '../css/SurveyWindow.css';
import '../css/App.css';
import thankULeft from '../images/photos/thank_you_left.png'
import thankURight from '../images/photos/thank_you_right.png'

function ThankYou() {
  return (
    <div className="ThankYou">
      <nav>
            <ul class='navbar'>
              <li><Link to="/signUp" class='link'>sign up</Link></li> {/*Visible only when user not signed in*/}
              <li><Link to="/signIn" class='link'>sign in</Link></li> {/*Visible only when user not signed in*/}
              <li>sign out</li>                                       {/*Visible only when user signed in*/}
              <li><Link to="/" class='link'>SmartSurveys</Link></li>
              <li><Link to="/about" class='link'>about</Link></li>
              <li><Link to="/user" class='link'>user</Link></li>
              <li><Link to="/dashboard" class='link'>dashboard</Link></li>
            </ul>
          </nav>
      <div class='thank_container'>
        <img src={thankULeft} alt='Thank you' class='thx_img1'/>
        <h1 class='thx_message'>thank you for being a part of this survey</h1>
        <img src={thankURight} alt='Thank you' class='thx_img2'/>
      </div>
      <div class='finish'>
        <Link to="/surveys" class='link'><input type="submit" value="go back to surveys" /></Link>
      </div>
    </div>
  );
}

export default ThankYou;