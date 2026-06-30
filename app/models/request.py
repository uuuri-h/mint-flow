from sqlalchemy import Column, Integer, String, Date, DateTime 
from db import Base 
from datetime import datetime 

#=============================================================== 
# request_header & request_detail  テーブル用モデル
#=============================================================== 

#-----依頼ヘッダーテーブル-----------------------------------------------------

class RequestHeader (Base):
    
    #テーブル名
    __tablename__ = "request_header "
    
    #依頼id : PK ：　自動インクリメント
    request_id = Column(Integer, primary_key=True, autoincrement=True)

    #依頼cd(依頼書番号) : 未入力不可 : ユニーク
    request_cd =Column(String(50), nullable=False)
    
    #顧客id : 未入力不可
    customer_id =Column(Integer, nullable=False)
    
    #依頼主ユーザーid : 未入力不可 
    requester_id =Column(Integer, nullable=False)
    
    #依頼先ユーザーid : 未入力不可
    assigner_id =Column(Integer, nullable=False)
    
    #顧客納期　 : 未入力不可
    delivery_date = Column(DateTime, nullable=False)
    
    #依頼日　 : 未入力不可
    request_date = Column(DateTime, nullable=False)
    
    #依頼(ヘッダー)ステータス : 未入力不可
    header_status = Column(Integer, nullable=False)
    
    #作成日時
    created_at = Column(DateTime, default=datetime.now)
    
    #更新日時
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    
#-----依頼詳細テーブル-----------------------------------------------------

class RequestDetail (Base):
    
    #テーブル名
    __tablename__ = "request_detail "
    
    #依頼詳細id : PK ：　自動インクリメント
    detail_id = Column(Integer, primary_key=True, autoincrement=True)
    
    #依頼id : 未入力不可
    request_id =Column(Integer, nullable=False)
    
    #アイテムid : 未入力不可 
    item_id =Column(Integer, nullable=False)
    
    #数量 : 未入力不可 
    quantity=Column(Integer, nullable=False)
    
    #原価（ドル）: 未入力不可
    cost_price = Column(float, nullable=False)
    
    #販売原価(円): 未入力不可 
    sales_price = Column(float, nullable=False)
    
    #依頼日　 : 未入力不可
    request_date = Column(DateTime, nullable=False)
    
    #サプライヤーid : 未入力不可
    supplier_id =Column(Integer, nullable=False)
    
    #詳細(依頼アイテム)ステータス : 未入力不可
    item_status = Column(Integer, nullable=False)
    
    #作成日時
    created_at = Column(DateTime, default=datetime.now)
    
    #更新日時
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    