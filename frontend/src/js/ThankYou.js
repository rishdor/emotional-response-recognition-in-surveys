import React from 'react';
import { Link } from 'react-router-dom';
import '../css/ThankYou.css';
import '../css/SurveyWindow.css';
import thankULeft from '../images/photos/thank_you_left.png'
import thankURight from '../images/photos/thank_you_right.png'

function ThankYou() {
  return (
    <div className="ThankYou">
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