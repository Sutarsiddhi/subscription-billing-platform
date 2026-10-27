"""Expand plans with catalog and entitlement metadata.

Revision ID: f12b4a9c7d01
Revises: 766220b3f720
"""
from alembic import op
import sqlalchemy as sa


revision = "f12b4a9c7d01"
down_revision = "766220b3f720"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("plans", sa.Column("platform", sa.String(length=100), nullable=False, server_default="BillWise"))
    op.add_column("plans", sa.Column("description", sa.String(length=500), nullable=False, server_default="Subscription plan"))
    op.add_column("plans", sa.Column("currency", sa.String(length=3), nullable=False, server_default="INR"))
    op.add_column("plans", sa.Column("customer_limit", sa.Integer(), nullable=True))
    op.add_column("plans", sa.Column("invoice_limit", sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column("plans", "invoice_limit")
    op.drop_column("plans", "customer_limit")
    op.drop_column("plans", "currency")
    op.drop_column("plans", "description")
    op.drop_column("plans", "platform")
