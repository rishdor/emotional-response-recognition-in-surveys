import React from 'react';
import '../css/SignForm.css';
import { Link } from 'react-router-dom';
import '../css/App.css';

function SignIn() {
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

        <div class='signForm'>
          <div class='formElem'>
            <label for="email">email:</label>
            <input type="email" name='email' required />
          </div>

          <div class='formElem'>
            <label for="pass">password:</label>
            <input type="password" name='pass' required />
          </div>  

          <div class='formElem'>
            <input type="submit" value="Sign In" />
          </div>
        </div>
        <footer>
        </footer>
      </div>
  );
}

export default SignIn;