"""Track payment-retry notifications.

Revision ID: e8f5a1d3b904
Revises: d4e2c8a91b03
"""
from alembic import op
import sqlalchemy as sa

revision = "e8f5a1d3b904"
down_revision = "d4e2c8a91b03"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("payment_retries", sa.Column("notified_at", sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column("payment_retries", "notified_at")
