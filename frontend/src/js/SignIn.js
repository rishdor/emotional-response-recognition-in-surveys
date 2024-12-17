import React, { useState } from 'react';
import '../css/SignForm.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/App.css';

const SignIn = ({ onAuthenticationSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="SignIn">

<nav>
            <ul class='navbar'>
              <li><Link to="/signUp" class='link'>sign up</Link></li> {/*Visible only when user not signed in*/}
              <li><Link to="/signIn" class='link'>sign in</Link></li> {/*Visible only when user not signed in*/}
              <li><Link to="/" class='link'>SmartSurveys</Link></li>
              <li><Link to="/about" class='link'>about</Link></li>
            </ul>
          </nav>
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
        <footer>
        </footer>
      </div>
  );
}

export default SignIn;