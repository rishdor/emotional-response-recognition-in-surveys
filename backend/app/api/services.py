from sqlalchemy.orm import Session
from database.user import User
from fastapi import HTTPException, status, Response
from database.schemas import UserLogin, UserCreate
from database.crud import create_user
import secrets
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(plain_password: str) -> str:
    """
    Hashes a plaintext password
    """
    return pwd_context.hash(plain_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plaintext password against a hashed password in the db
    """
    return pwd_context.verify(plain_password, hashed_password)

def login_user(db: Session, user: UserLogin, response: Response):
    user_db = db.query(User).filter(User.email == user.email).first()

    if user_db is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    if not verify_password(user.password, user_db.password_hash):
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

    return {"message": "Login successful", "user": user.email}

def signup_user(db: Session, user: UserCreate, response: Response):
    hashed_password = hash_password(user.password)
    user.password_hash = hashed_password
    
    new_user = create_user(db, user)

    if not new_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error creating user"
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

    return {"message": "User created successfully", "user": user.email}
