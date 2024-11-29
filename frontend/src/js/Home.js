import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMessage } from './fetcher';
// import '../css/Home.css';
import '../css/App.css';

function Home() {
    const [message, setMessage] = useState("");
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const message = await fetchMessage();
          setMessage(message);
        } catch (error) {
          console.error("Error fetching message:", error);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <div className="Home">
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
        <h1>FastAPI React Integration</h1>
        <p>{message}</p>

        <footer>
        </footer>
      </div>
    );
  }
  
  export default Home;