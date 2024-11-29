import React from 'react';
import '../css/SignForm.css';
import CountriesSelect from './CountriesSelect';
import { Link } from 'react-router-dom';

function SignUp() {
  return (
    <div className="SignUp">
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