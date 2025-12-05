from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, database

router = APIRouter(
    prefix="/orders",
    tags=["orders"],
)

@router.post("/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(database.get_db)):
    try:
        return crud.create_order(db=db, order=order)
    except Exception as e:
        import traceback
        print(f"Error creating order: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/shop/{shop_id}", response_model=List[schemas.Order])
def read_orders(shop_id: int, db: Session = Depends(database.get_db)):
    orders = crud.get_orders_by_shop(db, shop_id=shop_id)
    return orders

@router.get("/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(database.get_db)):
    order = crud.get_order(db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.patch("/{order_id}/status", response_model=schemas.Order)
def update_order_status(order_id: int, status_update: schemas.OrderStatusUpdate, db: Session = Depends(database.get_db)):
    order = crud.update_order_status(db, order_id=order_id, status=status_update.status)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.patch("/items/{item_id}/status", response_model=schemas.OrderItem)
def update_item_status(item_id: int, status_update: schemas.ItemStatusUpdate, db: Session = Depends(database.get_db)):
    item = crud.update_item_status(db, item_id=item_id, status=status_update.status)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
