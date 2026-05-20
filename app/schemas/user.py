from pydantic import BaseModel, Field
from datetime import date

# ===UserSchema定義===
# 登録・更新で使用するスキーマ
class InsertAndUpdateUserSchema(BaseModel):
    userid: str = Field(..., example="26011")
    user_name: str = Field(..., example="山田太郎")
    password: str = Field(..., example="Mint1234")


#ログインで使用するスキーマ(パスワードとIDを受け取る)
class LoginSchema(BaseModel):
    userid: str = Field(..., example="260011")
    password: str = Field(..., example="Mint1234")
    

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
    userid: str = Field(..., example="260011")
    user_name: str = Field(..., example="山田太郎")
    department_code: str = Field(..., example="001")
    department_name: str = Field(..., example="営業部")
    

#レスポンスで使用するスキーマ
class ResponseSchema(BaseModel):
    message: str = Field(..., 
                    description="API操作の結果を説明するメッセージ",
                    example="ユーザー情報が正常に更新されました。") 
        
