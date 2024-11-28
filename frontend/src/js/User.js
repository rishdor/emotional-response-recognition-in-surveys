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
            <li><a href="#change_password">change password</a></li>
            <li><a href="#del_account">delete account</a></li>
        </ul>
      </div>

      <div class='user_section'>
        <div class='above_line'>
            <h2 class='section_name' id='personal_data'>personal data</h2>
            <div  class='edit_icon'>  {/*EDIT ICON */}
                <input type='checkbox' id='edit_icon_checkbox' class='edit_icon_checkbox'/>
                <label for='edit_icon_checkbox' class='edit_icon_label'>
                    <img src={editIcon} alt='edit' class='edit_icon_img'/>
                </label>
                {/* EDIT WINDOW */}
                <div class='edit_container'>
                    <div class='edit_data'> {/* HIDE THIS DIV BY DEFAULT, SHOW WHEN EDIT ICON CLICKED */}
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
                        </div>
                        <input type='submit' value='save changes'></input>
                    </div>  
                </div>  
            </div>
        </div>
        <hr class='devide_line'></hr>
        <div class='data_container'>
            <div class='user_photo'>
                <img src={userIcon} alt='user'/>
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
            </div>        
        </div>
      </div>

      <div class='user_section'>    {/*CHANGE PASSWORD*/}
            <div class='above_line'>
                <h2 class='section_name' id='change_password'>change password</h2>
            </div>
            <hr class='devide_line'></hr>
            <div class='all_data'>
            <p class='change_pass_info'>Do this at least twice a year to keep your data save.</p>
                <div class='delete_account'>
                    <input type='checkbox' id='change_pass' class='edit_icon_checkbox'/>
                    <label for='change_pass' class='change_pass_label'>change password</label>
                    {/* EDIT WINDOW */}
                    <div class='edit_container_password'>
                        <div class='edit_data'> {/* HIDE THIS DIV BY DEFAULT, SHOW WHEN EDIT ICON CLICKED */}
                            <h2 class='edit_personal_data'>change password</h2>
                            <div class='all_data'>
                                <div class='data'>
                                    <label for='pass_edit'>password:</label>
                                    <input type='password' name='pass_edit' placeholder='********'/> {/*u know what to do */}
                                </div>
                            </div>
                            <input type='submit' value='save changes'></input>
                        </div>  
                    </div>  
                </div>
            </div>
        </div>
        <div class='user_section'>
            <div class='above_line'>
                <h2 class='section_name' id='del_account'>delete account</h2>
            </div>
            <hr class='devide_line'></hr>
            <div class='all_data'>
                <div class='delete_account'>
                    <label for='delete_acc'>Once you delete your account, there is no going back. Please be certain.</label>
                    <input type='submit' id='delete_acc' value='delete account'/>
                </div>
            </div>
        </div>

    </div>
  );
}

export default User;