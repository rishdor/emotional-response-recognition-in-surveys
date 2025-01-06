from .database import Base
from sqlalchemy import Column, Integer, Date, String
from sqlalchemy import func
from sqlalchemy.orm import relationship

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
    points = relationship("UserPoints", back_populates="user", uselist=False)  # One-to-one relationship with UserPoints
    survey_completions = relationship("UserSurveyCompletion", back_populates="user")  # One-to-many relationship with UserSurveyCompletion
    user_rewards = relationship("UserReward", back_populates="user")
    survey_answers = relationship("UserSurveyAnswer", back_populates="user")