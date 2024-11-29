import React from 'react';
import { Link } from 'react-router-dom';
import '../css/App.css';

function About() {
  return (
    <div className="About">
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
      <h2>About Page</h2>
      <p>This is the about page.</p>
    </div>
  );
}

export default About;