import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from app.core.database import SessionLocal, Base, engine
from app.services.seed_service import seed_database

def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
        print("Successfully seeded demo database.")
    finally:
        db.close()

if __name__ == "__main__":
    main()
