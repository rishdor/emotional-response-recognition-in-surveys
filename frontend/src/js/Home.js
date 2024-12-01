import React from 'react';
import { Link } from 'react-router-dom';
// import '../css/Home.css';
import '../css/App.css';

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
        <h1>FastAPI React Integration</h1>
        <footer>
        </footer>
      </div>
    );
  }
  
  export default Home;