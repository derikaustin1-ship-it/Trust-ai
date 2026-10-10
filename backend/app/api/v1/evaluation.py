from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models import User, EvaluationDataset, EvaluationRun
from app.schemas import EvaluationRunResponse, EvaluationRunCreate
from app.services.evaluation_service import EvaluationService

router = APIRouter(prefix="/evaluation", tags=["Evaluation Laboratory"])

@router.get("/datasets")
def get_evaluation_datasets(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    datasets = db.query(EvaluationDataset).all()
    return [{
        "id": d.id,
        "name": d.name,
        "description": d.description,
        "version": d.version,
        "case_count": len(d.cases) if d.cases else 0
    } for d in datasets]

@router.post("/runs", response_model=EvaluationRunResponse)
def trigger_evaluation_run(run_in: EvaluationRunCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    run = EvaluationService.run_benchmark(db=db, dataset_id=run_in.dataset_id, user_id=current_user.id)
    return run

@router.get("/runs", response_model=List[EvaluationRunResponse])
def get_evaluation_runs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    runs = db.query(EvaluationRun).order_by(EvaluationRun.started_at.desc()).all()
    return runs

@router.get("/runs/{run_id}", response_model=EvaluationRunResponse)
def get_evaluation_run_detail(run_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    run = db.query(EvaluationRun).filter(EvaluationRun.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Evaluation run not found.")
    return run

@router.get("/runs/{run_id}/export")
def export_run_csv(run_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    csv_data = EvaluationService.export_csv(db=db, run_id=run_id)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=evaluation_run_{run_id}.csv"}
    )
