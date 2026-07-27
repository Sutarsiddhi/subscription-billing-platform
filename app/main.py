from fastapi import FastAPI

from app.api.plan_api import router as plan_router

from app.api.auth_api import router as auth_router

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app = FastAPI(
    title="Billing Automation Platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(plan_router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "message": "Billing Platform API Running"
    }