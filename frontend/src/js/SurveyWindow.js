import React from 'react';
import '../css/SurveyWindow.css';
import arrowIcon from '../images/icons8-arrow-left-96.png';

function SurveyWindow() {
  return (
    <div className="SurveyWindow">
      <div className="video_container">
      <button><img src={arrowIcon} alt='mail'></img></button> {/*Previous questoion button */}
      <iframe
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="working on rick roll"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
      <button><img src={arrowIcon} alt='mail' id='right'></img></button>  {/*Next questoion button */}
    </div>

    <div class="question_container">
        <h3>Question 1</h3>
        <div class="question">
            <p>question</p> {/*Replace with question */}
            <div class="all_answers">
                <div class="answer">
                    <input type="radio" id="answerA" name="answer" value="A"/>
                    <label for="answerA">A answer</label>   {/*Replace with answer */}
                </div>
                <div class="answer">
                    <input type="radio" id="answerB" name="answer" value="B"/>
                    <label for="answerB">B answer</label>   {/*Replace with answer */}
                </div>
                <div class="answer">
                    <input type="radio" id="answerC" name="answer" value="C"/>
                    <label for="answerC">C answer</label>   {/*Replace with answer */}
                </div>
                <div class="answer">
                    <input type="radio" id="answerD" name="answer" value="D"/>
                    <label for="answerD">D answer</label>   {/*Replace with answer */}
                </div>
            </div>
        </div>
    </div>
    </div>
  );
}

export default SurveyWindow;