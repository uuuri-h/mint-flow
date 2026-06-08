from datetime import datetime, timedelta, timezone
from typing import Annotated
import jwt #JWTライブラリをインポート

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError

from fastapi.responses import JSONResponse
from pydantic import ValidationError
from app.schemas.user import InsertAndUpdateUserSchema, UserSchema, ResponseSchema as UserResponseSchema, LoginSchema, TokenResponseSchema
from app.schemas.request import RequestCreateSchema, RequestSchema, ResponseSchema as RequestResponseSchema, RequestDetailSchema, RequestListResponseSchema, RequestListItemSchema
from app.schemas.order import OrderCreateSchema, OrderSchema, ResponseSchema as OrderResponseSchema
from app.schemas.customer import CustomerSchema, CustomerListSchema

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

#仮のデータ（データーベースの代わり）
header_data=[
    RequestListItemSchema(
        request_id="REQ26-0001",
        request_date="2024-12-01",
        requester_name="山田太郎",
        requester_dept_name="営業部",
        item_count=5,
        status=1,
        total_amount=50000,
        customer_id="0001",
        customer_name="チョコミント株式会社",
        total_quantity=100,
        delivery_date="2024-12-31",
        request_detail="12月以降に出荷してください。"
    ),
    RequestListItemSchema(
        request_id="REQ26-0002",
        request_date="2024-12-05",
        requester_name="山田花子",
        requester_dept_name="製造部",
        item_count=3,
        status=2,
        total_amount=30000,
        customer_id="0002",
        customer_name="株式会社チョコレート",
        total_quantity=50,
        delivery_date="2025-01-15",
        request_detail="最短で納入お願いします。"
    )
]

detail_data = [
    RequestDetailSchema(
        request_id="REQ26-0001",
        item_id="ITM26-0001",
        item_num=1,
        item_partsnum="SK-12345",
        quantity=50,
        price=1000,
        supplier_id="0001",
        status=1,
        item_name="スカート",
    ),
    RequestDetailSchema(
        request_id="REQ26-0001",
        item_id="ITM26-0002",
        item_num=2,
        item_partsnum="SK-67890",
        quantity=50,
        price=2000,
        supplier_id="0002",
        status=2,
        item_name="スカート",
    ),
    RequestDetailSchema(
        request_id="REQ26-0002",
        item_id="ITM26-0003",
        item_num=1,
        item_partsnum="AB-11111",
        quantity=20,
        price=1500,
        supplier_id="0001",
        status=1,
        item_name="パンツ",
    ),
    RequestDetailSchema(
        request_id="REQ26-0002",
        item_id="ITM26-0004",
        item_num=2,
        item_partsnum="CD-22222",
        quantity=30,
        price=1000,
        supplier_id="0003",
        status=3,
        item_name="Tシャツ",
    )
]

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

# @app.get("/api/data")
# def read_data():
#     return {"message": "Hello from FastAPI!"}

#===ユーザー用のエンドポイント===

# ユーザー登録
@app.post("/users/", response_model=UserResponseSchema)
def create_user(user: InsertAndUpdateUserSchema):
    # ここでユーザー登録のロジックを実装
    return UserResponseSchema(message="ユーザー登録が正常に処理されました。")

# ユーザー更新
@app.put("/users/{user_id}", response_model=UserResponseSchema)
def update_user(user_id: str, user: InsertAndUpdateUserSchema):
    # ここでユーザー更新のロジックを実装
    return UserResponseSchema(message="ユーザー情報が正常に更新されました。")

# ユーザー情報取得
@app.get("/users/{user_id}", response_model=UserSchema)
def get_user(user_id: str):
    return UserSchema(
        userid=user_id,
        user_name="山田太郎",
        department_code="001",
        department_name="営業部",
        admin_flag=False
    )
    
#ユーザー認証
# def authenticate_user(fake_db, userid: str, password: str):
#     user = get_user(userid)  # ユーザー情報を取得する関数を呼び出す
#     if not user:
#         return False
#     if not verify_password(password, user.hashed_password):  # パスワードの検証（ここでは固定のパスワードを使用していますが、実際にはデータベースから取得したハッシュ化されたパスワードと比較する必要があります）
#         return False
#     return user

# def verify_password(
#     plain_password,
#     hashed_password
# ):
#     return plain_password == hashed_password


