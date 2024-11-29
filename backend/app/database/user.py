from .database import Base
from sqlalchemy import Column, Integer, Date, String
from sqlalchemy import func

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    city = Column(String, index=True)
    country = Column(String, index=True)
    job_position = Column(String)
    education_level = Column(String)
    date_of_birth = Column(Date)
    gender = Column(String)
    created_at = Column(Date, default=func.now())
    updated_at = Column(Date, default=func.now(), onupdate=func.now())
