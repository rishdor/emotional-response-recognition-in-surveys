from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound
from .user import User
from .user_points import UserPoints
from .schemas import UserCreate, UserUpdate
from .surveys import Survey, PreferencesUserPreferences, PreferencesSurveyRequirements, UserSurveyCompletion, SurveyProgress
from .survey_questions import Question, Answer
from sqlalchemy.sql import literal
from .reward import Reward

# Get user's name by ID
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.user_id == user_id).first().first_name

# Delete a user by ID
def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return db_user
    return None

# Update an existing user by ID
def update_user(db: Session, user_id: int, user_data: UserUpdate):
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if db_user is None:
        return None
    
    for key, value in user_data.dict(exclude_unset=True).items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user

# Create a user
def create_user(db: Session, user: UserCreate):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        return None

    db_user = User(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        password_hash=user.password,
        city=user.city,
        country=user.country,
        job_position=user.job_position,
        education_level=user.education_level,
        date_of_birth=user.date_of_birth,
        gender=user.gender
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    db_user_points = UserPoints(
        user_id=db_user.user_id
    )

    db.add(db_user_points)
    db.commit()
    
    return db_user

def update_user_points(db: Session, user_id: int, points: int):
    db_user = db.query(UserPoints).filter(UserPoints.user_id == user_id).first()
    if db_user is None:
        return None
    db_user.points = points
    db.commit()
    return db_user

def get_user_points_by_id(db: Session, user_id: id):
    try:
        user_points = db.query(UserPoints).filter(UserPoints.user_id == user_id).one()
        return user_points
    except NoResultFound:
        raise NoResultFound(f"No points record found for user with id {user_id}")

# Match surveys to user preferences
def match_surveys_to_user(db: Session, user_id: int):
    active_surveys = db.query(Survey).filter(Survey.is_active == True).all()

    # user_preferences = db.query(PreferencesUserPreferences).filter(
    #     PreferencesUserPreferences.user_id == user_id
    # ).all()

    # if not user_preferences:
    #     return {"error": "No preferences found for the user."}

    # # Create a dictionary for user preferences {type_id: value_id}
    # user_preferences_dict = {pref.type_id: pref.value_id for pref in user_preferences}

    # matched_surveys = []
    # for survey in active_surveys:
    #     survey_requirements = db.query(PreferencesSurveyRequirements).filter(
    #         PreferencesSurveyRequirements.survey_id == survey.survey_id
    #     ).all()
        
    #     match = True
    #     for requirement in survey_requirements:
    #         if user_preferences_dict.get(requirement.type_id) != requirement.value_id:
    #             match = False
    #             break
        
    #     if match:
    #         matched_surveys.append(survey)
    
    # # Update UserSurveyCompletion table for matched surveys
    # for survey in matched_surveys:
    #     existing_entry = db.query(UserSurveyCompletion).filter(
    #         UserSurveyCompletion.user_id == user_id,
    #         UserSurveyCompletion.survey_id == survey.survey_id
    #     ).first()

    #     if not existing_entry:
    #         new_completion = UserSurveyCompletion(
    #             user_id=user_id,
    #             survey_id=survey.survey_id,
    #             survey_state='not_started'
    #         )
    #         db.add(new_completion)

    # db.commit()
    # return {"matched_surveys": [survey.survey_id for survey in matched_surveys]}
    for survey in active_surveys:
        existing_entry = db.query(UserSurveyCompletion).filter(
            UserSurveyCompletion.user_id == user_id,
            UserSurveyCompletion.survey_id == survey.survey_id
        ).first()

        if not existing_entry:
            new_completion = UserSurveyCompletion(
                user_id=user_id,
                survey_id=survey.survey_id,
                survey_state=SurveyProgress.not_started
            )
            db.add(new_completion)

    db.commit()
    return {"message": "All active surveys have been added to the user."}

def get_surveys_by_user_id(db: Session, user_id: int):
    match_surveys_to_user(db, user_id)
    user_surveys = db.query(UserSurveyCompletion).filter(UserSurveyCompletion.user_id == user_id).all()
    
    surveys = []
    for user_survey in user_surveys:
        survey = db.query(Survey).filter(Survey.survey_id == user_survey.survey_id).first()
        if survey:
            surveys.append({
                "completion_id": user_survey.completion_id,
                "completed_at": user_survey.completed_at,
                "survey_state": user_survey.survey_state,
                "user_id": user_survey.user_id,
                "survey_id": user_survey.survey_id,
                "title": survey.title,
                "deadline": survey.deadline,
                "description": survey.description,
                "issuer": survey.issuer,
                "points_awarded": survey.points_awarded
            })
    
    return {"surveys": surveys}


def get_rewards(db: Session):
    rewards = db.query(Reward).all()
    return rewards

def get_questions_by_survey_id(db: Session, survey_id: int):
    return db.query(Question).filter(Question.survey_id == survey_id).all()

def get_answers_by_question_id(db: Session, question_id: int):
    return db.query(Answer).filter(Answer.question_id == question_id).all()