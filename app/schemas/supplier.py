from pydantic import BaseModel, Field
from typing import List

# サプライヤー情報を表すスキーマ(1件)
class SupplierSchema(BaseModel):
    supplier_id: str = Field(..., example="0001")
    supplier_name: str = Field(..., example="ChocoMint")
    

# サプライヤー情報を表すスキーマ(複数)
class SupplierListSchema(BaseModel):
    suppliers: List[SupplierSchema] #SupplierSchema が複数入ったリスト

#レスポンスで使用するスキーマ
class ResponseSchema(BaseModel):
    message: str = Field(..., 
                    description="API操作の結果を説明するメッセージ",
                    example="発注が正常に処理されました。") 
    