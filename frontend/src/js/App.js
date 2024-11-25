import '../css/App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Dashboard from './Dashboard';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Surveys from './Surveys';

function App() {
  return (
    <Router>
      <div className="App">
      <nav>
          <ul class='navbar'>
            <li><Link to="/signUp" class='link'>sign up</Link></li>
            <li><Link to="/signIn" class='link'>sign in</Link></li>
            <li><Link to="/" class='link'>home</Link></li>
            <li><Link to="/about" class='link'>about</Link></li>
            <li><Link to="/dashboard" class='link'>dashboard</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/surveys" element={<Surveys />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;