"""Scheduled and on-demand tasks for recurring billing."""
from app.database.database import SessionLocal
from app.services.billing_engine import process_due_billing_cycles, process_due_payment_retries
from app.worker import celery_app


@celery_app.task(name="app.tasks.billing.process_due_billing_cycles_task")
def process_due_billing_cycles_task() -> dict[str, int]:
    """Process expired trials and subscription renewals in an isolated DB session."""
    db = SessionLocal()
    try:
        result = process_due_billing_cycles(db)
        result["payment_retries_due"] = process_due_payment_retries(db)
        return result
    finally:
        db.close()
