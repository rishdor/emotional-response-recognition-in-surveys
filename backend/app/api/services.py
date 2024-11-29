from sqlalchemy.orm import Session
from database.user import User
from fastapi import HTTPException, status
from database.schemas import UserLogin

def login_user(db: Session, user: UserLogin):
    user_db = db.query(User).filter(User.email == user.email).first()

    if user_db is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    if user.password!= user_db.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    return {"message":"Login successful", "user": user.email}