import { React, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/User.css';
import '../css/Dashboard.css';
import '../css/App.css';
import editIcon from '../images/icons8-edit-64.png';
import userIcon from '../images/icons8-user-64.png';
import CountriesSelect from './CountriesSelect';
import closeIcon from '../images/icons8-close-128.png';
import logo from '../images/photos/logo_surveys3.png';

const User = ({ userId }) => {
    const [formData, setFormData] = useState({});
    const [userData, setUserData] = useState({});
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [passwordForm, setPasswordForm] = useState({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    let debounceTimeout;
    
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
      
      useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await fetch(`http://localhost:8000/users_data/${userId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
    
            if (response.ok) {
              const data = await response.json();
              setUserData(data);
              setFormData(data);
            } else {
              throw new Error("Error fetching user name");
            }
          } catch (error) {
            console.error("Error fetching user name:", error);
          } finally {
            setIsLoading(false);
          }
        };
    
        if (userId) {
          fetchUserData();
        }
      }, [userId]);

      const formatDate = (dateString) => {
        if (!dateString) return '';
    
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

      const checkEmailExists = async (email) => {
        try {
          const response = await fetch('http://localhost:8000/check-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          body: JSON.stringify({ email }),
          });
    
          if (response.ok) {
            return '';
          } else {
            const data = await response.json();
            return data.detail;
          }
        } catch (error) {
          return 'Error checking email';
        }
      }
    
      const debounceCheckEmailExists = (email, newErrors, setErrors) => {
        if (email === userData.email) return;

        clearTimeout(debounceTimeout);
      
        debounceTimeout = setTimeout(async () => {
          const error = await checkEmailExists(email);

          if (error) {
            newErrors.email = 'Email already exists';  
          }
      
          setErrors({ ...newErrors });
        }, 500);
      };

      const validate = (formData) => {
        const newErrors = {};
    
        if (!formData.first_name) newErrors.first_name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.job_position) newErrors.job_position = 'Job position is required';
        if (!formData.education_level) newErrors.education_level = 'Education level is required';
        if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';

        return newErrors;
      };


      const handleUpdate = async (e) => {
        e.preventDefault();
        const validationErrors = validate(formData);

        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      
        debounceCheckEmailExists(formData.email, validationErrors, setErrors, (finalErrors) => {
          if (Object.keys(finalErrors).length > 0) {
            setErrors(finalErrors);
            return; 
          }
        });

        try {     
          setIsLoading(true);
          const response = await fetch(`http://localhost:8000/update_user/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
    
          if (response.ok) {
            console.log('User data updated successfully!');
            setUserData(formData);
          } else {
            console.log('Failed to update user data.');
          }
        } catch (err) {
          console.log('An error occurred while updating user data.', err);
        } finally {
          setIsLoading(false);
        }

        setErrors({});   
      }

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };

      const validatePasswordForm = (oldPassword, newPassword, confirmPassword) => {
        if (!oldPassword || !newPassword || !confirmPassword) {
          return "All fields are required.";
        }
    
        if (newPassword !== confirmPassword) {
          return "New passwords do not match.";
        }
    
        if (newPassword === oldPassword) {
          return "New password cannot be the same as the old password.";
        }
    
        return null;
      };

      const verifyOldPassword = async (oldPassword, userId) => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/verify-password/${userId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: oldPassword }),
          });
      
          if (!response.ok) {
            const error = await response.json();
            return error.detail || "Incorrect old password.";
          }
      
          return null;
        } catch (error) {
          console.error("Error:", error);
          return "An error occurred while verifying the old password.";
        }
      };

      const changePassword = async (userId, newPassword) => {
        try {
          const response = await fetch(`http://localhost:8000/change-password/${userId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              new_password: newPassword,
            }),
          });
      
          if (!response.ok) {
            const error = await response.json();
            console.error("Error:", error.detail || error.message);
            return error.detail || "Failed to update the password";
          }
      
          const result = await response.json();
          console.log(result.message);
          return result.message;
        } catch (error) {
          console.error("Error:", error);
          return "An error occurred while updating the password.";
        }
      };

      const handlePasswordChange = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        
        const { oldPassword, newPassword, confirmPassword } = passwordForm;

        const validationError = validatePasswordForm(oldPassword, newPassword, confirmPassword);
        if (validationError) {
          setErrorMessage(validationError);
          return;
        }

        const passwordCheckError = await verifyOldPassword(oldPassword, userId);
        if (passwordCheckError) {
          setErrorMessage(passwordCheckError);
          return;
        }

        const changePasswordError = await changePassword(userId, newPassword);
        if (changePasswordError) {
          setErrorMessage(changePasswordError);
        return;
        }
        
        setErrorMessage("");
        setSuccessMessage("Password successfully updated.");
      };

      /* TODO */
      const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
          /*
          setIsLoading(true);
          try {
            const response = await fetch(`http://localhost:8000/delete_user/${userId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            });
    
            if (!response.ok) {
              const error = await response.json();
              setErrorMessage(error.detail || "Failed to delete the account.");
              setIsLoading(false);
              return;
            }
    
            const result = await response.json();
            setIsLoading(false);
          } catch (error) {
            setIsLoading(false);
            setErrorMessage("An error occurred while deleting the account.");
          }  */
        }
      }
      
  if (isLoading) {
    return <div>Loading...</div>;
  }

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
      <h1>WELCOME { userData.first_name.toUpperCase() }</h1>
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
                    <form class='edit_data' onSubmit={handleUpdate}> {/* HIDE THIS DIV BY DEFAULT, SHOW WHEN EDIT ICON CLICKED */}
                        <h2 class='edit_personal_data'>Edit personal data</h2>
                        <div class='close_user_changes_container'>
                            <button class='close_user_changes' onClick={uncheckCheckboxes}><img src={closeIcon} alt='X'/></button>
                        </div>
                        <div class='all_user_data'>
                            <div class='data'>
                                <label for='first_name'>Name:</label>
                                <input name='first_name' type='text'
                                 value={formData.first_name}
                                 onChange={handleChange} />
                                {errors.first_name && <span style={{ color: 'red', fontSize: 12 }}>{errors.first_name}</span>}
                            </div>
                            <div class='data'>
                                <label for='email_edit'>Email:</label>
                                <input type='email_edit' name='email'
                                 value={formData.email}
                                 onChange={handleChange} />
                                 {errors.email && <span style={{ color: 'red', fontSize: 12 }}>{errors.email}</span>}
                            </div>
                            <div class='data'>
                            <label for="country">Country:</label>
                                <CountriesSelect
                                country={formData.country}
                                setCountry={(value) => setFormData({ ...formData, country: value })} />
                                {errors.country && <span style={{ color: 'red', fontSize: 12 }}>{errors.country}</span>}
                            </div>

                            <div class='data'>
                                <label for="city">City:</label>
                                <input type="text" name='city'
                                 value={formData.city}
                                 onChange={handleChange} />
                                 {errors.city && <span style={{ color: 'red', fontSize: 12 }}>{errors.city}</span>}
                            </div>

                            <div class='data'>
                                <label for="job_position">Job position:</label>
                                <input type="text" name='job_position'
                                 value={formData.job_position}
                                 onChange={handleChange} />
                                 {errors.job_position &&
                                  <span style={{ color: 'red', fontSize: 12 }}>{errors.job_position}</span>}
                            </div>

                            <div class='data'>
                                <label for="education_level">Education level:</label>
                                <select name="education_level" id="education_level"
                                 value={formData.education_level}
                                 onChange={handleChange}>
                                    <option value="">Select your education level</option>
                                    <option value="highschool">High School</option>
                                    <option value="associates">Associate's Degree</option>
                                    <option value="bachelors">Bachelor's Degree</option>
                                    <option value="masters">Master's Degree</option>
                                    <option value="doctorate">Doctorate</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.education_level &&
                                 <span style={{ color: 'red', fontSize: 12 }}>{errors.education_level}</span>}
                            </div>

                            <div class='data'>
                                <label for="birth">Date of birth:</label>
                                <input type="date" name='date_of_birth' 
                                value={formatDate(formData.date_of_birth)}
                                onChange={handleChange} />
                                {errors.date_of_birth && <span style={{ color: 'red', fontSize: 12 }}>{errors.date_of_birth}</span>}
                            </div>

                            <div class='data'>
                                <label for="gerder">Gender:</label>
                                <select name="gender" id="gender"
                                 value={formData.gender}
                                 onChange={handleChange} >
                                    <option value="">Select your gender</option>
                                    <option value="F">female</option>
                                    <option value="M">male</option>
                                    <option value="O">other</option>
                                    <option value="N">prefer not to say</option>
                                </select>
                                {errors.gender && <span style={{ color: 'red', fontSize: 12 }}>{errors.gender}</span>}
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
                    <p name='name'>{userData.first_name}</p>
                </div>
                <div class='data'>
                    <label for='email'>Email:</label>
                    <p name='email'>{userData.email}</p>
                </div>
                <div class='data'>
                    <label for='counrty'>Country:</label>
                    <p name='counrty'>{userData.country}</p>
                </div>
                <div class='data'>
                    <label for='city'>City:</label>
                    <p name='city'>{userData.city}</p>
                </div>
                <div class='data'>
                    <label for='job position'>Job position:</label>
                    <p name='job position'>{userData.job_position}</p>
                </div>
                <div class='data'>
                    <label for='education_level'>Education level:</label>
                    <p name='education_level'>{userData.education_level}</p>
                </div>
                <div class='data'>
                    <label for='birth'>Date of birth:</label>
                    <p name='birth'>{userData.date_of_birth}</p>
                </div>
                <div class='data'>
                    <label for='gender'>Gender:</label>
                    <p name='gender'>{userData.gender}</p>
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
                    <form class='edit_container_password' onSubmit={handlePasswordChange}>
                        <div class='edit_data'> {/* HIDE THIS DIV BY DEFAULT, SHOW WHEN EDIT ICON CLICKED */}
                            <h2 class='edit_personal_data'>Change password</h2>
                            <div class='close_user_changes_container'>
                                <button class='close_user_changes' onClick={uncheckCheckboxes}><img src={closeIcon} alt='X'/></button>
                            </div>
                            <div class='all_data'>
                                <div class='data'>
                                    <label for='oldPassword'>Old password:</label>
                                    <input type='password'
                                    id="oldPassword"
                                    name="oldPassword"
                                    value={passwordForm.oldPassword}
                                    onChange={handleInputChange}/>
                                </div>
                                <div class='data'>
                                    <label for='newPassword'>New password:</label>
                                    <input type='password' 
                                    id="newPassword"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handleInputChange}/>
                                </div>
                                <div class='data'>
                                    <label for='confirmPassword'>Repeat new password:</label>
                                    <input type='password'  
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handleInputChange}/>
                                </div>
                            </div>
                            <input type='submit' value='save changes' onClick={uncheckCheckboxes}/> {/* has to uncheck the checkbox edit_pass_chechbox from line 132*/}
                            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                        </div>  
                    </form>  
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
                    <button onClick={handleDeleteAccount} disabled="true"> Delete Account </button> {/* TODO */}
                </div>
            </div>
        </div>
        <footer>
        </footer>
    </div>
  );
}

export default User;