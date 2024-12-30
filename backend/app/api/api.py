from fastapi import FastAPI, Depends, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import NoResultFound
from database.database import get_db
from database.crud import (get_user, delete_user, update_user, 
                           update_user_points, get_user_points_by_id, get_user_data)
from database.schemas import (UserCreate, UserUpdate, UserLogin, EmailCheckRequest,
                               PasswordVerificationRequest, PasswordChangeRequest)
from .services import (login_user, signup_user, verify_token, check_email_exists, 
                       verify_user_password, change_user_password)

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

