from .database import Base
from sqlalchemy import Column, Integer, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy import func

class UserPoints(Base):
    __tablename__ = "userpoints"

    user_points_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    points = Column(Integer, default=0)
    created_at = Column(Date, default=func.now())
    updated_at = Column(Date, default=func.now(), onupdate=func.now())
    user = relationship("User", back_populates="points")

    
