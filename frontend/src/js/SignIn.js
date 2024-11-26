import React from 'react';
import '../css/SignForm.css';

function SignIn() {
  return (
    <div className="SignIn">
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