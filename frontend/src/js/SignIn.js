import React, { useState } from 'react';
import '../css/SignForm.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/App.css';
import logo from '../images/photos/logo_surveys3.png'

const SignIn = ({ onAuthenticationSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8000/signin',
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        onAuthenticationSuccess();
      } else {
        console.error("Login failed:", response);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="SignIn">
        <nav>
          <ul class='navbar'>
            <div class='nav_side'>
              <li><Link to="/signUp" class='link'>Sign up</Link></li> {/*Visible only when user not signed in*/}
              <li><Link to="/signIn" class='link'>Sign in</Link></li> {/*Visible only when user not signed in*/}
              <li><Link to="/about" class='link'>About</Link></li>
              <li><Link to="/contact" class='link'>Contact</Link></li>  
            </div>
            <li><Link to="/" class='link'><img src={logo} alt='logo'/></Link></li>
            <div class='nav_side'>
            </div> 
          </ul>
        </nav>
        <div class='fix_nav_position'/>
        <h1>Sign In</h1>

        <form class='signForm' onSubmit={handleSubmit}>
          <div class='formElem'>
            <label for="email">email:</label>
            <input type="email" 
            value = {email}
            onChange={(e) => setEmail(e.target.value)}
            name='email' 
            required />
          </div>

          <div class='formElem'>
            <label for="pass">password:</label>
            <input type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name='pass' 
            required />
          </div>  

          <div class='formElem'>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form> 
        {errorMessage && (
        <div style={{ color: 'red' }}>
          <p>{errorMessage}</p>
        </div>
      )}
      </div>
  );
}

export default SignIn;