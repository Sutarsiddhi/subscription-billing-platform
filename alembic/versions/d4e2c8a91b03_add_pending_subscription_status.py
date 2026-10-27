"""Add pending status for payment-confirmed activation.

Revision ID: d4e2c8a91b03
Revises: c301b9d71e02
"""
from alembic import op

revision = "d4e2c8a91b03"
down_revision = "c301b9d71e02"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # SQLAlchemy stores the existing enum labels in uppercase on PostgreSQL.
    op.execute("ALTER TYPE subscriptionstatus ADD VALUE IF NOT EXISTS 'PENDING'")


def downgrade() -> None:
    # PostgreSQL does not support removing individual enum labels safely.
    pass
