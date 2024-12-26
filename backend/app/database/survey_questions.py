from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base

class Question(Base):
    __tablename__ = "surveyquestions"

    question_id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("surveys.survey_id"))
    question_text = Column(String, index=True)
    question_type = Column(String)
    created_at = Column(DateTime)

    answers = relationship("Answer", back_populates="question")

class Answer(Base):
    __tablename__ = "surveyanswers"

    answer_id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("surveyquestions.question_id"))
    answer_value = Column(String)
    created_at = Column(DateTime)

    question = relationship("Question", back_populates="answers")