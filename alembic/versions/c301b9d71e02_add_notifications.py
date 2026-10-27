"""Add persistent billing notifications.

Revision ID: c301b9d71e02
Revises: f12b4a9c7d01
"""
from alembic import op
import sqlalchemy as sa

revision = "c301b9d71e02"
down_revision = "f12b4a9c7d01"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("customer_id", sa.Integer(), sa.ForeignKey("customers.id"), nullable=False),
        sa.Column("type", sa.Enum("SUBSCRIPTION_CREATED", "INVOICE_GENERATED", "PAYMENT_SUCCEEDED", "PAYMENT_FAILED", "PAYMENT_RETRY", "SUBSCRIPTION_CANCELLED", name="notificationtype"), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("is_read", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_notifications_customer_id", "notifications", ["customer_id"])
    op.create_index("ix_notifications_id", "notifications", ["id"])


def downgrade() -> None:
    op.drop_index("ix_notifications_id", table_name="notifications")
    op.drop_index("ix_notifications_customer_id", table_name="notifications")
    op.drop_table("notifications")
    op.execute("DROP TYPE IF EXISTS notificationtype")
