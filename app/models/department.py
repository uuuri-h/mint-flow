from sqlalchemy import Column, Integer, String, Date, DateTime 
from db import Base 
from datetime import datetime 

#=============================================================== 
# department テーブル用モデル
#=============================================================== 

class Department(Base):
    
    #テーブル名
    __tablename__ = "department"
    
    #部署id : PK ：　自動インクリメント
    department_id = Column(Integer, primary_key=True, autoincrement=True)
    
    #部署名 : 未入力不可
    department_name =Column(String(30), nullable=False)
    
    #作成日時
    created_at = Column(DateTime, default=datetime.now)
    
    #更新日時
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)