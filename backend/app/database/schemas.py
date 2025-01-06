from pydantic import BaseModel
from datetime import date
from typing import Optional

class UserCreate(BaseModel):
    email: str
    first_name: str
    last_name: str
    password: str
    city: str
    country: str
    job_position: str
    education_level: str
    date_of_birth: date
    gender: str

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[str] = None 
    city: Optional[str] = None
    country: Optional[str] = None
    job_position: Optional[str] = None
    education_level: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None

    class Config:
        from_attributes = True
    
class UserLogin(BaseModel):
    email: str
    password: str

    class Config:
        from_attributes = True

class EmailCheckRequest(BaseModel):
    email: str

    class Config:
        from_attributes = True

class PasswordVerificationRequest(BaseModel):
    password: str

class PasswordChangeRequest(BaseModel):
    new_password: str