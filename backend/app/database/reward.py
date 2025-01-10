from sqlalchemy import Column, Integer, String, ForeignKey, Date, func
from database.database import Base
from sqlalchemy.orm import relationship

class Reward(Base):
    __tablename__ = "rewards"
    reward_id = Column(Integer, primary_key=True, index=True)
    reward_name = Column(String)
    reward_description = Column(String)
    points_required = Column(Integer)
    user_rewards = relationship("UserReward", back_populates="reward")

class UserReward(Base):
    __tablename__ = "userrewards"
    user_reward_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    reward_id = Column(Integer, ForeignKey("rewards.reward_id"), nullable=False)
    redeemed_at = Column(Date, default=func.now())

    user = relationship("User", back_populates="user_rewards")
    reward = relationship("Reward", back_populates="user_rewards")