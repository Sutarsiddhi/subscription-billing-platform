"""Celery application used by background billing workers and Celery Beat."""
from celery import Celery

from app.config.config import CELERY_BROKER_URL, CELERY_RESULT_BACKEND

celery_app = Celery(
    "billwise",
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND,
    include=["app.tasks.billing"],
)

celery_app.conf.update(
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    beat_schedule={
        "process-due-billing-cycles": {
            "task": "app.tasks.billing.process_due_billing_cycles_task",
            "schedule": 60.0,
        },
    },
)
