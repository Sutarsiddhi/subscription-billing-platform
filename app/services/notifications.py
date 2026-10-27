"""Persistent in-app notifications for significant billing events."""
from sqlalchemy.orm import Session

from app.models.enums import NotificationType
from app.models.notification import Notification
from app.models.customer import Customer
from app.services.mailer import send_email


def notify(db: Session, customer_id: int, type: NotificationType, title: str, message: str) -> Notification:
    notification = Notification(
        customer_id=customer_id,
        type=type,
        title=title,
        message=message,
    )
    db.add(notification)
    customer = db.get(Customer, customer_id)
    if customer:
        send_email(customer.email, title, message)
    return notification
