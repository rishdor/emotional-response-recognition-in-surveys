from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class UserVideoEmotion(Base):
    __tablename__ = "uservideoemotions"

    user_video_emotion_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    video_id = Column(Integer, ForeignKey("videos.video_id"), nullable=False)
    emotion_type = Column(String)
    probability = Column(Float)
    video_timestamp = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="user_video_emotions")
    video = relationship("Video", back_populates="user_video_emotions")
