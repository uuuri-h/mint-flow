from datetime import datetime, timedelta, timezone
from typing import Annotated
import jwt #JWTライブラリをインポート


from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError

from fastapi.responses import JSONResponse
from pydantic import ValidationError

app = FastAPI()

items = {"foo": "The Foo Wrestlers"}


@app.get("/items/{item_id}")
async def read_item(item_id: str):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"item": items[item_id]}

from app.schemas.user import InsertAndUpdateUserSchema, UserSchema, UserListSchema, ResponseSchema as UserResponseSchema, LoginSchema, TokenResponseSchema
from app.schemas.item import ItemSchema, ItemListSchema
from app.schemas.customer import CustomerSchema, CustomerListSchema
from app.schemas.supplier import SupplierSchema, SupplierListSchema
from app.schemas.department import DepartmentSchema, DepartmentListSchema

from app.schemas.request import (
    RequestCreateSchema,
    UpdateRequestSchema,
    DeleteResultSchema,
    RequestResponseSchema,
    RequestListResponseSchema,
    ResponseSchema,
    RequestResultSchema
)

from fastapi.middleware.cors import CORSMiddleware

from app.cruds.user import get_user_by_cd, get_user_login_info, get_user_list
from app.cruds.department import get_dept_list
from app.cruds.supplier import get_supplier_list
from app.cruds.customer import get_customer_list
from app.cruds.item import get_item_list
from app.cruds.request import get_request_list, get_request_header, get_request_detail, create_request_data, update_request_data, delete_request_data

from fastapi import Depends
from sqlalchemy.orm import Session
from app.db import get_db


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ここではOAuth2PasswordBearerを使用して、トークンベースの認証を行うためのエンドポイントを定義しています。
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/login/" #JWTを取得するためのエンドポイントURLを指定 
)

#CORSの設定
origins = [
    "http://localhost:5173",  # フロントエンドのURLを指定 5173はViteのデフォルトポート
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)

# =================================================================
# 　ユーザー　
# =================================================================


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db),
):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="トークンの有効期限が切れています",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="無効なトークンです",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_cd: str = payload.get("sub")

    if user_cd is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ユーザーIDが見つかりません",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = get_user_by_cd(db, user_cd)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ユーザーが見つかりません",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user = get_user_by_cd(db, user_cd) 
    return user


@app.get("/user/users", response_model=UserListSchema)
def get_users(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    users = get_user_list(db, current_user)
    return users

#-- login　→ token発行　　→ クライアントがJWT保持　→ 毎回JWTを送信　
#ログイン(パスワードとIDを受け取る→トークンを返す)
@app.post("/login/", response_model=TokenResponseSchema)
def login(
    login_data: LoginSchema,
    db: Session = Depends(get_db)):
    
    # ユーザー情報を取得する関数を呼び出す
    user = get_user_login_info(db, login_data.user_cd) 
    
    # ユーザーの存在確認
    if not user:
        raise HTTPException(status_code=400, detail="ユーザーが見つかりません")
    
    # パスワードの検証
    if login_data.password != user.password:  
        raise HTTPException(
            status_code=400, 
            detail="パスワードが正しくありません"
        )
    
    #JWT作成
    access_token = create_access_token(
        data={"sub": user.user_cd} #JWTの中にuser_cdを入れている　subはトークンの持ち主を表す(JWT標準項目)
    )
    
    #JWTを返す(Reactへ返す)
    return TokenResponseSchema(
        message="ログインが正常に処理されました。",
        access_token=access_token,
        token_type="bearer"
    )


SECRET_KEY = "secret"
ALGORITHM = "HS256"


#JWTを作成する関数
def create_access_token(data: dict):

    to_encode = data.copy() #to_encode = dict(data)/ to_encode = {**data}

    expire = datetime.now(timezone.utc) + timedelta(minutes=480) #8時間後の時刻をつくる

    to_encode.update({"exp": expire})

    #JWT文字列の作成
    encoded_jwt = jwt.encode(
        to_encode, #JWTに入れるデータ
        SECRET_KEY, #JWTを署名するための秘密鍵（改竄されていない証明）
        algorithm=ALGORITHM #どうやって署名するか
    )

    return encoded_jwt


#ログイン後のトークン取得,ログイン済確認
@app.get("/users/me/")
async def get_user_me(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db)
    ): #Authorizationヘッダーから WT自動取得
    #JWTをデコードしてペイロードを取得 (payloadはJWTの中に入っているデータ (ユーザーIDなど)を表す)
    #oath2_schemeはAuthorizationヘッダーからJWTを自動的に取得してくれる　例: Authorization: Bearer <JWTトークン>

    return get_current_user(token, db)


