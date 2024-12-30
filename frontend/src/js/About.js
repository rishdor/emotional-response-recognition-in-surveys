import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/App.css';

function About() {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
 

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/verify", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    } catch (error) {
      console.log("Authentication error:", error);
      setIsLogged(false);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
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

  if (isLoading) {
    return <div>Loading...</div>;
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
              <li onClick={logout} style={{ cursor: "pointer" }}>sign out</li> 
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