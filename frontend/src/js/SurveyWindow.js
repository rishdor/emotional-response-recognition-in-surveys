import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../css/SurveyWindow.css';
import arrowIcon from '../images/icons8-arrow-left-96.png';
import '../css/App.css';
import logo from '../images/photos/logo_surveys3.png';

function SurveyWindow() {
  const location = useLocation();
  const navigate = useNavigate();
  const { survey } = location.state || {};
  const userId = localStorage.getItem('userId');
  // camera access
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  const startStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraAllowed(true);
      setStream(mediaStream);

      const setVideoStream = () => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream; 
        } else {
          console.log('Video element not available yet. Retrying...');
          setTimeout(setVideoStream, 100); 
        }
      };

      setVideoStream();
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  // Request media stream on component mount
  useEffect(() => {
    startStream();

    // Cleanup the stream on component unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());  // Stop all tracks
        setStream(null);  // Clear the stream
      }
    };
  }, []); 

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

  const handleStartClick = () => {
    console.log("Navigating to survey questions with survey:", survey);
    navigate('/surveyquestions', { state: { survey, userId } });
  };

  console.log("Survey object in SurveyWindow:", survey);

  return (
    <div className="SurveyWindow">
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
      <div class='fix_nav_position'/>
      <div className="video_container">
        <h2>View from the webcam</h2>

        {cameraAllowed && videoRef ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
          />
          // <div>
          //   <h1>Podgląd z serwera</h1>
          //   <img src="http://localhost:8000/video_feed" alt="stream" />
          // </div>
        ) : (
          <p style={{ color: 'red' }}>
            {errorMessage || "The user did not consent to the use of the webcam."}
          </p>
        )}
      </div>
      <div className="go_to_questions_container">
        {cameraAllowed ? (
          // todo : added good alignment
          <div style={{ textAlign: 'center' }}> 
            <h3>Go to questions!</h3>
            <button onClick={handleStartClick} className="link" id="go_to_questions">
              <img src={arrowIcon} alt="mail" />
            </button>
          </div>
        ) : (
          <p style={{ color: 'red' }}>
            {errorMessage || ""}
          </p>
        )}
      </div>
    </div>
  );
}

export default SurveyWindow;