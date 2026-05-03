from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from .schemas.user import InsertAndUpdateUserSchema, UserSchema, ResponseSchema, LoginSchema
from .schemas.request import InsertAndUpdateRequestSchema, InsertAndUpdateRequestDetailSchema, RequestSchema, ResponseSchema as RequestResponseSchema
from .schemas.order import InsertAndUpdateOrderSchema, InsertAndUpdateOrderDetailSchema, OrderSchema, ResponseSchema as Order

app = FastAPI()

#===ユーザー用のエンドポイント===

# ユーザー登録
@app.post("/users/", response_model=ResponseSchema)
def create_user(user: InsertAndUpdateUserSchema):
    # ここでユーザー登録のロジックを実装
    return ResponseSchema(message="ユーザー登録が正常に処理されました。")

# ユーザー更新
@app.put("/users/{user_id}", response_model=ResponseSchema)
def update_user(user_id: str, user: InsertAndUpdateUserSchema):
    # ここでユーザー更新のロジックを実装
    return ResponseSchema(message="ユーザー情報が正常に更新されました。")

#ユーザー情報取得
@app.get("/users/{user_id}", response_model=UserSchema)
def get_user(user_id: str):
    # ここでユーザー情報取得のロジックを実装
    return UserSchema(userid=user_id, user_name="山田太郎", department_code=1)  

#ログイン
@app.post("/login/", response_model=ResponseSchema)
def login(login_data: LoginSchema):
    # ここでログインのロジックを実装
    return ResponseSchema(message="ログインが正常に処理されました。")   

#===依頼用のエンドポイント===
# 依頼登録
@app.post("/requests/", response_model=RequestResponseSchema)
def create_request(
        header: InsertAndUpdateRequestSchema,
        detail: list[InsertAndUpdateRequestDetailSchema]
    ):
    # ここで依頼登録のロジックを実装
    return RequestResponseSchema(message="依頼登録が正常に処理されました。") 

# 依頼更新
@app.put("/requests/{request_id}", response_model=RequestResponseSchema)
def update_request(
        request_id: str, 
        header: InsertAndUpdateRequestSchema,
        detail: list[InsertAndUpdateRequestDetailSchema]
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

#===発注用のエンドポイント===
# 発注登録
@app.post("/orders/", response_model=Order)
def create_order(
        header: InsertAndUpdateOrderSchema,
        detail: list[InsertAndUpdateOrderDetailSchema]
    ):
    # ここで発注登録のロジックを実装
    return Order(message="発注が正常に処理されました。")    

# 発注更新
@app.put("/orders/{order_id}", response_model=Order)
def update_order(
        order_id: str, 
        header: InsertAndUpdateOrderSchema, 
        detail: list[InsertAndUpdateOrderDetailSchema]
    ):
    # ここで発注更新のロジックを実装
    return Order(message="発注情報が正常に更新されました。") 

# 発注情報取得
@app.get("/orders/{order_id}", response_model=OrderSchema)
def get_order(order_id: str):
    # ここで発注情報取得のロジックを実装
    return OrderSchema(order_id=order_id, order_userid=26011, order_date="2024-12-31")  

#バリデーションエラーのカスタムハンドラ
@app.exception_handler(ValidationError)
def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
                "details": exc.errors(),
                "body": exc.model()
        }
    )   

