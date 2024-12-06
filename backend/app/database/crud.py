from sqlalchemy.orm import Session
from .user import User
from .user_points import UserPoints
from .schemas import UserCreate, UserUpdate
from sqlalchemy.exc import NoResultFound

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
        first_name = user.first_name,
        last_name = user.last_name,
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
        user_id = db_user.user_id
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