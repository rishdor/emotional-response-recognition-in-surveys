from fastapi import FastAPI, Depends, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import NoResultFound
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
from database.crud import (get_user, delete_user, update_user, 
                           update_user_points, get_user_points_by_id,
                           get_surveys_by_user_id, get_rewards,
                           get_questions_by_survey_id, get_answers_by_question_id)
from database.schemas import UserCreate, UserUpdate, UserLogin, EmailCheckRequest

from .services import login_user, signup_user, verify_token, check_email_exists

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

@app.get("/users/{user_id}", tags=["GetUsersName"])
def read(user_id: int, db = Depends(get_db)):
    user = get_user(db=db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.delete("/delete_user/{user_id}", tags=["DeleteUser"])
def delete(user_id: int, db = Depends(get_db)):
    user = delete_user(db=db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
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
        rewards = get_rewards(db=db)
        return {"rewards": rewards}
    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"Awards for user {user_id} not found.")

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