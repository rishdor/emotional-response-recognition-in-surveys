from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound
from .user import User
from .user_points import UserPoints
from .schemas import UserCreate, UserUpdate
from .surveys import Survey, PreferencesUserPreferences, PreferencesSurveyRequirements, UserSurveyCompletion, SurveyProgress
from .survey_questions import Question, Answer, UserSurveyAnswer, UserAnswerCreate
from .video import Video, SurveyVideos
from sqlalchemy.sql import literal
from .reward import Reward, UserReward
from datetime import datetime

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
    
def get_user_data(db: Session, user_id: int):
    user_data = db.query(
        User.first_name, 
        User.email, 
        User.country,
        User.city,
        User.job_position,
        User.education_level,
        User.date_of_birth,
        User.gender
    ).filter(User.user_id == user_id).first()

    if user_data:
        return {
            'first_name': user_data[0],
            'email': user_data[1],
            'country': user_data[2],
            'city': user_data[3],
            'job_position': user_data[4],
            'education_level': user_data[5],
            'date_of_birth': user_data[6],
            'gender': user_data[7],
        }
    return None

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

def remove_inactive_surveys(db: Session, user_id: int):
    users_surveys = db.query(UserSurveyCompletion.survey_id).filter(UserSurveyCompletion.user_id == user_id).all()
    users_survey_ids = [survey.survey_id for survey in users_surveys]

    inactive_surveys = db.query(Survey.survey_id).filter(Survey.survey_id.in_(users_survey_ids), Survey.is_active == False).all()
    inactive_survey_ids = [survey.survey_id for survey in inactive_surveys]

    db.query(UserSurveyCompletion).filter(
        UserSurveyCompletion.user_id == user_id,
        UserSurveyCompletion.survey_id.in_(inactive_survey_ids)
    ).update({UserSurveyCompletion.survey_state: SurveyProgress.abandoned}, synchronize_session=False)

    db.commit()

    return {"message": "Inactive surveys have been marked as abandoned."}

def get_surveys_by_user_id(db: Session, user_id: int):
    match_surveys_to_user(db, user_id)
    remove_inactive_surveys(db, user_id)
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

def get_rewards(db: Session, user_id: int):
    rewards = db.query(Reward).all()
    user_rewards = db.query(UserReward).filter(UserReward.user_id == user_id).all()
    user_rewards_dict = {ur.reward_id: ur.redeemed_at for ur in user_rewards}

    for reward in rewards:
        reward.last_redeemed = user_rewards_dict.get(reward.reward_id, None)

    return rewards

def get_questions_by_survey_id(db: Session, survey_id: int):
    return db.query(Question).filter(Question.survey_id == survey_id).all()

def get_answers_by_question_id(db: Session, question_id: int):
    return db.query(Answer).filter(Answer.question_id == question_id).all()

def redeem_reward(db: Session, user_id: int, reward_id: int):
    user = db.query(User).filter(User.user_id == user_id).first()
    reward = db.query(Reward).filter(Reward.reward_id == reward_id).first()

    if not user or not reward:
        return None

    user_points = user.points
    if user_points.points < reward.points_required:
        return "Not enough points"

    now = datetime.utcnow()
    last_redeemed = db.query(UserReward).filter(UserReward.user_id == user_id, UserReward.reward_id == reward_id).order_by(UserReward.redeemed_at.desc()).first()

    if last_redeemed and (now - last_redeemed.redeemed_at).days < 30:
        return "Reward can only be redeemed once a month"

    user_points.points -= reward.points_required
    user_reward = UserReward(user_id=user_id, reward_id=reward_id, redeemed_at=now)
    db.add(user_reward)
    db.commit()
    db.refresh(user)
    db.refresh(reward)
    return "Reward redeemed successfully"

def fetch_survey_state(db: Session, user_id: int, survey_id: int):
    return db.query(UserSurveyCompletion).filter_by(user_id=user_id, survey_id=survey_id).first()

def modify_survey_state(db: Session, user_id: int, survey_id: int, state: SurveyProgress):
    completion = db.query(UserSurveyCompletion).filter_by(user_id=user_id, survey_id=survey_id).first()
    if not completion:
        return None
    completion.survey_state = state
    if state == SurveyProgress.completed:
        completion.completed_at = datetime.utcnow()
    db.commit()
    return completion

def save_user_answer(db: Session, answer: UserAnswerCreate):
    user_answer = UserSurveyAnswer(
        user_id=answer.user_id,
        survey_id=answer.survey_id,
        question_id=answer.question_id,
        answer_id=answer.answer_id
    )
    db.add(user_answer)
    db.commit()
    db.refresh(user_answer)
    return user_answer

def fetch_last_answered_question(db: Session, user_id: int, survey_id: int):
    try:
        last_answer = db.query(UserSurveyAnswer).join(Question).filter(
            UserSurveyAnswer.user_id == user_id,
            UserSurveyAnswer.survey_id == survey_id,
            Question.survey_id == survey_id
        ).order_by(UserSurveyAnswer.answered_at.desc()).first()
        return last_answer
    except NoResultFound:
        return None
    

# Pobiera film (Video) po jego ID
def get_video_by_id(db: Session, video_id: int):
    """
    Pobiera film (Video) po jego ID.
    """
    video = db.query(Video).filter(Video.video_id == video_id).first()
    return video

# Connect survey, question and video
def create_survey_video(db: Session, survey_id: int, video_id: int, question_id: int):
    """
    Łączy ankietę, pytanie i wideo w tabeli SurveyVideos.
    """
    new_survey_video = SurveyVideos(
        survey_id=survey_id,
        video_id=video_id,
        question_id=question_id
    )
    db.add(new_survey_video)
    db.commit()
    db.refresh(new_survey_video)
    return new_survey_video

# Pobiera rekord z SurveyVideos po jego ID
def get_survey_video(db: Session, survey_video_id: int):
    """
    Pobiera rekord z SurveyVideos po jego ID.
    """
    survey_video = db.query(SurveyVideos).filter(SurveyVideos.survey_video_id == survey_video_id).first()
    return survey_video

def get_videos_for_survey(db: Session, survey_id: int):
    """
    Zwraca wszystkie obiekty Video przypisane do danej ankiety (survey_id),
    korzystając z relacji w tabeli SurveyVideos.
    """
    videos = (
        db.query(Video)
          .join(SurveyVideos, Video.video_id == SurveyVideos.video_id)
          .filter(SurveyVideos.survey_id == survey_id)
          .all()
    )
    return videos

def get_videos_for_question(db: Session, question_id: int):
    """
    Zwraca wszystkie obiekty Video przypisane do konkretnego pytania (question_id).
    """
    videos = (
        db.query(Video)
          .join(SurveyVideos, Video.video_id == SurveyVideos.video_id)
          .filter(SurveyVideos.question_id == question_id)
          .all()
    )
    return videos
