from sqlalchemy.orm import Session

from app.models.plan import Plan
from app.schemas.plan import PlanCreate, PlanUpdate


class PlanRepository:

    @staticmethod
    def create(db: Session, plan: PlanCreate):

        db_plan = Plan(
            name=plan.name,
            price=plan.price,
            billing_interval=plan.billing_interval,
            trial_days=plan.trial_days
        )

        db.add(db_plan)
        db.commit()
        db.refresh(db_plan)

        return db_plan

    @staticmethod
    def get_all(db: Session):

        return db.query(Plan).all()

    @staticmethod
    def get_by_id(db: Session, plan_id: int):

        return db.query(Plan).filter(
            Plan.id == plan_id
        ).first()

    @staticmethod
    def update(db: Session, plan_id: int, plan: PlanUpdate):

        db_plan = db.query(Plan).filter(
            Plan.id == plan_id
        ).first()

        if not db_plan:
            return None

        update_data = plan.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_plan, key, value)

        db.commit()
        db.refresh(db_plan)

        return db_plan

    @staticmethod
    def archive(db: Session, plan_id: int):

        db_plan = db.query(Plan).filter(
            Plan.id == plan_id
        ).first()

        if not db_plan:
            return None

        db_plan.is_active = False

        db.commit()

        return db_plan