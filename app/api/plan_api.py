from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.repositories.plan_repository import PlanRepository
from app.schemas.plan import (
    PlanCreate,
    PlanUpdate,
    PlanResponse
)

router = APIRouter(
    prefix="/plans",
    tags=["Plans"]
)


@router.post(
    "/",
    response_model=PlanResponse
)
def create_plan(
    plan: PlanCreate,
    db: Session = Depends(get_db)
):

    return PlanRepository.create(db, plan)


@router.get(
    "/",
    response_model=list[PlanResponse]
)
def get_plans(
    db: Session = Depends(get_db)
):

    return PlanRepository.get_all(db)


@router.get(
    "/{plan_id}",
    response_model=PlanResponse
)
def get_plan(
    plan_id: int,
    db: Session = Depends(get_db)
):

    plan = PlanRepository.get_by_id(
        db,
        plan_id
    )

    if not plan:
        raise HTTPException(
            status_code=404,
            detail="Plan not found"
        )

    return plan


@router.put(
    "/{plan_id}",
    response_model=PlanResponse
)
def update_plan(
    plan_id: int,
    plan: PlanUpdate,
    db: Session = Depends(get_db)
):

    updated = PlanRepository.update(
        db,
        plan_id,
        plan
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Plan not found"
        )

    return updated


@router.delete("/{plan_id}")
def archive_plan(
    plan_id: int,
    db: Session = Depends(get_db)
):

    deleted = PlanRepository.archive(
        db,
        plan_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Plan not found"
        )

    return {
        "message": "Plan archived successfully"
    }