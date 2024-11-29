import React, { useState } from 'react';
import '../css/SignForm.css';
<<<<<<< HEAD
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
=======
import { Link } from 'react-router-dom';
import '../css/App.css';
>>>>>>> origin/frontend

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8000/signin',
        {
          email,
          password
        },
        {
          withCredentials: true
        }
      );
      navigate('/dashboard')
    } catch (error) {
      setMessage('Login failed: ' + error.response.data.detail);
    }
  }

  return (
    <div className="SignIn">

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
            <input type="submit" value="Sign In" />
          </div>
        </form>

        <p>{message}</p> 

        <footer>
        </footer>
      </div>
  );
}

export default SignIn;