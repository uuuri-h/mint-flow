from datetime import datetime, timedelta, timezone
from typing import Annotated
import jwt #JWTライブラリをインポート

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError

from fastapi.responses import JSONResponse
from pydantic import ValidationError
from app.schemas.user import InsertAndUpdateUserSchema, UserSchema, UserListSchema, ResponseSchema as UserResponseSchema, LoginSchema, TokenResponseSchema
from app.schemas.request import RequestCreateSchema, RequestSchema, ResponseSchema as RequestResponseSchema, RequestDetailSchema, RequestListResponseSchema, RequestListItemSchema
from app.schemas.item import ItemSchema, ItemListSchema
from app.schemas.customer import CustomerSchema, CustomerListSchema
from app.schemas.supplier import SupplierSchema, SupplierListSchema
from app.schemas.department import DepartmentSchema, DepartmentListSchema

from fastapi.middleware.cors import CORSMiddleware


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

#仮のデータ（データーベースの代わり）
header_data=[
    RequestListItemSchema(
        request_cd="REQ26-0001",
        request_date="2024-12-01",
        assigner_id=2,
        assigner_dept_id=2,
        requester_id=1,
        requester_dept_id=1,
        item_count=2,
        header_status=1,
        sales_price_total=50000,
        cost_price_total =200,
        customer_id=1,\
        customer_name="チョコミント株式会社",
        delivery_date="2024-12-31",
        request_detail="12月以降に出荷してください。"
    ),
    RequestListItemSchema(
        request_cd="REQ26-0002",
        request_date="2024-12-05",
        assigner_id=2,
        assigner_dept_id=2,
        requester_id=1,
        requester_dept_id=1,
        item_count=3,
        header_status=2,
        sales_price_total=30000,
        cost_price_total =400,
        customer_id=1,
        customer_name="株式会社チョコレート",
        delivery_date="2025-01-15",
        request_detail="最短で納入お願いします。"
    )
]

