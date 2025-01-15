from fastapi import FastAPI, Depends, HTTPException, Response
from fastapi import FastAPI, Depends, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import NoResultFound
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
from database.crud import (get_user, delete_user, update_user, 
                           update_user_points, get_user_points_by_id, get_user_data,
                           get_surveys_by_user_id, get_rewards, redeem_reward,
                           get_questions_by_survey_id, get_answers_by_question_id,
                           fetch_last_answered_question, save_user_answer, fetch_survey_state, modify_survey_state, 
                           get_videos_for_survey, get_videos_for_question )
from database.schemas import (UserCreate, UserUpdate, UserLogin, EmailCheckRequest,
                               PasswordVerificationRequest, PasswordChangeRequest)
from database.survey_questions import SurveyStateUpdate, UserAnswerCreate
from .services import (login_user, signup_user, verify_token, check_email_exists, 
                       verify_user_password, change_user_password)
import cv2

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

cap = cv2.VideoCapture(0)

def gen_frames():
    while True:
        success, frame = cap.read()
        if not success:
            break
        
        # -- TU wstawiasz kod obróbki: face_mesh, pth_backbone_model, bounding box, itp. --
        # frame = display_EMO_PRED(frame, (startX, startY, endX, endY), label, line_width=3)
        
        # Kodowanie klatki jako JPEG:
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_jpg = buffer.tobytes()
        
        # Zwracamy klatkę w multipart:
        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame_jpg + b'\r\n'
        )
        # ewentualnie time.sleep(0.01) by ograniczyć FPS

@app.get("/video_feed")
def video_feed():
    return Response(gen_frames(), media_type='multipart/x-mixed-replace; boundary=frame')

@app.get("/users/{user_id}", tags=["GetUsersName"])
def read(user_id: int, db = Depends(get_db)):
    user = get_user(db=db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.delete("/delete_user/{user_id}", tags=["DeleteUser"])
def delete(user_id: int, response: Response, db = Depends(get_db),):
    user = delete_user(db=db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    response.delete_cookie(key="access_token")
    return {"status": "success", "message": "User successfully deleted"}

@app.put("/update_user/{user_id}", tags=["UpdateUser"])
def update(user_id: int, user_update: UserUpdate, db = Depends(get_db)):
    user = update_user(db=db, user_id=user_id, user_data=user_update)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "success", "message": "User successfully updated"}
    
@app.post("/signup", tags=["SignUp"])
def create(user: UserCreate, response: Response, db = Depends(get_db)):
    try:
        result = signup_user(db=db, user=user, response=response)
        return result
    except HTTPException as e:
        raise e

@app.post("/signin", tags=["SignIn"])
def sign_in(user_login: UserLogin, response: Response,  db = Depends(get_db)):
    try:
        result = login_user(db=db, user=user_login, response=response)
        return result
    except HTTPException as e:
        raise e
    
@app.get('/user/{user_id}/points', tags=["getUserPoints"])
def get_user_points(user_id: int, db = Depends(get_db)):
    try:
        user_points = get_user_points_by_id(db=db, user_id=user_id)
        return {"points": user_points.points} 

    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"User with id {user_id} not found.")
    
@app.get('/user/{user_id}/update_points', tags=["updateUserPoints"])
def update_user_ponits(user_id: int, points: int, db = Depends(get_db)):
    user_points = update_user_points(user_id=user_id,
                                           points=points, db=db)
    if user_points is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "success", "message": "Points successfully updated."}

@app.get('/verify', tags=["verifyUser"])
async def verify_user(verified_token: dict = Depends(verify_token)):
    return {"message": "User is authenticated", "user_id": verified_token["sub"]}

@app.post('/logout', tags=["logoutUser"])
async def logout_user(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Successfully logged out"}

@app.post("/check-email", tags=["checkEmail"])
async def check_email(email_request: EmailCheckRequest, db = Depends(get_db)):
    return check_email_exists(db, email_request)

@app.get("/users_data/{user_id}", tags=["GetUsersData"])
def read_user_data(user_id: int, db = Depends(get_db)):
    user = get_user_data(db=db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/verify-password/{user_id}", tags=["VerifyPassword"])
async def verify_password(user_id: int, request: PasswordVerificationRequest, db = Depends(get_db)):
    entered_password = request.password
    
    is_valid = verify_user_password(user_id, entered_password, db)
    
    if is_valid:
        return {"message": "Password is correct"}
    else:
        raise HTTPException(status_code=400, detail="Incorrect password")

@app.post("/change-password/{user_id}", tags=["ChangePassword"])
async def change_password(user_id: int, request: PasswordChangeRequest, db = Depends(get_db)):
    is_updated = change_user_password(user_id, request.new_password, db)

    if is_updated:
        return {"message": "Password successfully updated"}
    else:
        raise HTTPException(status_code=500, detail="Failed to update password")

@app.get('/user/{user_id}/surveys', tags=["GetSurveys"])
def get_user_surveys(user_id: int, db = Depends(get_db)):
    try:
        surveys = get_surveys_by_user_id(db=db, user_id=user_id)
        return {"surveys": surveys}
    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"Surveys for user {user_id} not found.")
    
@app.get('/user/{user_id}/rewards', tags=["GetRewards"])
def get_all_rewards(user_id: int, db = Depends(get_db)):
    try:
        rewards = get_rewards(db=db, user_id=user_id)
        return {"rewards": rewards}
    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"Awards for user {user_id} not found.")

