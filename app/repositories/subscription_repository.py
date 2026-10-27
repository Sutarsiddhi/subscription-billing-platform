from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.models.subscription import Subscription
from app.models.plan import Plan
from app.models.customer import Customer
from app.models.enums import BillingInterval, SubscriptionStatus
from app.models.enums import NotificationType
from app.services.billing_engine import issue_invoice
from app.services.notifications import notify
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionUpdate
)


class SubscriptionRepository:

    @staticmethod
    def create(
        db: Session,
        subscription: SubscriptionCreate
    ):

        plan = db.get(Plan, subscription.plan_id)
        customer = db.get(Customer, subscription.customer_id)
        if not plan or not plan.is_active or not customer:
            return None

        now = datetime.utcnow()
        trial_ends_at = now + timedelta(days=plan.trial_days) if plan.trial_days else None
        period_start = trial_ends_at or now
        period_end = period_start + timedelta(days=365 if plan.billing_interval == BillingInterval.ANNUAL else 30)
        db_subscription = Subscription(

            customer_id=subscription.customer_id,

            plan_id=subscription.plan_id,
            # A paid subscription is activated only after its invoice payment is
            # confirmed. Trials remain immediately usable until their expiry.
            status=SubscriptionStatus.TRIAL if trial_ends_at else SubscriptionStatus.PENDING,
            trial_ends_at=trial_ends_at,
            current_period_start=period_start,
            current_period_end=period_end,

        )

        db.add(db_subscription)

        db.flush()
        notify(db, customer.id, NotificationType.SUBSCRIPTION_CREATED,
               "Subscription created", f"Your {plan.name} subscription has been created.")
        # Trials convert to a billable period only when the trial expires. Paid plans
        # receive an invoice immediately, ready for a confirmation-based payment.
        if not trial_ends_at:
            issue_invoice(db, db_subscription)
        db.commit()
        db.refresh(db_subscription)

        return db_subscription


    @staticmethod
    def get_all(
        db: Session
    ):

        return db.query(
            Subscription
        ).all()


    @staticmethod
    def get_by_id(
        db: Session,
        subscription_id: int
    ):

        return db.query(
            Subscription
        ).filter(
            Subscription.id == subscription_id
        ).first()


    @staticmethod
    def get_by_customer(
        db: Session,
        customer_id: int
    ):

        return db.query(
            Subscription
        ).filter(
            Subscription.customer_id == customer_id
        ).all()


    @staticmethod
    def update(
        db: Session,
        subscription_id: int,
        subscription: SubscriptionUpdate
    ):

        db_subscription = db.query(
            Subscription
        ).filter(
            Subscription.id == subscription_id
        ).first()


        if not db_subscription:

            return None


        update_data = subscription.model_dump(
            exclude_unset=True
        )


        for key, value in update_data.items():

            setattr(
                db_subscription,
                key,
                value
            )


        db.commit()

        db.refresh(db_subscription)

        return db_subscription
