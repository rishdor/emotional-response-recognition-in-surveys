import React from 'react';
import '../css/SignForm.css';

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
    </div>
  );
}

export default SignUp;