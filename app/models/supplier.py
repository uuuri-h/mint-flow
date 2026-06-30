from sqlalchemy import Column, Integer, String, Date, DateTime 
from db import Base 
from datetime import datetime 

#=============================================================== 
# supplier テーブル用モデル
#=============================================================== 

class Supplier(Base):
    
    #テーブル名
    __tablename__ = "supplier"
    
    #サプライヤーid : PK ：　自動インクリメント
    supplier_id = Column(Integer, primary_key=True, autoincrement=True)
    
    #サプライヤー名 : 未入力不可
    supplier_name =Column(String(50), nullable=False)
    
    #作成日時
    created_at = Column(DateTime, default=datetime.now)
    
    #更新日時
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)