from pydantic import BaseModel, Field
from typing import List

# 部署情報を表すスキーマ(1件)
class DepartmentSchema(BaseModel):
    department_id: int = Field(..., example=1)
    department_name: str = Field(..., example="ChocoMint")
    

# 部署情報を表すスキーマ(複数)
class DepartmentListSchema(BaseModel):
    departments: List[DepartmentSchema] #DepartmentSchema が複数入ったリスト

#レスポンスで使用するスキーマ
class ResponseSchema(BaseModel):
    message: str = Field(..., 
                    description="API操作の結果を説明するメッセージ",
                    example="発注が正常に処理されました。") 
    