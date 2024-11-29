from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database.database import get_db
from database.crud import get_user, delete_user, create_user, update_user
from database.schemas import UserCreate, UserUpdate, UserLogin
from .services import login_user

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/users/{user_id}", tags=["GetUser"])
def read(user_id: int, db = Depends(get_db)):
    user = get_user(db=db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.delete("/delete_user/{user_id}", tags=["DeleteUser"])
def delete(user_id: int, db = Depends(get_db)):
    user = delete_user(db=db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/update_user/{user_id}", tags=["UpdateUser]"])
async def update(user_id: int, user_update: UserUpdate, db = Depends(get_db)):
    user = update_user(db=db, user_id=user_id, user_data=user_update)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
    
@app.post("/create_user", tags=["CreateUser"])
def create(user: UserCreate, db = Depends(get_db)):
    db_user = create_user(db=db, user=user)
    if db_user is None:
        raise HTTPException(status_code=400, detail="Email already registered")
    return db_user

@app.get("/", tags=["test"])
async def read_root() -> dict:
    return {"message": "Hello World!"}

@app.post("/signin", tags=["signin"])
def sign_in(user_login: UserLogin, db = Depends(get_db)):
    try:
        result = login_user(db=db, user=user_login)
        return result
    except HTTPException as e:
        raise e