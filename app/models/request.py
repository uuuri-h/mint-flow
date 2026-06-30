from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    Numeric,
    ForeignKey
)
from db import Base 
from datetime import datetime 


#=============================================================== 
# request_header & request_comment  テーブル用モデル
#=============================================================== 

#-----依頼ヘッダーテーブル-----------------------------------------------------

class RequestHeader (Base):
    
    #テーブル名
    __tablename__ = "request_header"
    
    #依頼id : PK ：　自動インクリメント
    request_id = Column(Integer, primary_key=True, autoincrement=True)

    #依頼cd(依頼書番号) : 未入力不可 : ユニーク
    request_cd =Column(String(30), nullable=False, unique=True)
    
    #顧客id : 未入力不可　　: 外部キー
    customer_id = Column(Integer, ForeignKey("customer.customer_id"), nullable=False)
    
    #依頼主ユーザーid : 未入力不可 　: 外部キー
    
    requester_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    
    #依頼先ユーザーid : 未入力不可　　: 外部キー
    assigner_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    
    #顧客納期　 : 未入力不可
    delivery_date = Column(Date, nullable=False)
    
    #依頼日　 : 未入力不可
    request_date = Column(Date, nullable=False)
    
    #依頼(ヘッダー)ステータス : 未入力不可
    header_status = Column(Integer, nullable=False)
    
    #依頼備考
    request_comment = Column(String(500), nullable=True)
    
    #作成日時
    created_at = Column(DateTime, default=datetime.now, nullable=False)

    #更新日時
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)
    
    
#-----依頼詳細テーブル-----------------------------------------------------

class RequestDetail (Base):
    
    #テーブル名
    __tablename__ = "request_detail"
    
    #依頼詳細id : PK ：　自動インクリメント
    detail_id = Column(Integer, primary_key=True, autoincrement=True)
    
    #依頼id : 未入力不可　: 外部キー
    request_id = Column(Integer, ForeignKey("request_header.request_id"), nullable=False)
    
    #アイテムid : 未入力不可 : 外部キー
    item_id = Column(Integer, ForeignKey("item.item_id"), nullable=False)
    
    #数量 : 未入力不可 
    quantity = Column(Integer, nullable=False)
    
    #原価（ドル）: 未入力不可
    cost_price = Column(Numeric(10, 2), nullable=False)
    
    #販売原価(円): 未入力不可 
    sales_price = Column(Numeric(10, 2), nullable=False)
    
    #サプライヤーid : 未入力不可　: 外部キー
    supplier_id = Column(Integer, ForeignKey("supplier.supplier_id"), nullable=False)
    
    #アイテムステータス : 未入力不可
    item_status = Column(Integer, nullable=False)
    
    #作成日時
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    
    #更新日時
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)