# =================================================================
# 　依頼（詳細・ヘッダー）
# =================================================================

#依頼一覧取得(依頼一覧画面の取得用で使う)
@app.get("/requests/summaries", response_model=RequestListResponseSchema)   
def get_request_summaries_response(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):  
    return get_request_list(
        db,
        current_user, 
    )
    
#依頼の明細取得　(詳細画面の取得用で使う)
@app.get("/requests/{request_id}/details")
def get_request_comment(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    request_id: int = None,
):

    header = get_request_header(
        db,
        current_user,
        request_id,
    )

    details = get_request_detail (
        db,
        current_user,
        request_id,
    )
    # print(details)
    
    

    return {
        "header": header,
        "details": details
    }

# 依頼新規登録
@app.post("/requests/create", response_model=RequestResultSchema)
def create_request(
        request_data: RequestCreateSchema,
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
        
    ):
    
    result = create_request_data(
        db=db,
        request_data=request_data,
        requester_id=current_user.user_id,
    )
    
    header = result["header"]
    details = result["details"]

    return {
        "request_id": header.request_id,
        "message": "登録しました"
    }

# 依頼更新
@app.put("/requests/update/{request_id}", response_model=RequestResultSchema)
def update_request(
        request_data: UpdateRequestSchema,
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
        
    ):
        
    result = update_request_data(
        db=db,
        request_data=request_data,
        user_department_id=current_user.department_id,
    )
    
    header = result["header"]
    details = result["details"]

    return {
        "request_id": header.request_id,
        "message": "更新しました"
    }     

#依頼削除
@app.delete("/requests/delete/{request_id}", response_model=DeleteResultSchema)
def delete_request(
        db: Session = Depends(get_db),
        request_id: int = None,
        current_user = Depends(get_current_user)
        
    ):
    
    print("🐈")
    print(request_id)
    
    result = delete_request_data(
        db=db,
        request_id = request_id,
        requester_id=current_user.user_id,
    )

    return {
        "message": "削除しました"
    }    

# =================================================================
# 　マスタ
# =================================================================

#===アイテムのエンドポイント===
# アイテム情報取得

@app.get("/item/items", response_model=ItemListSchema)
def get_items(
    db: Session = Depends(get_db)  
):
    return get_item_list(db)
    
#===サプライヤー用のエンドポイント===
# サプライヤー情報取得
@app.get("/supplier/suppliers", response_model=SupplierListSchema)
def get_suppliers(
    db: Session = Depends(get_db)
):
    return get_supplier_list(db)

#===顧客用のエンドポイント===
# 顧客情報取得
@app.get("/customer/customers", response_model=CustomerListSchema)
def get_customers(
    db: Session = Depends(get_db)
):
    return get_customer_list(db)

#===サプライヤー用のエンドポイント===
# サプライヤー情報取得
@app.get("/supplier/suppliers", response_model=SupplierListSchema)
def get_suppliers(
    db: Session = Depends(get_db)
):
    return get_supplier_list(db)


#===部署用のエンドポイント===
# 部署情報取得
@app.get("/department/departments", response_model=DepartmentListSchema)
def get_departments(
    db: Session = Depends(get_db)
):
    return get_dept_list(db)

#バリデーションエラーのカスタムハンドラ
@app.exception_handler(ValidationError)
def validation_exception_handler(request : Request, ex : ValidationError):
    return JSONResponse(
        status_code=422,
        content={
                "details": ex.errors(),
        }
    )   



