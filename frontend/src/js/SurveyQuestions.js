import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import '../css/SurveyWindow.css';
import '../css/Dashboard.css';
import '../css/App.css';
import logo from '../images/photos/logo_surveys3.png';

function SurveyQuestions() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { survey } = location.state || {};
  const userId = localStorage.getItem('userId');

  const updateSurveyState = useCallback(async (state) => {
    try {
      await fetch(`http://localhost:8000/user_survey_completion/${userId}/${survey.survey_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ survey_state: state }),
      });
    } catch (error) {
      console.error("Error updating survey state:", error);
    }
  }, [userId, survey.survey_id]);

  useEffect(() => {
    const fetchSurveyState = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user_survey_completion/${userId}/${survey.survey_id}`);
        if (response.ok) {
          const surveyState = await response.json();
          if (surveyState.survey_state === 'not_started') {
            await updateSurveyState('started');
          } else if (surveyState.survey_state === 'started') {
            const lastAnsweredQuestionResponse = await fetch(`http://localhost:8000/user_survey_answers/last_answered/${userId}/${survey.survey_id}`);
            if (lastAnsweredQuestionResponse.ok) {
              const lastAnsweredQuestion = await lastAnsweredQuestionResponse.json();
              setCurrentQuestionIndex(lastAnsweredQuestion.question_id + 1);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching survey state:", error);
      }
    };

    const fetchQuestions = async () => {
      if (!survey || !survey.survey_id) {
        console.error("Survey data is missing or invalid");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/surveys/${survey.survey_id}/questions`);
        if (response.ok) {
          const questionsData = await response.json();
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
      fetchSurveyState();
      fetchQuestions();
    } else {
      console.error("Survey object is missing");
    }
  }, [survey, userId, updateSurveyState]);

  useEffect(() => {
    setSelectedAnswer(null);
    const inputs = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    inputs.forEach(input => input.checked = false);
  }, [currentQuestionIndex]);

  const saveAnswer = async (questionId, answerIds) => {
    try {
      if (Array.isArray(answerIds)) {
        for (const answerId of answerIds) {
          await fetch(`http://localhost:8000/user_survey_answers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId,
              survey_id: survey.survey_id,
              question_id: questionId,
              answer_id: parseInt(answerId, 10),
            }),
          });
        }
      } else {
        await fetch(`http://localhost:8000/user_survey_answers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            survey_id: survey.survey_id,
            question_id: questionId,
            answer_id: parseInt(answerIds, 10),
          }),
        });
      }
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

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

  const handleAnswerChange = (event) => {
    const { type, value, checked } = event.target;
    if (type === 'checkbox') {
      setSelectedAnswer((prev) => {
        if (checked) {
          return [...(prev || []), value];
        } else {
          return (prev || []).filter((answer) => answer !== value);
        }
      });
    } else {
      setSelectedAnswer(value);
    }
  };

  const handleNextQuestion = async () => {
    if (selectedAnswer) {
      await saveAnswer(questions[currentQuestionIndex].question_id, selectedAnswer);
      setSelectedAnswer(null);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("Please select an answer before proceeding.");
    }
  };

  const handleFinishSurvey = async () => {
    if (selectedAnswer) {
      await saveAnswer(questions[currentQuestionIndex].question_id, selectedAnswer);
      await updateSurveyState('completed');
      navigate('/thankyou', { state: { userId } });
    } else {
      alert("Please select an answer before finishing the survey.");
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="SurveyQuestions">
      <nav>
        <ul className='navbar'>
          <div className='nav_side'>
            <li onClick={logout} style={{ cursor: "pointer" }}>Sign out</li> 
            <li><Link to="/about" className='link'>About</Link></li>
            <li><Link to="/contact" className='link'>Contact</Link></li>
          </div>
          <li><img src={logo} alt='logo'/></li>
          <div className='nav_side'>
            <li><Link to="/user" className='link'>User</Link></li>
            <li><Link to="/dashboard" className='link'>Dashboard</Link></li>
            <li><Link to="/surveys" className='link'>Surveys</Link></li>
          </div>
        </ul>
      </nav>
      <div className='fix_nav_position'/>
        
      <div className='stop_button_container'>
        <Link to="/surveys" className='link'><button className='stop_button'>Stop survey</button></Link>
      </div>
      {currentQuestion && (
        <div className="question_container">
          <h3>Question {currentQuestionIndex + 1} / {questions.length}</h3>
          <hr className="question_underline" />
          <div className="question">
            <p>{currentQuestion.question_text}</p>
            {currentQuestion.question_type === 'multiple choice' && (
              <div className="multiple_choice">
                {currentQuestion.answers.map((answer, idx) => (
                  <div className="answer" key={idx}>
                    <input
                      type="checkbox"
                      id={`answer_checkbox${idx}`}
                      name={`answer_checkbox${currentQuestionIndex}`}
                      value={answer.answer_id}
                      onChange={handleAnswerChange}
                    />
                    <label htmlFor={`answer_checkbox${idx}`}>{answer.answer_value}</label>
                  </div>
                ))}
              </div>
            )}
            {currentQuestion.question_type === 'single choice' && (
              <div className="single_choice">
                {currentQuestion.answers.map((answer, idx) => (
                  <div className="answer" key={idx}>
                    <input
                      type="radio"
                      id={`answer_radio${idx}`}
                      name={`answer_radio${currentQuestionIndex}`}
                      value={answer.answer_id}
                      onChange={handleAnswerChange}
                    />
                    <label htmlFor={`answer_radio${idx}`}>{answer.answer_value}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="finish">
        {currentQuestionIndex < questions.length - 1 ? (
          <input type="submit" value="Next question" onClick={handleNextQuestion} />
        ) : (
          <input type="submit" value="Finish survey" onClick={handleFinishSurvey} />
        )}
      </div>
    </div>
  );
}

export default SurveyQuestions;