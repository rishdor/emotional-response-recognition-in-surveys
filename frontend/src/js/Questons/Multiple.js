import React from 'react';


    const Multiple = () => {    //idk, u know what to put inside the parentheses
    return (
        <div class="question_container">
        <h3>Question 2</h3> {/*Replace with question number */}
        <hr class='question_underline'/>
        <div class="question">
            <p>question</p> {/*Replace with question */}
            <div class="multiple_choice">
                <div class="answer">
                    <input type="checkbox" id="answer_checkboxA" name="answer_checkbox" value="A"/>   {/*Replace value with answer value */}
                    <label for="answer_checkboxA">A answer</label>   {/*Replace with answer */}
                </div>
                <div class="answer">
                    <input type="checkbox" id="answer_checkboxB" name="answer_checkbox" value="B"/>   {/*Replace value with answer value */}
                    <label for="answer_checkboxB">B answer</label>   {/*Replace with answer */}
                </div>
            </div>
        </div>
      </div>
      
    );
}

export default Multiple;