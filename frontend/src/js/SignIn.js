import React, { useState } from 'react';
import '../css/SignForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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