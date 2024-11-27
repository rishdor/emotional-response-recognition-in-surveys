import React from 'react';
import '../css/User.css';
import '../css/Dashboard.css';
import editIcon from '../images/icons8-edit-64.png';
import userIcon from '../images/icons8-user-64.png';

function User() {
  return (
    <div className="User">
      <h1>WELCOME NAME</h1> {/* Replace NAME with the user's name */}
      <div class='sidebar'>
        <ul>
            <li><h3>NAVIGATE</h3></li>
            <li><a href="#personal_data">personal data</a></li>
            <li><a href="#awards">awards</a></li>
            <li><a href="#messages">messages</a></li>
        </ul>
      </div>

      <div class='user_section'>
        <div class='above_line'>
            <h2 class='section_name' id='personal_data'>personal data</h2>
            <button class='edit_icon' id='edit_data'><img src={editIcon} alt='edit'></img></button>
        </div>
        <hr class='devide_line'></hr>
        <div class='data_container'>
            <div class='user_photo'>
                <img src={userIcon} alt='user'></img>
            </div>
            <div class='all_data'>
                <div class='data'>
                    <label for='name'>name:</label>
                    <p name='name'>name</p> {/* Replace name with the user's name */}
                </div>
                <div class='data'>
                    <label for='email'>email:</label>
                    <p name='email'>email</p> {/* Replace email with the user's email */}
                </div>
                <div class='data'>
                    <label for='email'>password:</label>
                    <p name='email'>********</p> {/* DO NOT REPLACE */}
                </div>
            </div>        
        </div>
      </div>
      <div class='edit_data'> {/* HIDE THIS DIV BY DEFAULT,, SHOW WHEN EDIT ICON CLICKED */}
            <h2 class='edit_personal_data'>edit personal data</h2>
            <div class='all_data'>
                <div class='data'>
                    <label for='name_edit'>name:</label>
                    <input name='name_edit' type='text' placeholder='name'/>  {/* Replace placeholder value with the user's name, will be used to editing*/}
                </div>
                <div class='data'>
                    <label for='email_edit'>email:</label>
                    <input type='email_edit' name='email' placeholder='email'/>  {/* Replace placeholder value with the user's name, will be used to editing*/}
                </div>
                <div class='data'>
                    <label for='pass_edit'>password:</label>
                    <input type='password' name='pass_edit' placeholder='********'/> {/*u know what to do */}
                </div>
            </div>
            <input type='submit' value='save changes'></input>
      </div>

        <div class='user_section'>
            <div class='above_line'>
                <h2 class='section_name' id='settings'>settings</h2>
                <button class='edit_icon' id='edit_awards'><img src={editIcon} alt='edit'></img></button>
            </div>
            <hr class='devide_line'></hr>

        </div>
    </div>
  );
}

export default User;