detail_data = [
    RequestDetailSchema(
        request_cd="REQ26-0001",
        detail_id = 1,
        item_id=3,
        quantity=50,
        sales_price=1000,
        cost_price=5.2,
        supplier_id=1,
        item_status=1,
    ),
    RequestDetailSchema(
        request_cd="REQ26-0001",
        detail_id = 2,
        item_id=2,
        quantity=50,
        sales_price=2000,
        cost_price=10,
        supplier_id=1,
        item_status=1,
    ),
    RequestDetailSchema(
        request_cd="REQ26-0002",
        detail_id = 1,
        item_id=1,
        quantity=20,
        sales_price=1500,
        cost_price=10.2,
        supplier_id=1,
        item_status=1,
    ),
    RequestDetailSchema(
        request_cd="REQ26-0002",
        detail_id = 2,
        item_id=2,
        quantity=30,
        sales_price=1000,
        cost_price=5.1,
        supplier_id=1,
        item_status=3,
    ),
    RequestDetailSchema(
        request_cd="REQ26-0002",
        detail_id = 3,
        item_id= 3,
        quantity=12,
        sales_price=20000,
        cost_price=175,
        supplier_id=1,
        item_status=1,
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
        user_id =1,
        user_cd=user_id, #あとでフロントをcdに直す
        user_name="山田太郎",
        department_id=1,
        department_name="営業部",
    )
    
@app.get("/user/users", response_model=UserListSchema)
def get_departments():
    return UserListSchema(
        users=[
            UserSchema(
                user_id=1,
                user_cd = "260011",
                user_name ="山田太郎",
                department_id = 1,
                department_name = "営業",
            ),
            UserSchema(
                user_id=2,
                user_cd = "260022",
                user_name ="山田花子",
                department_id = 2,
                department_name = "購買",
            ),
            UserSchema(
                user_id=3,
                user_cd = "260033",
                user_name ="猫飼ねこ",
                department_id = 3,
                department_name = "製造",
            ),
            UserSchema(
                user_id=4,
                user_cd = "260012",
                user_name ="犬飼いぬ",
                department_id = 3,
                department_name = "営業",
            )
        ]
    )

#-- login　→ token発行　　→ クライアントがJWT保持　→ 毎回JWTを送信　
#ログイン(パスワードとIDを受け取る→トークンを返す)
@app.post("/login/", response_model=TokenResponseSchema)
def login(login_data: LoginSchema):
    
    # ユーザーの存在確認
    user = get_user(login_data.user_cd)  # ユーザー情報を取得する関数を呼び出す
    
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
    
    user_cd: str = payload.get("sub") #ペイロードからユーザーIDを取得　subはJWTの持ち主を表す(JWT標準項目)
    
    #user_cdが存在しない場合
    if user_cd is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ユーザーIDが見つかりません",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = get_user(user_cd) #ここでユーザー情報を取得する関数を呼び出すこともできる

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
@app.get("/requests/{request_cd}/details")
def get_request_detail(request_cd: str):

    header = next(
        (h for h in header_data if h.request_cd == request_cd),
        None
    )

    details = [
        d for d in detail_data
        if d.request_cd == request_cd
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
@app.put("/requests/{request_cd}", response_model=RequestResponseSchema)
def update_request(
        request_cd: str, 
        request_data: RequestCreateSchema
    ):
    # ここで依頼更新のロジックを実装
    return RequestResponseSchema(message="依頼情報が正常に更新されました。")    

# 依頼情報取得
@app.get("/requests/{request_cd}", response_model=RequestSchema)
def get_request(request_cd: str):
    # ここで依頼情報取得のロジックを実装
    return RequestSchema(request_cd=request_cd, request_user_cd=26011, client_name="ABC株式会社", deadline="2024-12-31", priority=1)     

#依頼削除
@app.delete("/requests/{request_cd}", response_model=RequestResponseSchema)
def delete_request(request_cd: str):
    # ここで依頼削除のロジックを実装
    return RequestResponseSchema(message="依頼が正常に削除されました。")


#依頼一覧取得(詳細画面の取得用で使う)
@app.get("/requests/", response_model=list[RequestListItemSchema])
def get_request_list():
    # ここで依頼一覧取得のロジックを実装
    return header_data

#依頼詳細取得(詳細画面の取得用で使う)
@app.get("/requests/{request_cd}/details", response_model=RequestListResponseSchema)
def get_request_details(request_cd: str):  
    # ここで依頼詳細取得のロジックを実装
    requests=header_data

    
    for request in requests :
        if request.request_cd == request_cd :
            #Pydanticのモデルは引数名付きで渡す必要がある。
            return RequestListResponseSchema(
                requests =  [request]        
            )
    
#依頼詳細取得(一覧画面の取得用で使う)
@app.get("/requests/{request_cd}/summary", response_model=RequestListItemSchema)
def get_request_summary(request_cd: str):  
    # ここで依頼一覧取得のロジックを実装
    return header_data
    



#依頼一覧取得(一覧画面の取得用で使う)
@app.get("/requests/summary", response_model=list[RequestListItemSchema])
def get_request_summaries():  
    # ここで依頼一覧取得のロジックを実装
    return header_data


#===アイテムのエンドポイント===
# アイテム情報取得

@app.get("/item/items", response_model=ItemListSchema)
def get_items():
    return ItemListSchema(
        items=[
            ItemSchema(
                item_id=1,
                item_cd="SKT-001",
                item_name="台形スカート",
                maker_name="Mille Fleur",
                sales_price=4980,
                cost_price=12.5,
            ),
            ItemSchema(
                item_id=2,
                item_cd="BLS-002",
                item_name="レースブラウス",
                maker_name="Rose Garden",
                sales_price=3980,
                cost_price=8.7,
            ),
            ItemSchema(
                item_id=3,
                item_cd="OP-003",
                item_name="花柄ワンピース",
                maker_name="Lily Closet",
                sales_price=7980,
                cost_price=18.2,
            ),
        ]
    )

# @app.get("/customer/{customer_id}", response_model=ItemSchema)
# def get_customer(customer_id: str):
#     return ItemSchema(
#         item_id=3,
#         item_cd="OP-003",
#         item_name="花柄ワンピース",
#         maker_name="Lily Closet",
#         supplier_id=1,
#         sales_price=7980,
#         cost_price=18.2,
            
#     )
    



#===顧客用のエンドポイント===
# 顧客情報取得

@app.get("/customer/customers", response_model=CustomerListSchema)
def get_customers():
    return CustomerListSchema(
        customers=[
            CustomerSchema(
                customer_id=1,
                customer_name="チョコミント株式会社",
            ),
            CustomerSchema(
                customer_id=2,
                customer_name="株式会社チョコレート",
            ),
            CustomerSchema(
                customer_id=3,
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
    


@app.get("/supplier/suppliers", response_model=SupplierListSchema)
def get_suppliers():
    return SupplierListSchema(
        suppliers=[
            SupplierSchema(
                supplier_id=0,
                supplier_name="未選択",
            ),
            SupplierSchema(
                supplier_id=1,
                supplier_name="ChocoMint",
            ),
            SupplierSchema(
                supplier_id=2,
                supplier_name="Chocolate",
            ),
            SupplierSchema(
                supplier_id=3,
                supplier_name="MINT",
            )
        ]
    )

@app.get("/supplier/{supplier_id}", response_model=SupplierSchema)
def get_supplier(supplier_id: str):
    return SupplierSchema(
        supplier_id=supplier_id,
        supplier_name="ChocoMint",
    )
    
    

@app.get("/department/departments", response_model=DepartmentListSchema)
def get_departments():
    return DepartmentListSchema(
        departments=[
            DepartmentSchema(
                department_id=0,
                department_name="管理者",
            ),
            DepartmentSchema(
                department_id=1,
                department_name="営業",
            ),
            DepartmentSchema(
                department_id=2,
                department_name="購買",
            ),
            DepartmentSchema(
                department_id=3,
                department_name="製造",
            )
        ]
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



