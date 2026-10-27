"""Best-effort SMTP delivery for billing notifications."""
import smtplib
from email.message import EmailMessage

from app.config.config import SMTP_FROM, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USERNAME


def send_email(recipient: str, subject: str, body: str) -> None:
    """Deliver mail only when SMTP is configured; never roll back billing for mail failure."""
    if not SMTP_HOST:
        return
    message = EmailMessage()
    message["From"] = SMTP_FROM
    message["To"] = recipient
    message["Subject"] = subject
    message.set_content(body)
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as smtp:
            smtp.starttls()
            if SMTP_USERNAME:
                smtp.login(SMTP_USERNAME, SMTP_PASSWORD)
            smtp.send_message(message)
    except (OSError, smtplib.SMTPException):
        # The durable in-app notification is the source of truth; email is a delivery channel.
        return
