from pydantic import BaseModel, Field
from datetime import date
from typing import List

# ===UserSchema定義===
# 登録・更新で使用するスキーマ
class InsertAndUpdateUserSchema(BaseModel):
    user_cd: str = Field(..., example="26011")
    user_name: str = Field(..., example="山田太郎")
    department_id: int = Field(..., example=2)


#ログインで使用するスキーマ(パスワードとIDを受け取る)
class LoginSchema(BaseModel):
    user_cd: str = Field(..., example="260001")
    password: str = Field(..., example="password1")
    

#ログイン時に使うスキーマ（レスポンスでJWTを返す）
class TokenResponseSchema(BaseModel):
    message: str = Field(
        ...,
        example="ログインが正常に処理されました。"
    )
    access_token: str
    token_type: str

# リクエスト情報を表すスキーマ  passwordはレスポンスに含めないようにする！
class UserSchema(BaseModel):
    user_id: int = Field(..., example=1)
    user_cd: str = Field(..., example="260011")
    user_name: str = Field(..., example="山田太郎")
    department_id: int = Field(..., example=2)
    department_name: str = Field(..., example="購買部") #2は購買部
    

# ユーザー情報を表すスキーマ(複数)
class UserListSchema(BaseModel):
    users: List[UserSchema] #UserSchema が複数入ったリスト

#レスポンスで使用するスキーマ
class ResponseSchema(BaseModel):
    message: str = Field(..., 
                    description="API操作の結果を説明するメッセージ",
                    example="ユーザー情報が正常に更新されました。") 
        
