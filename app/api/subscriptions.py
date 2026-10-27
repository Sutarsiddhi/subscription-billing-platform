from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db

from app.repositories.subscription_repository import (
    SubscriptionRepository
)

from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionUpdate,
    SubscriptionResponse
)


router = APIRouter(
    prefix="/subscriptions",
    tags=["Subscriptions"]
)


# =========================================================
# Create Subscription
# =========================================================

@router.post(
    "/",
    response_model=SubscriptionResponse
)
def create_subscription(
    subscription: SubscriptionCreate,
    db: Session = Depends(get_db)
):

    created = SubscriptionRepository.create(
        db,
        subscription
    )
    if not created:
        raise HTTPException(status_code=400, detail="Customer or active plan not found")
    return created


# =========================================================
# Get All Subscriptions
# =========================================================

@router.get(
    "/",
    response_model=list[SubscriptionResponse]
)
def get_subscriptions(
    db: Session = Depends(get_db)
):

    return SubscriptionRepository.get_all(
        db
    )


# =========================================================
# Get Subscription By ID
# =========================================================

@router.get(
    "/{subscription_id}",
    response_model=SubscriptionResponse
)
def get_subscription(
    subscription_id: int,
    db: Session = Depends(get_db)
):

    subscription = SubscriptionRepository.get_by_id(
        db,
        subscription_id
    )


    if not subscription:

        raise HTTPException(
            status_code=404,
            detail="Subscription not found"
        )


    return subscription


# =========================================================
# Get Customer Subscriptions
# =========================================================

@router.get(
    "/customer/{customer_id}",
    response_model=list[SubscriptionResponse]
)
def get_customer_subscriptions(
    customer_id: int,
    db: Session = Depends(get_db)
):

    return SubscriptionRepository.get_by_customer(
        db,
        customer_id
    )


# =========================================================
# Update Subscription
# =========================================================

@router.put(
    "/{subscription_id}",
    response_model=SubscriptionResponse
)
def update_subscription(
    subscription_id: int,
    subscription: SubscriptionUpdate,
    db: Session = Depends(get_db)
):

    updated = SubscriptionRepository.update(
        db,
        subscription_id,
        subscription
    )


    if not updated:

        raise HTTPException(
            status_code=404,
            detail="Subscription not found"
        )


    return updated
