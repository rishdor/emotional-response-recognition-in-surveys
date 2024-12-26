from sqlalchemy import Column, Integer, String, ForeignKey
from database.database import Base

class Reward(Base):
    __tablename__ = "rewards"
    reward_id = Column(Integer, primary_key=True, index=True)
    reward_name = Column(String)
    reward_description = Column(String)
    points_required = Column(Integer)
