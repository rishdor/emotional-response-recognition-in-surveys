import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/App.css';
import logo from '../images/photos/logo_surveys3.png'

function Contact() {
  const [isLogged, setIsLogged] = useState(false);

  const checkAuthStatus = async () => {
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
  return (
    <div className="Contact">
      <nav>
        <ul class='navbar'>
          <div class='nav_side'>
            {!isLogged && (
            <li><Link to="/signUp" class='link'>Sign up</Link></li>
            )}
            {!isLogged && (
            <li><Link to="/signIn" class='link'>Sign in</Link></li>
            )}
            {isLogged && (
            <li onClick={logout} style={{ cursor: "pointer" }}>Sign out</li> 
            )}
            <li><Link to="/about" class='link'>About</Link></li>                            
            <li><Link to="/contact" class='link'>Contact</Link></li>  
          </div>
          {!isLogged &&(
          <li><Link to="/" class='link'><img src={logo} alt='logo'/></Link></li>
          )}
          {isLogged &&(
          <li><img src={logo} alt='logo'/></li>
          )}
          <div class='nav_side'>
            {isLogged &&(
            <li><Link to="/user" class='link'>User</Link></li>
            )}
            {isLogged &&(
            <li><Link to="/dashboard" class='link'>Dashboard</Link></li>
            )}
            {isLogged &&(
              <li><Link to="/surveys" class='link'>Surveys</Link></li>
            )}
          </div> 
        </ul>
      </nav>
      <div class='fix_nav_position'/>
      <h2>Contact Page</h2>
      <p>This is the contact page.</p>
    </div>
  );
}

export default Contact;