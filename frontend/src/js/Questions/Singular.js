import React from 'react';


    const Singular = () => {  //idk, u know what to put inside the parentheses
    return (
        <div class="singular_choice">
            <div class="answer">
                <input type="radio" id="answer_radioA" name="answer_radio" value="A"/>  {/*Replace value with answer value */}
                <label for="answer_radioA">A answer</label>   {/*Replace with answer */}
            </div>
            <div class="answer">
                <input type="radio" id="answer_radioB" name="answer_radio" value="B"/>  {/*Replace value with answer value */}
                <label for="answer_radioB">B answer</label>   {/*Replace with answer */}
            </div>
        </div>
    );
}

export default Singular;