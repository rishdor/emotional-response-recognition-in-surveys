import React from 'react';
import '../css/SignForm.css';
import CountriesSelect from './CountriesSelect';
import { Link } from 'react-router-dom';
import '../css/App.css';

function SignUp() {
  return (
    <div className="SignUp">
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
      <h1>Sign Up</h1>

      <div class='signForm'>
        <div class='formElem'>
          <label for="name">name:</label>
          <input type="text" name='name' required />
        </div>
        
        <div class='formElem'>
          <label for="email">email:</label>
          <input type="email" name='email' required />
        </div>

        <div class='formElem'>
          <label for="country">country:</label>
          <CountriesSelect /> {/*it was way to long to put it in the same file, but might be put back here */}
        </div>

        <div class='formElem'>
          <label for="city">city:</label>
          <input type="text" name='city' required />
        </div>

        <div class='formElem'>
          <label for="job_position">job position:</label>
          <input type="text" name='job_position' required />
        </div>

        <div class='formElem'>
          <label for="education_level">education level:</label>
          <input type="text" name='education_level' required />
        </div>

        <div class='formElem'>
          <label for="birth">date of birth:</label>
          <input type="date" name='birth' required />
        </div>

        <div class='formElem'>
          <label for="gerder">gender:</label>
          <select name="gender" id="gender" required>
            <option value="">select your gender</option>
            <option value="F">female</option>
            <option value="M">male</option>
            <option value="O">other</option>
            <option value="N">prefer not to say</option>
          </select>
        </div>

        <div class='formElem'>
          <label for="pass">password:</label>
          <input type="password" name='pass' required />
        </div>  

        <div class='formElem'>
          <label for="repPass">repeat password:</label>
          <input type="password" name='repPass' required />
        </div>

        <div class='formElem'>
          <input type="checkbox" name="rodo" required />
          <label for="rodo">*I confirm being informed about the privacy policy</label>
        </div>

        <div class='formElem'>
          <input type="submit" value="Sign Up" />
        </div>
      </div>
      <footer>
      </footer>
    </div>
  );
}

export default SignUp;