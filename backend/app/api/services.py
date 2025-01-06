from sqlalchemy.orm import Session
from database.user import User
from fastapi import HTTPException, status, Response, Request
from database.schemas import UserLogin, UserCreate, EmailCheckRequest
from database.crud import create_user
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
import jwt

SECRET_KEY = "secret_key"
ALGORITHM = "HS256"
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
    
    payload = {
        "sub": str(user_db.user_id),
        "exp": datetime.utcnow().replace(tzinfo=timezone.utc) + timedelta(hours=1),
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    response.set_cookie(
        key="access_token",
        value=token,
        expires=payload["exp"],
        httponly=True,
        secure=True,
        samesite="Strict", 
    )

    return {"message": "Login successful"}

def signup_user(db: Session, user: UserCreate, response: Response):
    hashed_password = hash_password(user.password)
    user.password = hashed_password

    new_user = create_user(db, user)

    if not new_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error creating user"
        )

    payload = {
        "sub": str(new_user.user_id),
        "exp": datetime.utcnow().replace(tzinfo=timezone.utc) + timedelta(hours=1),
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    response.set_cookie(
        key="access_token",
        value=token,
        expires=payload["exp"],
        httponly=True,
        secure=True,
        samesite="Strict",
    )

    return {"message": "User created successfully"}

def verify_token(request: Request):
    token = request.cookies.get("access_token")
    if token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.DecodeError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

def check_email_exists(db: Session, email_request: EmailCheckRequest):
    user_db = db.query(User).filter(User.email == email_request.email).first()

    if user_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )
    return {"message": "Email is available"}

def verify_user_password(user_id: int, entered_password: str, db: Session) -> bool:
    user = db.query(User).filter(User.user_id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if pwd_context.verify(entered_password, user.password_hash):
        return True
    else:
        return False
    

def change_user_password(user_id: int, new_password: str, db: Session) -> bool:
    hashed_password = hash_password(new_password)

    user = db.query(User).filter(User.user_id == user_id).first()

    if user:
        user.password_hash = hashed_password
        db.commit()
        db.refresh(user)
        return True

    return False