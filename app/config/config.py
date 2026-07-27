from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("postgresql://postgres:admin@localhost:5432/billing_db")