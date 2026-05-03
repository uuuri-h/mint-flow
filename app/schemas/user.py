from pydantic import BaseModel, Field
from datetime import date

# ===UserSchema定義===
# 登録・更新で使用するスキーマ
class InsertAndUpdateUserSchema(BaseModel):
    userid: s = Field(..., example=26011)
    user_name: str = Field(..., example="山田太郎")
    password: str = Field(..., example="Mint1234")


#ログインで使用するスキーマ
class LoginSchema(BaseModel):
    userid: str = Field(..., example="260011")
    password: str = Field(..., example="Mint1234")

# リクエスト情報を表すスキーマ    
class UserSchema(InsertAndUpdateUserSchema):
    userid: str = Field(..., example="260011")
    user_name: str = Field(..., example="山田太郎")
    department_code: int = Field(..., example=001)
    

#レスポンスで使用するスキーマ
class ResponseSchema(BaseModel):
    message: str = Field(..., 
                    description="API操作の結果を説明するメッセージ",
                    example="ユーザー情報が正常に更新されました。") 
        
        
