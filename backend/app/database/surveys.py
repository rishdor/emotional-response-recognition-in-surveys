from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
from sqlalchemy import TIMESTAMP
from sqlalchemy.types import Enum as SqlEnum
import enum

class SurveyProgress(enum.Enum):
    not_started = 'not_started'
    started = 'started'
    completed = 'completed'
    abandoned = 'abandoned'

class Survey(Base):
    __tablename__ = "surveys"
    survey_id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    is_active = Column(Boolean, default=True)
    deadline = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    issuer = Column(String)
    points_awarded = Column(Integer, default=100)
    survey_completions = relationship("UserSurveyCompletion", back_populates="survey")
    user_answers = relationship("UserSurveyAnswer", back_populates="survey")

class PreferencesTypes(Base):
    __tablename__ = "preferences_types"
    type_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)

    values = relationship("PreferencesValues", back_populates="type")

class PreferencesValues(Base):
    __tablename__ = "preferences_values"
    value_id = Column(Integer, primary_key=True)
    type_id = Column(Integer, ForeignKey("preferences_types.type_id", ondelete="CASCADE"), nullable=False)
    value = Column(String(100), nullable=False)

    type = relationship("PreferencesTypes", back_populates="values")
    __table_args__ = (UniqueConstraint("type_id", "value", name="uq_type_value"),)

class PreferencesUserPreferences(Base):
    __tablename__ = "preferences_userpreferences"
    user_preference_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    type_id = Column(Integer, ForeignKey("preferences_types.type_id", ondelete="CASCADE"), nullable=False)
    value_id = Column(Integer, ForeignKey("preferences_values.value_id", ondelete="CASCADE"), nullable=False)

    __table_args__ = (UniqueConstraint("user_id", "type_id", name="uq_user_type"),)

class PreferencesSurveyRequirements(Base):
    __tablename__ = "preferences_surveyrequirements"
    requirement_id = Column(Integer, primary_key=True)
    survey_id = Column(Integer, ForeignKey("surveys.survey_id", ondelete="CASCADE"), nullable=False)
    type_id = Column(Integer, ForeignKey("preferences_types.type_id", ondelete="CASCADE"), nullable=False)
    value_id = Column(Integer, ForeignKey("preferences_values.value_id", ondelete="CASCADE"), nullable=False)

    __table_args__ = (UniqueConstraint("survey_id", "type_id", "value_id", name="uq_survey_type_value"),)

class UserSurveyCompletion(Base):
    __tablename__ = 'usersurveycompletion'
    
    completion_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    survey_id = Column(Integer, ForeignKey('surveys.survey_id', ondelete='CASCADE'), nullable=False)
    completed_at = Column(TIMESTAMP, nullable=True)
    survey_state = Column(SqlEnum(SurveyProgress, name='survey_progress'), nullable=True, default=SurveyProgress.not_started)
    
    user = relationship("User", back_populates="survey_completions")
    survey = relationship("Survey", back_populates="survey_completions")