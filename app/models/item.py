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
# item テーブル用モデル
#=============================================================== 

class Item(Base):
    
    #テーブル名
    __tablename__ = "item"
    
    #アイテムid : PK ：　自動インクリメント
    item_id = Column(Integer, primary_key=True, autoincrement=True)

    #アイテムcd(型番) : 未入力不可 : ユニーク
    item_cd =Column(String(50), nullable=False, unique=True)
    
    #サプライヤーid : 未入力不可
    supplier_id =Column(Integer, nullable=False)
    
    #アイテム名 : 未入力不可
    item_name =Column(String(50), nullable=False)
    
    #メーカー名 : 未入力不可
    maker_name =Column(String(50), nullable=False)
    
    #原価（ドル）: 未入力不可
    cost_price = Column(Numeric, nullable=False)
    
    #販売原価(円): 未入力不可 
    sales_price = Column(Numeric, nullable=False)
    
    #作成日時
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    
    #更新日時
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)