@app.post('/user/{user_id}/rewards/{reward_id}/redeem', tags=["RedeemReward"])
def redeem_user_reward(user_id: int, reward_id: int, db = Depends(get_db)):
    result = redeem_reward(db=db, user_id=user_id, reward_id=reward_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User or reward not found")
    elif result == "Not enough points":
        raise HTTPException(status_code=400, detail="Not enough points")
    elif result == "Reward can only be redeemed once a month":
        raise HTTPException(status_code=400, detail="Reward can only be redeemed once a month")
    return {"status": "success", "message": result}


@app.get("/surveys/{survey_id}/questions", tags=["GetSurveyQuestions"])
def get_survey_questions(survey_id: int, db = Depends(get_db)):
    try:
        questions = get_questions_by_survey_id(db=db, survey_id=survey_id)
        return questions
    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"Questions for survey {survey_id} not found.")

@app.get("/questions/{question_id}/answers", tags=["GetQuestionAnswers"])
def get_question_answers(question_id: int, db = Depends(get_db)):
    try:
        answers = get_answers_by_question_id(db=db, question_id=question_id)
        return answers
    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"Answers for question {question_id} not found.")
    
@app.get("/user_survey_completion/{user_id}/{survey_id}", tags=["GetSurveyState"])
def get_survey_state(user_id: int, survey_id: int, db: Session = Depends(get_db)):
    completion = fetch_survey_state(db=db, user_id=user_id, survey_id=survey_id)
    if not completion:
        raise HTTPException(status_code=404, detail="Survey completion not found")
    return completion

@app.put("/user_survey_completion/{user_id}/{survey_id}", tags=["UpdateSurveyState"])
def update_survey_state(user_id: int, survey_id: int, state: SurveyStateUpdate, db: Session = Depends(get_db)):
    completion = modify_survey_state(db=db, user_id=user_id, survey_id=survey_id, state=state.survey_state)
    if not completion:
        raise HTTPException(status_code=404, detail="Survey completion not found")
    return completion

@app.post("/user_survey_answers", tags=["SaveAnswer"])
def save_answer(answer: UserAnswerCreate, db: Session = Depends(get_db)):
    user_answer = save_user_answer(db=db, answer=answer)
    return user_answer

@app.get("/user_survey_answers/last_answered/{user_id}/{survey_id}", tags=["GetLastAnsweredQuestion"])
def get_last_answered_question(user_id: int, survey_id: int, db: Session = Depends(get_db)):
    last_answer = fetch_last_answered_question(db=db, user_id=user_id, survey_id=survey_id)
    if not last_answer:
        raise HTTPException(status_code=404, detail="No answers found for this survey")
    return last_answer

@app.post("/user/{user_id}/surveys/{survey_id}/drop", tags=["DropSurvey"])
def drop_survey(user_id: int, survey_id: int, db: Session = Depends(get_db)):
    completion = modify_survey_state(db=db, user_id=user_id, survey_id=survey_id, state="abandoned")
    if not completion:
        raise HTTPException(status_code=404, detail="Survey completion not found")
    return completion

@app.get("/surveys/{survey_id}/videos", tags=["Videos"])
def get_survey_videos_endpoint(survey_id: int, db: Session = Depends(get_db)):
    """
    Zwraca listę wszystkich wideo przypisanych do ankiety o danym survey_id.
    """
    videos = get_videos_for_survey(db=db, survey_id=survey_id)
    # Możesz sprawdzić, czy videos jest puste:
    if not videos:
        raise HTTPException(status_code=404, detail="No videos found for this survey")
    return {"videos": videos}

@app.get("/questions/{question_id}/videos", tags=["Videos"])
def get_question_videos_endpoint(question_id: int, db: Session = Depends(get_db)):
    """
    Zwraca listę wszystkich wideo przypisanych do pytania o danym question_id.
    """
    videos = get_videos_for_question(db=db, question_id=question_id)
    if not videos:
        raise HTTPException(status_code=404, detail="No videos found for this question")
    return {"videos": videos}
