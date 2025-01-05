import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../css/SurveyWindow.css';
import '../css/Dashboard.css';
import '../css/App.css';
import logo from '../images/photos/logo_surveys3.png';

function SurveyQuestions() {
  const [questions, setQuestions] = useState([]);
  const location = useLocation();
  const { survey } = location.state || {};

  useEffect(() => {
    console.log("Survey object in SurveyQuestions:", survey);

    const fetchQuestions = async () => {
      if (!survey || !survey.survey_id) {
        console.error("Survey data is missing or invalid");
        return;
      }

      try {
        console.log(`Fetching questions for survey ID: ${survey.survey_id}`);
        const response = await fetch(`http://localhost:8000/surveys/${survey.survey_id}/questions`);
        if (response.ok) {
          const questionsData = await response.json();
          console.log("Fetched questions:", questionsData);

          // Fetch answers for each question
          const questionsWithAnswers = await Promise.all(
            questionsData.map(async (question) => {
              const answersResponse = await fetch(`http://localhost:8000/questions/${question.question_id}/answers`);
              if (answersResponse.ok) {
                const answersData = await answersResponse.json();
                return { ...question, answers: answersData };
              } else {
                console.error("Failed to fetch answers:", answersResponse.statusText);
                return { ...question, answers: [] };
              }
            })
          );

          setQuestions(questionsWithAnswers);
        } else {
          console.error("Failed to fetch questions:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    if (survey) {
      fetchQuestions();
    } else {
      console.error("Survey object is missing");
    }
  }, [survey]);

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

  return (
    <div className="SurveyQuestions">
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
        
      <div class='stop_button_container'>
        <Link to="/surveys" class='link'><button class='stop_button'>Stop survey</button></Link>
      </div>
      {questions.map((question, index) => (
        <div className="question_container" key={index}>
          <h3>Question {index + 1}</h3>
          <hr className="question_underline" />
          <div className="question">
            <p>{question.question_text}</p>
            {question.question_type === 'multiple choice' && (
              <div className="multiple_choice">
                {question.answers.map((answer, idx) => (
                  <div className="answer" key={idx}>
                    <input type="checkbox" id={`answer_checkbox${idx}`} name={`answer_checkbox${index}`} value={answer.answer_value} />
                    <label htmlFor={`answer_checkbox${idx}`}>{answer.answer_value}</label>
                  </div>
                ))}
              </div>
            )}
            {question.question_type === 'yes/no' && (
              <div className="singular_choice">
                <div className="answer">
                  <input type="radio" id={`answer_radio_yes${index}`} name={`answer_radio${index}`} value="yes" />
                  <label htmlFor={`answer_radio_yes${index}`}>Yes</label>
                </div>
                <div className="answer">
                  <input type="radio" id={`answer_radio_no${index}`} name={`answer_radio${index}`} value="no" />
                  <label htmlFor={`answer_radio_no${index}`}>No</label>
                </div>
              </div>
            )}
            {question.question_type === 'number' && (
              <div className="number_input">
                <input type="number" id={`answer_number${index}`} name={`answer_number${index}`} />
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="finish">
        <input type="submit" value="next question" />
      </div>

      <div className="finish">
        <Link to="/thankyou" className="link"><input type="submit" value="finish survey" /></Link>
      </div>
    </div>
  );
}

export default SurveyQuestions;