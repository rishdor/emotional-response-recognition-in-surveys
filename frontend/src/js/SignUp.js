import React, { useState } from 'react';
import '../css/SignForm.css';
import CountriesSelect from './CountriesSelect';
import { Link, useNavigate } from 'react-router-dom';
import '../css/App.css';
import axios from 'axios';

function SignUp({ onAuthenticationSuccess }) {
  let debounceTimeout;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    city: '',
    job_position: '',
    date_of_birth: '',
    gender: '',
    password: '',
    re_password: '',  })
  const [country, setCountry] = useState('');
  const [education_level, setEducationLevel] = useState('');
  const [rodo, setRodo] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user_data = {
      ...formData,
      country,
      education_level,
    };

    try {
      await axios.post('http://localhost:8000/signup',
         user_data,
        { withCredentials: true});
        onAuthenticationSuccess();
        navigate('/dashboard');
    }
    catch (error) {
      console.log(error.response.data.detail);
    }
  };

  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    city: '',
    job_position: '',
    education_level: '',
    date_of_birth: '',
    gender: '',
    password: '',
    re_password: '',
    rodo: false,
  });

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

  const debounceCheckEmailExists = (email) => {
    return new Promise((resolve) => {
      clearTimeout(debounceTimeout);

      debounceTimeout = setTimeout(async () => {
        const error = await checkEmailExists(email);
        resolve(error);
      }, 500); 
    });
  };
  
  const validate = async (name, value) => {
    let error = '';
    switch(name) {
      case 'first_name':
        if (!value.trim()) error = 'This field is required';
        break;

      case 'last_name':
        if (!value.trim()) error = 'This field is required';
        break;

      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Please enter a valid email';
        else error = await debounceCheckEmailExists(value);
        break;

      case 'country':
        if (!value.trim()) error = 'This field is required';
        break;

      case 'city':
        if (!value.trim()) error = 'This field is required';
        break;

      case 'job_position':
        if (!value.trim()) error = 'This field is required';
        break;

      case 'education_level':
        if (!value.trim()) error = 'This field is required';
        break;

      case 'date_of_birth':
        const dob = new Date(value);
        const age = new Date().getFullYear() - dob.getFullYear();
    
        if (!value.trim()) {
            error = 'A date of birth is required';
        } 
        else if (isNaN(dob.getTime())) {
            error = 'Invalid date format';
        } 
        else if (dob.getFullYear() < 1900 || dob > new Date()) {
            error = 'Date of birth must be a realistic value';
        } 
        else if (age < 18) {
            error = 'You must be at least 18 years old';
        }
        break;
      
      case 'gender':
        if (!value) error = 'Please select a gender';
        break;
      
      case 'password':
        if (!value.trim()) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        break;
      
      case 're_password':
        if (value !== formData.password) error = 'Passwords do not match';
        break;
      
      case 'rodo':
        if (!value) error = "You must accept the terms and conditions";
        break;

      default:
        break;
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
  
      validate(name, value, updatedData);
      
      if (name === 'password' || name === 're_password') {
        if (updatedData.password !== updatedData.re_password) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            re_password: 'Passwords do not match',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            re_password: '',
          }));
        }
      }
  
      return updatedData;
    });
  };
  
  const handleCountryChange = (value) => {
    setCountry(value);
    validate('country', value);
  };
  
  const handleRodoChange = (e) => {
    const value = e.target.checked;
    setRodo(value);
    validate('rodo', value); 
  };

  const handleEducationLevelChange = (e) => {
    const value = e.target.value;
    setEducationLevel(value);
    validate('education_level', value);
  }
  
  const isFormValid = Object.values(errors).every((error) => error === '') &&
    Object.values(formData).every((value) => value !== '' && value !== false) &&
    rodo; 

  return (
    <div className="SignUp">
      <nav>
            <ul class='navbar'>
              <li><Link to="/signUp" class='link'>sign up</Link></li> {/*Visible only when user not signed in*/}
              <li><Link to="/signIn" class='link'>sign in</Link></li> {/*Visible only when user not signed in*/}
              <li><Link to="/" class='link'>SmartSurveys</Link></li>
              <li><Link to="/about" class='link'>about</Link></li>
            </ul>
          </nav>
      <h1>Sign Up</h1>

      {/* Sign-up Form */}
      <form class='signForm' onSubmit={handleSubmit}>

        {/* First Name */}
        <div class='formElem'>
          <label for="name">first name:</label>
          <input type="text" 
          name='first_name'
          value={formData.first_name}
          onChange={handleChange} />
        </div>
        {errors.first_name && <div style={{ color: 'red', fontSize: 12 }}>{errors.first_name}</div>}
        
        {/* Last Name */}
        <div class='formElem'>
          <label for="name">last name:</label>
          <input type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange} />
        </div>
        {errors.last_name && <div style={{ color: 'red', fontSize: 12 }}>{errors.last_name}</div>}

        {/* Email */}
        <div class='formElem'>
          <label for="email">email:</label>
          <input type="email"
          name="email"
          value={formData.email}
          onChange={handleChange} 
          />
        </div>
        {errors.email && <div style={{ color: 'red', fontSize: 12 }}>{errors.email}</div>}

        {/* Country */}
        <div class='formElem'>
          <label for="country">country:</label>
          <CountriesSelect 
          country={country}
          setCountry={handleCountryChange}/>
        </div>
        {errors.country && <div style={{ color: 'red', fontSize: 12 }}>{errors.country}</div>}

        {/* City */}
        <div class='formElem'>
          <label for="city">city:</label>
          <input type="text"
          name="city"
          value={formData.city}
          onChange={handleChange} />
        </div>
        {errors.city && <div style={{ color: 'red', fontSize: 12 }}>{errors.city}</div>}

        {/* Job Position */}
        <div class='formElem'>
          <label for="job_position">job position:</label>
          <input type="text"
          name="job_position"
          value={formData.job_position}
          onChange={handleChange} />
        </div>
        {errors.job_position && <div style={{ color: 'red', fontSize: 12 }}>{errors.job_position}</div>}

        {/* Education Level */}
        <div class='formElem'>
          <label for="education_level">education level:</label>
          <select name="education"
          education_level={education_level}
          onChange={handleEducationLevelChange}>
            <option value="">select your education level</option>
            <option value="highschool">High School</option>
            <option value="associates">Associate's Degree</option>
            <option value="bachelors">Bachelor's Degree</option>
            <option value="masters">Master's Degree</option>
            <option value="doctorate">Doctorate</option>
            <option value="other">Other</option>
          </select>
        </div>
        {errors.education_level && <div style={{ color: 'red', fontSize: 12 }}>{errors.education_level}</div>}

        {/* Date Of Birth */}
        <div class='formElem'>
          <label for="birth">date of birth:</label>
          <input type="date" 
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange} />
        </div>
        {errors.date_of_birth && <div style={{ color: 'red', fontSize: 12 }}>{errors.date_of_birth}</div>}

        {/* Gender */}
        <div class='formElem'>
          <label for="gerder">gender:</label>
          <select name="gender"
           value={formData.gender}
           onChange={handleChange} >
            <option value="">select your gender</option>
            <option value="F">female</option>
            <option value="M">male</option>
            <option value="O">other</option>
            <option value="N">prefer not to say</option>
          </select>
        </div>
        {errors.gender && <div style={{ color: 'red', fontSize: 12 }}>{errors.gender}</div>}

        {/* Password */}
        <div class='formElem'>
          <label for="pass">password:</label>
          <input type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}  />
        </div>  
        {errors.password && <div style={{ color: 'red', fontSize: 12 }}>{errors.password}</div>}

        {/* re-Password */}
        <div class='formElem'>
          <label for="repPass">repeat password:</label>
          <input type="password"
          name="re_password"
          value={formData.re_password}
          onChange={handleChange}  />
        </div>
        {errors.re_password && <div style={{ color: 'red', fontSize: 12 }}>{errors.re_password}</div>}

        <div class='formElem'>
          <input type="checkbox" 
          name="rodo"
          checked={formData.rodo}
          onChange={handleRodoChange}
           />
          <label for="rodo">*I confirm being informed about the privacy policy</label>
        </div>
        {errors.rodo && <div style={{ color: 'red', fontSize: 12 }}>{errors.rodo}</div>}

        <div class='formElem'>
          <button type="submit" disabled={!isFormValid}> Submit </button>
        </div>
      </form>
      <footer>
      </footer>
    </div>
  );
}

export default SignUp;