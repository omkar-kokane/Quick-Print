from sqlalchemy.orm import Session
from . import models, schemas

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Shop Pricing CRUD - Must be defined before create_order
def get_shop_pricing(db: Session, shop_id: int):
    pricing = db.query(models.ShopPricing).filter(models.ShopPricing.shop_id == shop_id).first()
    if not pricing:
        # Return a default pricing object (not persisted)
        return models.ShopPricing(
            id=0,
            shop_id=shop_id,
            bw_single_price=1.00,
            bw_duplex_price=0.80,
            color_single_price=5.00,
            color_duplex_price=4.00
        )
    return pricing

def create_shop_pricing(db: Session, shop_id: int, pricing: schemas.ShopPricingBase):
    db_pricing = models.ShopPricing(
        shop_id=shop_id,
        **pricing.dict()
    )
    db.add(db_pricing)
    db.commit()
    db.refresh(db_pricing)
    return db_pricing

def update_shop_pricing(db: Session, shop_id: int, pricing_update: schemas.ShopPricingUpdate):
    db_pricing = db.query(models.ShopPricing).filter(models.ShopPricing.shop_id == shop_id).first()
    if db_pricing:
        for key, value in pricing_update.dict().items():
            setattr(db_pricing, key, value)
        db.commit()
        db.refresh(db_pricing)
    else:
        # Create if doesn't exist
        db_pricing = create_shop_pricing(db, shop_id, pricing_update)
    return db_pricing

# Order CRUD
def create_order(db: Session, order: schemas.OrderCreate):
    # Get shop pricing or use defaults
    pricing = get_shop_pricing(db, order.shop_id)
    
    # Calculate total amount using dynamic pricing
    total = 0
    for item in order.items:
        if item.is_color:
            rate = float(pricing.color_duplex_price) if item.is_duplex else float(pricing.color_single_price)
        else:
            rate = float(pricing.bw_duplex_price) if item.is_duplex else float(pricing.bw_single_price)
        
        # Price = rate per page * pages * copies
        item_total = rate * item.page_count * item.copies
        total += item_total
    
    db_order = models.Order(
        user_id=order.user_id,
        shop_id=order.shop_id,
        total_amount=total,
        status=models.OrderStatus.PENDING
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            **item.dict()
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders_by_shop(db: Session, shop_id: int):
    return db.query(models.Order).filter(models.Order.shop_id == shop_id).all()

def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def update_order_status(db: Session, order_id: int, status: models.OrderStatus):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order:
        db_order.status = status
        
        # Sync item statuses
        if status == models.OrderStatus.PENDING:
            for item in db_order.items:
                item.status = models.ItemStatus.PENDING
        elif status == models.OrderStatus.COMPLETED:
            for item in db_order.items:
                item.status = models.ItemStatus.PRINTED
                
        db.commit()
        db.refresh(db_order)
    return db_order

def update_item_status(db: Session, item_id: int, status: models.ItemStatus):
    db_item = db.query(models.OrderItem).filter(models.OrderItem.id == item_id).first()
    if db_item:
        db_item.status = status
        db.commit()
        db.refresh(db_item)
        
        # Auto-complete order if all items are printed
        order = db_item.order
        all_printed = all(item.status == models.ItemStatus.PRINTED for item in order.items)
        if all_printed and order.status != models.OrderStatus.COMPLETED:
            order.status = models.OrderStatus.COMPLETED
            db.commit()
            db.refresh(order)
    return db_item
