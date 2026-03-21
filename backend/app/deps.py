from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from . import database, auth, models, schemas

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
token_dependency = Annotated[str, Depends(oauth2_scheme)]

