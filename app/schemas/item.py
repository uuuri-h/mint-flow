
# 品目コード
# 品名
# 型番
# メーカー

#== アイテムスキーマ ==

from pydantic import BaseModel, Field
from typing import List

# サプライヤー情報を表すスキーマ(1件)
class ItemSchema(BaseModel):
    item_id: int = Field(..., example=1)
    item_name: str = Field(..., example="台形スカート")
    item_part_no: str = Field(..., example="ITM26-0001")
    supplier_id: int = Field(..., example=1)
    

# サプライヤー情報を表すスキーマ(複数)
class ItemListSchema(BaseModel):
    items: List[ItemSchema] #ItemSchema が複数入ったリスト

#レスポンスで使用するスキーマ
class ResponseSchema(BaseModel):
    message: str = Field(..., 
                    description="API操作の結果を説明するメッセージ",
                    example="発注が正常に処理されました。") 