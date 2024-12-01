import React from 'react';
import { Link } from 'react-router-dom';
import '../css/App.css';

function About() {
  const isLogged = document.cookie.includes("user_session");
  const handleLogout = () => {
    document.cookie = "user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.assign("/");
  }
  return (
    <div className="About">
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
      <h2>About Page</h2>
      <p>This is the about page.</p>
    </div>
  );
}

export default About;