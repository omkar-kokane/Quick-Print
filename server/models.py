from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum, DateTime, DECIMAL, Text
from sqlalchemy.orm import relationship
from .database import Base
import datetime
import enum

class UserRole(str, enum.Enum):
    student = "student"
    shop_owner = "shop_owner"

class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class ItemStatus(str, enum.Enum):
    PENDING = "PENDING"
    PRINTED = "PRINTED"

class Orientation(str, enum.Enum):
    PORTRAIT = "PORTRAIT"
    LANDSCAPE = "LANDSCAPE"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    phone = Column(String(50))
    role = Column(Enum(UserRole))

    orders = relationship("Order", back_populates="user", foreign_keys="Order.user_id")
    shop_orders = relationship("Order", back_populates="shop", foreign_keys="Order.shop_id")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    shop_id = Column(Integer, ForeignKey("users.id"))
    total_amount = Column(DECIMAL(10, 2))
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", foreign_keys=[user_id], back_populates="orders")
    shop = relationship("User", foreign_keys=[shop_id], back_populates="shop_orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    file_url = Column(Text)
    file_name = Column(String(255))
    copies = Column(Integer)
    page_count = Column(Integer, default=1)  # Number of pages in the document
    is_color = Column(Boolean, default=False)
    is_duplex = Column(Boolean, default=False)
    orientation = Column(Enum(Orientation), default=Orientation.PORTRAIT)
    status = Column(Enum(ItemStatus), default=ItemStatus.PENDING)

    order = relationship("Order", back_populates="items")

class ShopPricing(Base):
    __tablename__ = "shop_pricing"

    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("users.id"), unique=True)
    bw_single_price = Column(DECIMAL(10, 2), default=1.00)      # B&W single-sided per page
    bw_duplex_price = Column(DECIMAL(10, 2), default=0.80)      # B&W duplex per page
    color_single_price = Column(DECIMAL(10, 2), default=5.00)   # Color single-sided per page
    color_duplex_price = Column(DECIMAL(10, 2), default=4.00)   # Color duplex per page

    shop = relationship("User", foreign_keys=[shop_id])
