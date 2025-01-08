import React from 'react';
import { Link } from 'react-router-dom';
import '../css/ThankYou.css';
import '../css/SurveyWindow.css';
import '../css/App.css';
import logo from '../images/photos/logo_surveys3.png';
import thankULeft from '../images/photos/thank_you_left.png'
import thankURight from '../images/photos/thank_you_right.png'

function ThankYou() {
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
    <div className="ThankYou">
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