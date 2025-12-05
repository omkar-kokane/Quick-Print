from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .models import UserRole, OrderStatus, ItemStatus, Orientation

class OrderItemBase(BaseModel):
    file_url: str
    file_name: str
    copies: int
    page_count: int = 1
    is_color: bool = False
    is_duplex: bool = False
    orientation: Orientation = Orientation.PORTRAIT

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    status: ItemStatus

    class Config:
        orm_mode = True

class OrderBase(BaseModel):
    user_id: int
    shop_id: int

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class Order(OrderBase):
    id: int
    total_amount: float
    status: OrderStatus
    created_at: datetime
    items: List[OrderItem]

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    name: str
    phone: str
    role: UserRole

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

class OrderStatusUpdate(BaseModel):
    status: OrderStatus

class ItemStatusUpdate(BaseModel):
    status: ItemStatus

# Shop Pricing Schemas
class ShopPricingBase(BaseModel):
    bw_single_price: float = 1.00
    bw_duplex_price: float = 0.80
    color_single_price: float = 5.00
    color_duplex_price: float = 4.00

class ShopPricingCreate(ShopPricingBase):
    shop_id: int

class ShopPricingUpdate(ShopPricingBase):
    pass

class ShopPricing(ShopPricingBase):
    id: int
    shop_id: int

    class Config:
        orm_mode = True
