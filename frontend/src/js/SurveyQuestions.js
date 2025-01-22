import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FaceDetection } from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';

import { useLocation, Link, useNavigate } from 'react-router-dom';
import '../css/SurveyWindow.css';
import '../css/Dashboard.css';
import '../css/App.css';
import logo from '../images/photos/logo_surveys3.png';
import Youtube from 'react-youtube';

function SurveyQuestions() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [faceDetected, setFaceDetected] = useState(null); // face detection
  const location = useLocation();
  const navigate = useNavigate();
  const { survey } = location.state || {};
  const userId = localStorage.getItem('userId');
  const [hasVideoEnded, setHasVideoEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // camera access
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {

    // face detection
    const faceDetection = new FaceDetection({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}` });
    faceDetection.setOptions({
      model: 'short', // or full
      minDetectionConfidence: 0.5,
    });

    const onResults = (results) => {
      if (results.detections && results.detections.length > 0) {
        setFaceDetected(true);
      } else {
        setFaceDetected(false);
      }
    };

    faceDetection.onResults(onResults);

    // camera access
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        setCameraAllowed(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            // Tutaj co klatkę wysyłamy obraz do faceDetection
            await faceDetection.send({ image: videoRef.current });
          },
          width: 1280,
          height: 720,
        });
        camera.start();
      })
      .catch(err => {
        setCameraAllowed(false);
        setErrorMessage(`No camera access or error: ${err.message}. Please turn your webcam on and then try refreshing the page.`);
        console.error("Error when accessing the camera:", err);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (faceDetected) { // Sprawdzanie, czy twarz została wykryta
        const img = captureFrame();
        if (img && currentQuestion?.video_id) {
          try {
            const video_id = currentQuestion.video_id;
            const resp = await fetch(`http://localhost:8000/analyze_video/${userId}/${video_id}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ image: img, userId : userId, video_id : video_id }),
            });
            const data = await resp.json();
            console.log("Emotion response:", data);

          } catch (err) {
            console.error(err);
          }
        }
      }
    }, 1000); 
    return () => clearInterval(interval);
  }, [faceDetected]);
  

  const captureFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const base64Image = canvas.toDataURL("image/png");
    return base64Image;
  };
  
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
  }, [userId, survey?.survey_id]);

  const transformYouTubeUrl = (url) => {
    const match = url.match(/https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  // Return the fetched questions so we can use them immediately
  const fetchQuestions = async () => {
    if (!survey || !survey.survey_id) {
      console.error("Survey data is missing or invalid");
      return [];
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

              // pobieranie listy video
              let videoUrl = null;
              let video_id = null;
              if (question.video === true) {
                const videoResponse = await fetch(`http://localhost:8000/questions/${question.question_id}/videos`);
                if (videoResponse.ok) {
                  const videoData = await videoResponse.json();
                  if (videoData.videos.length > 0) {
                    // videoUrl = videoData.videos[0].video_url;
                    videoUrl = transformYouTubeUrl(videoData.videos[0].video_url);
                    video_id = videoData.videos[0].video_id;
                  }
                }
              }
              console.log("question debug:", question.question_id, question.video, typeof question.video);
              return { ...question, answers: answersData, video_url: videoUrl, video_id : video_id };
            } else {
              console.error("Failed to fetch answers:", answersResponse.statusText);
              return { ...question, answers: [] };
            }
          })
        );
        return questionsWithAnswers;
      } else {
        console.error("Failed to fetch questions:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
    return [];
  };

  useEffect(() => {
    const loadSurveyData = async () => {
      if (!survey || !survey.survey_id) return;

      // 1. Fetch all questions
      const loadedQuestions = await fetchQuestions();
      setQuestions(loadedQuestions);

      // 2. Fetch survey state
      try {
        const response = await fetch(`http://localhost:8000/user_survey_completion/${userId}/${survey.survey_id}`);
        if (response.ok) {
          const surveyState = await response.json();
          if (surveyState.survey_state === 'not_started') {
            await updateSurveyState('started');
            // Start at question 0
            setCurrentQuestionIndex(0);
          } else if (surveyState.survey_state === 'started') {
            // Get the last answered question
            const lastAnsweredResponse = await fetch(`http://localhost:8000/user_survey_answers/last_answered/${userId}/${survey.survey_id}`);
            if (lastAnsweredResponse.ok) {
              const lastAnswered = await lastAnsweredResponse.json();
              // Find index within the newly loaded questions array
              const lastIndex = loadedQuestions.findIndex(q => q.question_id === lastAnswered.question_id);
              // If found, move to the next question. If not, just remain on 0
              if (lastIndex >= 0 && lastIndex < loadedQuestions.length - 1) {
                setCurrentQuestionIndex(lastIndex + 1);
              } else {
                setCurrentQuestionIndex(0);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading survey data:", error);
      }
    };

    loadSurveyData();
  }, [survey, userId, updateSurveyState]);

  useEffect(() => {
    setSelectedAnswer(null);
    const inputs = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    inputs.forEach(input => { input.checked = false; });
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
    console.log(currentQuestion.video);
    if (currentQuestion?.video === true && !hasVideoEnded) {
      alert("Please watch the entire video before proceeding");
    } else if (currentQuestion?.video !== true && !selectedAnswer) {
      alert("Please select an answer before proceeding.");
    } else {
      await saveAnswer(questions[currentQuestionIndex].question_id, selectedAnswer);
      setSelectedAnswer(null);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleFinishSurvey = async () => {
    if (currentQuestion?.video === true && !hasVideoEnded) {
      alert("Please watch the entire video before proceeding");
    } else if (currentQuestion?.video !== true && !selectedAnswer) {
      alert("Please select an answer before proceeding.");
    } else {
      await saveAnswer(questions[currentQuestionIndex].question_id, selectedAnswer);
      await updateSurveyState('completed');
      navigate('/thankyou', { state: { userId } });
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

  const videoOptions = {
    height:"315",
    width:"560",
  };

  const onVideoEnd = () => {
    setHasVideoEnded(true);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (isLoading) {
    return <div class="loading"><h1>Loading, please wait...</h1></div>;
  }

  return (
    <div className="SurveyQuestions">
      <nav>
        <ul className='navbar'>
          <div className='nav_side'>
            <li onClick={logout} style={{ cursor: "pointer" }}>Sign out</li>
            <li><Link to="/about" className='link'>About</Link></li>
            <li><Link to="/contact" className='link'>Contact</Link></li>
          </div>
          <li><Link to="/dashboard" class='link'><img src={logo} alt='logo'/></Link></li>
          <div className='nav_side'>
            <li><Link to="/user" className='link'>User</Link></li>
            <li><Link to="/dashboard" className='link'>Dashboard</Link></li>
            <li><Link to="/surveys" className='link'>Surveys</Link></li>
          </div>
        </ul>
      </nav>
      <div className='fix_nav_position' />

      <video
        ref={videoRef}
        style={{ display: 'none' }}
        width="640"
        height="480"
        playsInline
        muted
      />
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
            {currentQuestion.video === true && currentQuestion.video_url && cameraAllowed && (
              <div className="video_survey">
                <h3>Watch a video while webcamera being on and earn the points!</h3>
                <Youtube
                  videoId={currentQuestion.video_url.split('/')[4]}
                  opts={videoOptions}
                  onEnd={onVideoEnd}
                />
                {!faceDetected ? (
                  <p style={{ color: 'red' }}>
                    {errorMessage || "Please ensure your face is visible in the webcam to continue watching the video. Keep in mind that if your face is not detected, your chance of receiving full points decreases."}
                  </p>
                ) : (
                  <p style={{ color: 'green' }}>
                    Your face is detected. You can continue watching the video!
                  </p>
                )}
              </div>
            )}
            {/* {!faceDetected && (
              <p style={{ color: 'red' }}>
                {errorMessage || "Please ensure your face is visible in the webcam to continue watching the video."}
              </p>
            )} */}
            {!cameraAllowed && (
              <p style={{ color: 'red' }}>
                {errorMessage || "The user did not consent to the use of the webcam."}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="buttons_container">
        <div className='finish'>
          <Link to="/surveys" className='link'><button className='stop_button'>Stop survey</button></Link>
        </div>

        <div className="finish">
          {currentQuestionIndex < questions.length - 1 ? (
            <input type="submit" value="Next question" onClick={handleNextQuestion} />
          ) : (
            <input type="submit" value="Finish survey" onClick={handleFinishSurvey} />
          )}
        </div>
      </div>
    </div>
  );
}

export default SurveyQuestions;