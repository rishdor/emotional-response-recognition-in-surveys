import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/User.css';
import '../css/Dashboard.css';
import '../css/App.css';
import editIcon from '../images/icons8-edit-64.png';
import userIcon from '../images/icons8-user-64.png';
import CountriesSelect from './CountriesSelect';
import closeIcon from '../images/icons8-close-128.png';
import logo from '../images/photos/logo_surveys3.png';


function User() {
    const logout = async () => {
        try {
          await fetch("http://localhost:8000/logout", {
            method: "POST",
            credentials: "include",
          });
          window.location.assign("/");
        } catch (error) {
          console.error("Logout error:", error);
        }
      };

      const [isCheckedData, setIsCheckedData] = useState(false);
      const [isCheckedPass, setIsCheckedPass] = useState(false);
      const uncheckCheckboxes = () => {
        setIsCheckedData(false); // Uncheck the checkbox for editing personal data
        setIsCheckedPass(false); // Uncheck the checkbox for changing password
      };
  return (
    <div className="User">
        <nav>
            <ul class='navbar'>
              <div class='nav_side'>
                <li onClick={logout} style={{ cursor: "pointer" }}>Sign out</li> 
                <li><Link to="/about" class='link'>About</Link></li>
                <li><Link to="/contact" class='link'>Contact</Link></li>
              </div>
              <li><img src={logo} alt='logo'/></li>
              <div class='nav_side'>
                <li><Link to="/user" class='link'>User</Link></li>
                <li><Link to="/dashboard" class='link'>Dashboard</Link></li>
                <li><Link to="/surveys" class='link'>Surveys</Link></li>
              </div>
            </ul>
        </nav>
        <div class='fix_nav_position'/>
      <h1>WELCOME NAME</h1> {/* Replace NAME with the user's name */}
      <div class='sidebar'>
        <ul>
            <li><h3>NAVIGATE</h3></li>
            <li><a href="#personal_data">Personal data</a></li>
            <li><a href="#change_password">Change password</a></li>
            <li><a href="#del_account">Delete account</a></li>
        </ul>
      </div>

      <div class='user_section'>
        <div class='above_line'>
            <h2 class='section_name' id='personal_data'>Personal data</h2>
            <div  class='edit_icon'>  {/*EDIT ICON */}
                <input type='checkbox' id='edit_icon_checkbox' class='edit_icon_checkbox' checked={isCheckedData} onChange={(e) => setIsCheckedData(e.target.checked)}/>
                <label for='edit_icon_checkbox' class='edit_icon_label'>
                    <img src={editIcon} alt='edit' class='edit_icon_img'/>
                </label>
                {/* EDIT WINDOW */}
                <div class='edit_container'>
                    <form class='edit_data'> {/* HIDE THIS DIV BY DEFAULT, SHOW WHEN EDIT ICON CLICKED */}
                        <h2 class='edit_personal_data'>Edit personal data</h2>
                        <div class='close_user_changes_container'>
                            <button class='close_user_changes' onClick={uncheckCheckboxes}><img src={closeIcon} alt='X'/></button>
                        </div>
                        <div class='all_user_data'>
                            <div class='data'>
                                <label for='name_edit'>Name:</label>
                                <input name='name_edit' type='text' placeholder='name'/>  {/* Replace placeholder value with the user's name*/}
                            </div>
                            <div class='data'>
                                <label for='email_edit'>Email:</label>
                                <input type='email_edit' name='email' placeholder='email'/>  {/* Replace placeholder value with the user's email*/}
                            </div>
                            <div class='data'>
                            <label for="country">Country:</label>
                                <CountriesSelect /> {/*idk what to do with this one: has to be discussed, probably same this as with the gender*/}
                            </div>

                            <div class='data'>
                                <label for="city">City:</label>
                                <input type="text" name='city' placeholder='city' />
                            </div>

                            <div class='data'>
                                <label for="job_position">Job position:</label>
                                <input type="text" name='job_position' placeholder='job position' />
                            </div>

                            <div class='data'>
                                <label for="education_level">Education level:</label>
                                <select name="education" id="education">
                                    <option value="">Select your education level</option>
                                    <option value="highschool">High School</option>
                                    <option value="associates">Associate's Degree</option>
                                    <option value="bachelors">Bachelor's Degree</option>
                                    <option value="masters">Master's Degree</option>
                                    <option value="doctorate">Doctorate</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div class='data'>
                                <label for="birth">Date of birth:</label>
                                <input type="date" name='birth' placeholder='date of birth' />
                            </div>  {/* Replace placeholder value with the user's name, will be used to editing*/}

                            <div class='data'>
                                <label for="gerder">Gender:</label>
                                <select name="gender" id="gender">  {/* no placeholder, since it won't work. displayed value has to be the one from database*/}
                                    <option value="">Select your gender</option>
                                    <option value="F">female</option>
                                    <option value="M">male</option>
                                    <option value="O">other</option>
                                    <option value="N">prefer not to say</option>
                                </select>
                            </div>
                        </div>
                        <input type='submit' value='Save changes' onClick={uncheckCheckboxes}/>  {/* has to uncheck the checkbox edit_icon_checkbox from line 25*/}
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
                    <label for='name'>Name:</label>
                    <p name='name'>name</p> {/* Replace name with the user's name */}
                </div>
                <div class='data'>
                    <label for='email'>Email:</label>
                    <p name='email'>email</p> {/* Replace email with the user's email */}
                </div>
                <div class='data'>
                    <label for='counrty'>Country:</label>
                    <p name='counrty'>counrty</p> {/* Replace name with the user's country */}
                </div>
                <div class='data'>
                    <label for='city'>City:</label>
                    <p name='city'>city</p> {/* Replace name with the user's city */}
                </div>
                <div class='data'>
                    <label for='job position'>Job position:</label>
                    <p name='job position'>job position</p> {/* Replace name with the user's job position */}
                </div>
                <div class='data'>
                    <label for='education_level'>Education level:</label>
                    <p name='education_level'>education level</p> {/* Replace name with the user's education level */}
                </div>
                <div class='data'>
                    <label for='birth'>Date of birth:</label>
                    <p name='birth'>date of birth</p> {/* Replace name with the user's birth date */}
                </div>
                <div class='data'>
                    <label for='gender'>Gender:</label>
                    <p name='gender'>gender</p> {/* Replace name with the user's gender */}
                </div>
            </div>        
        </div>
      </div>

      <div class='user_section'>    {/*CHANGE PASSWORD*/}
            <div class='above_line'>
                <h2 class='section_name' id='change_password'>Change password</h2>
            </div>
            <hr class='devide_line'></hr>
            <div class='all_data'>
            <p class='change_pass_info'>Do this at least twice a year to keep your data save.</p>
                <div class='delete_account'>
                    <input type='checkbox' id='edit_pass_chechbox' class='edit_pass_checkbox' checked={isCheckedPass} onChange={(e) => setIsCheckedPass(e.target.checked)}/>
                    <label for='edit_pass_chechbox' class='change_pass_label'>Change password</label>
                    {/* EDIT WINDOW */}
                    <div class='edit_container_password'>
                        <div class='edit_data'> {/* HIDE THIS DIV BY DEFAULT, SHOW WHEN EDIT ICON CLICKED */}
                            <h2 class='edit_personal_data'>Change password</h2>
                            <div class='close_user_changes_container'>
                                <button class='close_user_changes' onClick={uncheckCheckboxes}><img src={closeIcon} alt='X'/></button>
                            </div>
                            <div class='all_data'>
                                <div class='data'>
                                    <label for='pass_edit1'>Old password:</label>
                                    <input type='password' name='pass_edit1'/> {/*u know what to do */}
                                </div>
                                <div class='data'>
                                    <label for='pass_edit2'>New password:</label>
                                    <input type='password' name='pass_edit2'/> {/*u know what to do */}
                                </div>
                                <div class='data'>
                                    <label for='pass_edit3'>Repeat new password:</label>
                                    <input type='password' name='pass_edit3'/> {/*u know what to do */}
                                </div>
                            </div>
                            <input type='submit' value='save changes' onClick={uncheckCheckboxes}/> {/* has to uncheck the checkbox edit_pass_chechbox from line 132*/}
                        </div>  
                    </div>  
                </div>
            </div>
        </div>
        <div class='user_section'>
            <div class='above_line'>
                <h2 class='section_name' id='del_account'>Delete account</h2>
            </div>
            <hr class='devide_line'></hr>
            <div class='all_data'>
            <p for='delete_acc'>Once you delete your account, there is no going back. Please be certain.</p>
                <div class='delete_account'>
                    <input type='submit' id='delete_acc' value='Delete account'/>
                </div>
            </div>
        </div>
        <footer>
        </footer>
    </div>
  );
}

export default User;