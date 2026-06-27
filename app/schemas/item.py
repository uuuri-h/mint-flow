
# 品目コード
# 品名
# 型番
# メーカー

#== アイテムスキーマ ==

from pydantic import BaseModel, Field
from typing import List

# item情報を表すスキーマ(1件)
class ItemSchema(BaseModel):
    item_id: int = Field(..., example=1)
    
    item_cd: str = Field(..., example="ITM26-0001") #これは型番
    item_name: str = Field(..., example="台形スカート")
    
    maker_name: str = Field(..., example="ABC社")  # メーカー

    
    sales_price: int = Field(..., example=1000)
    cost_price: float = Field(..., example=5.5)
    

# item情報を表すスキーマ(複数)
class ItemListSchema(BaseModel):
    items: List[ItemSchema] #ItemSchema が複数入ったリスト

#レスポンスで使用するスキーマ
class ResponseSchema(BaseModel):
    message: str = Field(..., 
                    description="API操作の結果を説明するメッセージ",
                    example="発注が正常に処理されました。") 