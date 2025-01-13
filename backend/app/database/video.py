from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base 


# Tabela z filmami
class Video(Base):
    __tablename__ = "videos"

    video_id = Column(Integer, primary_key=True, index=True)
    video_url = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relacja do łącznikowej tabeli SurveyVideos (opcjonalnie)
    surveyvideos = relationship("SurveyVideos", back_populates="video")


# Tabela łącząca ankiety, pytania i wideo
class SurveyVideos(Base):
    __tablename__ = "surveyvideos"

    survey_video_id = Column(Integer, primary_key=True, index=True)  # Można dodać autoincrement pk
    survey_id = Column(Integer, ForeignKey("surveys.survey_id", ondelete="CASCADE"), nullable=False)
    video_id = Column(Integer, ForeignKey("videos.video_id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("surveyquestions.question_id", ondelete="CASCADE"), nullable=False)

    # Unikalne połączenie (jeśli chcesz, by nie dublować tych samych wpisów)
    __table_args__ = (
        UniqueConstraint("survey_id", "video_id", "question_id", name="uq_survey_video_question"),
    )

    # Relacje
    video = relationship("Video", back_populates="surveyvideos")
    question = relationship("Question", back_populates="surveyvideos")
    # survey = relationship("Survey", back_populates="surveyvideos")  # Możesz dodać, jeśli w klasie Survey też dopiszesz back_populates
