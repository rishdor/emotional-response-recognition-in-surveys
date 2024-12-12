import React from 'react';
import { Link } from 'react-router-dom';
import '../css/User.css';
import '../css/Dashboard.css';
import '../css/App.css';
import editIcon from '../images/icons8-edit-64.png';
import userIcon from '../images/icons8-user-64.png';
import CountriesSelect from './CountriesSelect';


function User() {
    const handleLogout = () => {
        document.cookie = "user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.assign("/");
      }
  return (
    <div className="User">
        <nav>
            <ul class='navbar'>
              <li onClick={handleLogout} style={{ cursor: "pointer" }}>sign out</li> 
              <li><Link to="/about" class='link'>about</Link></li>
              <li><Link to="/user" class='link'>user</Link></li>
              <li><Link to="/dashboard" class='link'>dashboard</Link></li>
            </ul>
          </nav>
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
                    <form class='edit_data'> {/* HIDE THIS DIV BY DEFAULT, SHOW WHEN EDIT ICON CLICKED */}
                        <h2 class='edit_personal_data'>edit personal data</h2>
                        <div class='all_user_data'>
                            <div class='data'>
                                <label for='name_edit'>name:</label>
                                <input name='name_edit' type='text' placeholder='name'/>  {/* Replace placeholder value with the user's name*/}
                            </div>
                            <div class='data'>
                                <label for='email_edit'>email:</label>
                                <input type='email_edit' name='email' placeholder='email'/>  {/* Replace placeholder value with the user's email*/}
                            </div>
                            <div class='data'>
                            <label for="country">country:</label>
                                <CountriesSelect /> {/*idk what to do with this one: has to be discussed, probably same this as with the gender*/}
                            </div>

                            <div class='data'>
                                <label for="city">city:</label>
                                <input type="text" name='city' placeholder='city' />
                            </div>

                            <div class='data'>
                                <label for="job_position">job position:</label>
                                <input type="text" name='job_position' placeholder='job position' />
                            </div>

                            <div class='data'>
                                <label for="education_level">education level:</label>
                                <select name="education" id="education">
                                    <option value="">select your education level</option>
                                    <option value="highschool">High School</option>
                                    <option value="associates">Associate's Degree</option>
                                    <option value="bachelors">Bachelor's Degree</option>
                                    <option value="masters">Master's Degree</option>
                                    <option value="doctorate">Doctorate</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div class='data'>
                                <label for="birth">date of birth:</label>
                                <input type="date" name='birth' placeholder='date of birth' />
                            </div>  {/* Replace placeholder value with the user's name, will be used to editing*/}

                            <div class='data'>
                                <label for="gerder">gender:</label>
                                <select name="gender" id="gender">  {/* no placeholder, since it won't work. displayed value has to be the one from database*/}
                                    <option value="">select your gender</option>
                                    <option value="F">female</option>
                                    <option value="M">male</option>
                                    <option value="O">other</option>
                                    <option value="N">prefer not to say</option>
                                </select>
                            </div>
                        </div>
                        <input type='submit' value='save changes'></input>  {/* has to uncheck the checkbox edit_icon_checkbox from line 25*/}
                    </form>  
                </div>  
            </div>
        </div>
        <hr class='devide_line'></hr>
        <div class='data_container'>
            <div class='user_photo'>
                <img src={userIcon} alt='user'/>
            </div>
            <div class='all_user_data'>
                <div class='data'>
                    <label for='name'>name:</label>
                    <p name='name'>name</p> {/* Replace name with the user's name */}
                </div>
                <div class='data'>
                    <label for='email'>email:</label>
                    <p name='email'>email</p> {/* Replace email with the user's email */}
                </div>
                <div class='data'>
                    <label for='counrty'>country:</label>
                    <p name='counrty'>counrty</p> {/* Replace name with the user's country */}
                </div>
                <div class='data'>
                    <label for='city'>city:</label>
                    <p name='city'>city</p> {/* Replace name with the user's city */}
                </div>
                <div class='data'>
                    <label for='job position'>job position:</label>
                    <p name='job position'>job position</p> {/* Replace name with the user's job position */}
                </div>
                <div class='data'>
                    <label for='education_level'>education level:</label>
                    <p name='education_level'>education level</p> {/* Replace name with the user's education level */}
                </div>
                <div class='data'>
                    <label for='birth'>date of birth:</label>
                    <p name='birth'>date of birth</p> {/* Replace name with the user's birth date */}
                </div>
                <div class='data'>
                    <label for='gender'>gender:</label>
                    <p name='gender'>gender</p> {/* Replace name with the user's gender */}
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
                    <input type='checkbox' id='edit_pass_chechbox' class='edit_pass_checkbox'/>
                    <label for='edit_pass_chechbox' class='change_pass_label'>change password</label>
                    {/* EDIT WINDOW */}
                    <div class='edit_container_password'>
                        <div class='edit_data'> {/* HIDE THIS DIV BY DEFAULT, SHOW WHEN EDIT ICON CLICKED */}
                            <h2 class='edit_personal_data'>change password</h2>
                            <div class='all_data'>
                                <div class='data'>
                                    <label for='pass_edit1'> old password:</label>
                                    <input type='password' name='pass_edit1'/> {/*u know what to do */}
                                </div>
                                <div class='data'>
                                    <label for='pass_edit2'>new password:</label>
                                    <input type='password' name='pass_edit2'/> {/*u know what to do */}
                                </div>
                                <div class='data'>
                                    <label for='pass_edit3'>repeat new password:</label>
                                    <input type='password' name='pass_edit3'/> {/*u know what to do */}
                                </div>
                            </div>
                            <input type='submit' value='save changes'></input> {/* has to uncheck the checkbox edit_pass_chechbox from line 132*/}
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
            <p for='delete_acc'>Once you delete your account, there is no going back. Please be certain.</p>
                <div class='delete_account'>
                    <input type='submit' id='delete_acc' value='delete account'/>
                </div>
            </div>
        </div>

    </div>
  );
}

export default User;