import '../css/App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './Home';
import About from './About';
import User from './User';
import Dashboard from './Dashboard';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Surveys from './Surveys';
import SurveyWindow from './SurveyWindow';
import ThankYou from './ThankYou';
import SurveyQuestions from './SurveyQuestions';

function App() {
  return (
    <Router>
      <div className="App">
          <Routes>
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/user" element={<User />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/surveys" element={<Surveys />} />
            <Route path="/surveywindow" element={<SurveyWindow />} />
            <Route path="/thankyou" element={<ThankYou />} />
            <Route path='/surveyquestions' element={<SurveyQuestions />} />
          </Routes>
        </div>
    </Router>
  );
}

export default App;