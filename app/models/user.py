from sqlalchemy import Column, Integer, String, Date, DateTime 
from db import Base 
from datetime import datetime 

#=============================================================== 
# user ユーザー用モデル
#=============================================================== 

class User(Base):
    
    #ユーザー名
    __tablename__ = "user"
    
    #ユーザーid : PK ：　自動インクリメント
    user_id = Column(Integer, primary_key=True, autoincrement=True)

    #ユーザーcd(型番) : 未入力不可 : ユニーク
    user_cd =Column(String(10), nullable=False)
    
    #ユーザー名 : 未入力不可
    user_name =Column(String(50), nullable=False)
    
    #部署id : 未入力不可
    department_id = Column(Integer, nullable=False)
    
    #作成日時
    created_at = Column(DateTime, default=datetime.now)
    
    #更新日時
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)