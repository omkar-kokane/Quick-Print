from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas, database

router = APIRouter(
    prefix="/pricing",
    tags=["pricing"],
)

@router.get("/shop/{shop_id}", response_model=schemas.ShopPricing)
def get_shop_pricing(shop_id: int, db: Session = Depends(database.get_db)):
    pricing = crud.get_shop_pricing(db, shop_id=shop_id)
    if not pricing:
        # Return default pricing if not set
        return schemas.ShopPricing(
            id=0,
            shop_id=shop_id,
            bw_single_price=1.00,
            bw_duplex_price=0.80,
            color_single_price=5.00,
            color_duplex_price=4.00
        )
    return pricing

@router.put("/shop/{shop_id}", response_model=schemas.ShopPricing)
def update_shop_pricing(shop_id: int, pricing_update: schemas.ShopPricingUpdate, db: Session = Depends(database.get_db)):
    pricing = crud.update_shop_pricing(db, shop_id=shop_id, pricing_update=pricing_update)
    return pricing

@router.post("/shop/{shop_id}", response_model=schemas.ShopPricing)
def create_shop_pricing(shop_id: int, pricing: schemas.ShopPricingBase, db: Session = Depends(database.get_db)):
    existing = crud.get_shop_pricing(db, shop_id=shop_id)
    if existing:
        raise HTTPException(status_code=400, detail="Pricing already exists for this shop. Use PUT to update.")
    return crud.create_shop_pricing(db, shop_id=shop_id, pricing=pricing)
