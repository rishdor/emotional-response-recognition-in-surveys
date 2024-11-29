from sqlalchemy.orm import Session
from database.user import User
from fastapi import HTTPException, status, Response
from database.schemas import UserLogin
import secrets
from datetime import datetime, timedelta, timezone

def login_user(db: Session, user: UserLogin, response: Response):
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
    
    session_token = secrets.token_hex(16)
    
    expires_at = datetime.utcnow().replace(tzinfo=timezone.utc) + timedelta(minutes=30) 
    response.set_cookie(
        key="user_session",
        value=session_token,
        expires=expires_at,
        httponly=False,       
        samesite="Strict",  
    )

    return {"message":"Login successful", "user": user.email}