#-- login　→ token発行　　→ クライアントがJWT保持　→ 毎回JWTを送信　
#ログイン(パスワードとIDを受け取る→トークンを返す)
@app.post("/login/", response_model=TokenResponseSchema)
def login(login_data: LoginSchema):
    
    # ユーザーの存在確認
    user = get_user(login_data.userid)  # ユーザー情報を取得する関数を呼び出す
    
    if not user:
        raise HTTPException(status_code=400, detail="ユーザーが見つかりません")
    #if login_data.password != verify_password(login_data.password, user.hashed_password) :  # パスワードの検証（ここでは固定のパスワードを使用していますが、実際にはデータベースから取得したハッシュ化されたパスワードと比較する必要があります）
    if login_data.password != "Mint1234":  # パスワードの検証（ここでは固定のパスワードを使用していますが、実際にはデータベースから取得したハッシュ化されたパスワードと比較する必要があります）
        raise HTTPException(
            status_code=400, 
            detail="パスワードが正しくありません"
        )
    
    #JWT作成
    access_token = create_access_token(
        data={"sub": user.userid} #JWTの中にuseridを入れている　subはトークンの持ち主を表す(JWT標準項目)
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
async def get_user_me(token: Annotated[str, Depends(oauth2_scheme)]): #Authorizationヘッダーから WT自動取得
    #JWTをデコードしてペイロードを取得 (payloadはJWTの中に入っているデータ (ユーザーIDなど)を表す)
    #oath2_schemeはAuthorizationヘッダーからJWTを自動的に取得してくれる　例: Authorization: Bearer <JWTトークン>
    
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
    except jwt.ExpiredSignatureError: #JWTの有効期限が切れている場合の例外をキャッチ
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="トークンの有効期限が切れています",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except InvalidTokenError: #JWTのデコードに失敗した場合の例外をキャッチ
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="無効なトークンです",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    userid: str = payload.get("sub") #ペイロードからユーザーIDを取得　subはJWTの持ち主を表す(JWT標準項目)
    
    #useridが存在しない場合
    if userid is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ユーザーIDが見つかりません",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = get_user(userid) #ここでユーザー情報を取得する関数を呼び出すこともできる

    return user


#===依頼用のエンドポイント===
#依頼一覧取得(一覧画面の取得用で使う)
@app.get("/requests/summaries", response_model=RequestListResponseSchema)   
def get_request_summaries_response():  
    # ここで依頼一覧取得のロジックを実装
    return RequestListResponseSchema(
        requests= header_data
    )
    
#依頼の明細取得
@app.get("/requests/{request_id}/details")
def get_request_detail(request_id: str):

    header = next(
        (h for h in header_data if h.request_id == request_id),
        None
    )

    details = [
        d for d in detail_data
        if d.request_id == request_id
    ]

    return {
        "header": header,
        "details": details
    }

# 依頼登録
@app.post("/requests/", response_model=RequestResponseSchema)
def create_request(
        request_data: RequestCreateSchema
    ):
    # ここで依頼登録のロジックを実装
    return RequestResponseSchema(message="依頼登録が正常に処理されました。") 

# 依頼更新
@app.put("/requests/{request_id}", response_model=RequestResponseSchema)
def update_request(
        request_id: str, 
        request_data: RequestCreateSchema
    ):
    # ここで依頼更新のロジックを実装
    return RequestResponseSchema(message="依頼情報が正常に更新されました。")    

# 依頼情報取得
@app.get("/requests/{request_id}", response_model=RequestSchema)
def get_request(request_id: str):
    # ここで依頼情報取得のロジックを実装
    return RequestSchema(request_id=request_id, request_userid=26011, client_name="ABC株式会社", deadline="2024-12-31", priority=1)     

#依頼削除
@app.delete("/requests/{request_id}", response_model=RequestResponseSchema)
def delete_request(request_id: str):
    # ここで依頼削除のロジックを実装
    return RequestResponseSchema(message="依頼が正常に削除されました。")


#依頼一覧取得(詳細画面の取得用で使う)
@app.get("/requests/", response_model=list[RequestListItemSchema])
def get_request_list():
    # ここで依頼一覧取得のロジックを実装
    return header_data

#依頼詳細取得(詳細画面の取得用で使う)
@app.get("/requests/{request_id}/details", response_model=RequestListResponseSchema)
def get_request_details(request_id: str):  
    # ここで依頼詳細取得のロジックを実装
    requests=header_data

    
    for request in requests :
        if request.request_id == request_id :
            #Pydanticのモデルは引数名付きで渡す必要がある。
            return RequestListResponseSchema(
                requests =  [request]        
            )
    
#依頼詳細取得(一覧画面の取得用で使う)
@app.get("/requests/{request_id}/summary", response_model=RequestListItemSchema)
def get_request_summary(request_id: str):  
    # ここで依頼一覧取得のロジックを実装
    return header_data
    



#依頼一覧取得(一覧画面の取得用で使う)
@app.get("/requests/summary", response_model=list[RequestListItemSchema])
def get_request_summaries():  
    # ここで依頼一覧取得のロジックを実装
    return header_data



#===発注用のエンドポイント===
# 発注登録
@app.post("/orders/", response_model=OrderResponseSchema)
def create_order(
        order_data: OrderCreateSchema
    ):
    # ここで発注登録のロジックを実装
    return OrderResponseSchema(message="発注が正常に処理されました。")    

# 発注更新
@app.put("/orders/{order_id}", response_model=OrderResponseSchema)
def update_order(
        order_id: str, 
        order_data: OrderCreateSchema
    ):
    # ここで発注更新のロジックを実装
    return OrderResponseSchema(message="発注情報が正常に更新されました。") 

# 発注情報取得
@app.get("/orders/{order_id}", response_model=OrderSchema)
def get_order(order_id: str):
    # ここで発注情報取得のロジックを実装
    return OrderSchema(order_id=order_id, order_userid=26011, order_date="2024-12-31")  



#===顧客用のエンドポイント===
# 顧客情報取得

@app.get("/customer/customers", response_model=CustomerListSchema)
def get_customers():
    return CustomerListSchema(
        customers=[
            CustomerSchema(
                customer_id="0001",
                customer_name="チョコミント株式会社",
            ),
            CustomerSchema(
                customer_id="0002",
                customer_name="株式会社チョコレート",
            ),
            CustomerSchema(
                customer_id="0003",
                customer_name="ミント株式会社",
            )
        ]
    )

@app.get("/customer/{customer_id}", response_model=CustomerSchema)
def get_customer(customer_id: str):
    return CustomerSchema(
        customer_id=customer_id,
        customer_name="チョコミント株式会社",
    )
    


#バリデーションエラーのカスタムハンドラ
@app.exception_handler(ValidationError)
def validation_exception_handler(request : Request, ex : ValidationError):
    return JSONResponse(
        status_code=422,
        content={
                "details": ex.errors(),
        }
    )   



