from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, TIMESTAMP
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime
from pydantic import BaseModel
from .surveys import SurveyProgress

class SurveyStateUpdate(BaseModel):
    survey_state: SurveyProgress

class UserAnswerCreate(BaseModel):
    user_id: int
    survey_id: int
    question_id: int
    answer_id: int

class Question(Base):
    __tablename__ = "surveyquestions"

    question_id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("surveys.survey_id"))
    question_text = Column(String, index=True)
    question_type = Column(String)
    created_at = Column(DateTime)

    answers = relationship("Answer", back_populates="question")
    user_answers = relationship("UserSurveyAnswer", back_populates="question")
    surveyvideos = relationship("SurveyVideos", back_populates="question")

class Answer(Base):
    __tablename__ = "surveyanswers"

    answer_id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("surveyquestions.question_id"))
    answer_value = Column(String)
    created_at = Column(DateTime)

    question = relationship("Question", back_populates="answers")
    user_answers = relationship("UserSurveyAnswer", back_populates="answer")

class UserSurveyAnswer(Base):
    __tablename__ = 'user_survey_answers'
    
    user_answer_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    survey_id = Column(Integer, ForeignKey('surveys.survey_id', ondelete='CASCADE'), nullable=False)
    question_id = Column(Integer, ForeignKey('surveyquestions.question_id', ondelete='CASCADE'), nullable=False)
    answer_id = Column(Integer, ForeignKey('surveyanswers.answer_id', ondelete='SET NULL'), nullable=True)
    answered_at = Column(TIMESTAMP, default=datetime.utcnow)
    
    user = relationship("User", back_populates="survey_answers")
    survey = relationship("Survey", back_populates="user_answers")
    question = relationship("Question", back_populates="user_answers")
    answer = relationship("Answer", back_populates="user_answers")