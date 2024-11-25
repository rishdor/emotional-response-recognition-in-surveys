import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import '../css/Dashboard.css';
import Surveys from './Surveys';

function Dashboard() {
  return (
    <div className="Dashboard">
      <h1>WELCOME NAME</h1> {/* Replace NAME with the user's name */}
      <div class='sidebar'>
        <ul>
            <li><h3>NAVIGATE</h3></li>
            <li><a href="#surveys">surveys</a></li>
            <li>Item 2</li>
            <li>Item 3</li>
        </ul>
      </div>
      <div class='section'>
        <h2 class='section_name' id='surveys'>surveys</h2>
        <hr class='devide_line'></hr>
        <div class='survey_container'>
            <div class='inner_surveys'>
                <h3>new</h3>
                <p>survey name</p>
                <p>survey name</p>
                <p>survey name</p>
            </div>
            <div class='inner_surveys'>
                <h3>in progress</h3>
                <p>survey name</p>
                <p>survey name</p>
                <p>survey name</p>
            </div>
        </div>
        <Link to="/surveys" class='link'>view more</Link>
      </div>
      
      <Routes>
        <Route path="/surveys" element={<Surveys />} />
      </Routes>
    </div>
  );
}

export default Dashboard;