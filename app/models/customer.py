from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    Numeric,
    ForeignKey
)
from app.db import Base 
from datetime import datetime 

#=============================================================== 
# customer テーブル用モデル
#=============================================================== 

class Customer(Base):
    
    #テーブル名
    __tablename__ = "customer"
    
    #顧客id : PK ：　自動インクリメント
    customer_id = Column(Integer, primary_key=True, autoincrement=True)
    
    #顧客名 : 未入力不可
    customer_name =Column(String(50), nullable=False)
    
    #作成日時
    created_at = Column(DateTime, default=datetime.now, nullable=False)

    #更新日時
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)