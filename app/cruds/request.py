
from sqlalchemy import select, func #funcはSQL関数を扱うためのモジュール
from sqlalchemy.orm import Session
import app.models.request as request_model
import app.models.department as department_model
import app.models.user as user_model
import app.models.customer as customer_model

from app.constants import DEPARTMENT

import app.schemas.request as request_schema

from app.cruds.user import get_user_by_cd

from sqlalchemy.orm import aliased #同じテーブルを2回以上結合する場合に必要

requester = aliased(user_model.Users)
assigner = aliased(user_model.Users)

# =================================================================
# CRUD処理　：　リクエスト　[ヘッダー]
# =================================================================

#ヘッダ表示　（一覧画面）
def get_request_list(
    db: Session, 
    current_user,
) -> request_schema.RequestListResponseSchema | None:
    
    """
    リクエストIDでリクエストヘッダを取得する関数
    :param db: DBセッション
    :param request_id: リクエストID 
    :return: リクエストヘッダ情報（Requestスキーマ）
    """

    # ユーザー情報を取得
    if current_user is None:
        return None
    

    # sqlを作成
    sql = (
        select(
            request_model.RequestHeader.request_id,
            request_model.RequestHeader.request_cd,
            request_model.RequestHeader.request_date,
            request_model.RequestHeader.assigner_id,
            request_model.RequestHeader.requester_id,
            request_model.RequestHeader.delivery_date,
            request_model.RequestHeader.header_status,
            request_model.RequestHeader.request_comment,

            customer_model.Customer.customer_id,
            customer_model.Customer.customer_name,

            requester.department_id.label("requester_dept_id"),
            assigner.department_id.label("assigner_dept_id"),
            
            
            func.count(request_model.RequestDetail.detail_id).label("item_count"),

            func.sum(
                request_model.RequestDetail.sales_price *
                request_model.RequestDetail.quantity
            ).label("sales_price_total"),

            func.sum(
                request_model.RequestDetail.cost_price *
                request_model.RequestDetail.quantity
            ).label("cost_price_total"),
        )
        .join(
            request_model.RequestDetail,
            request_model.RequestHeader.request_id == request_model.RequestDetail.request_id,
        )
        .join(
            customer_model.Customer,
            request_model.RequestHeader.customer_id == customer_model.Customer.customer_id,
        )
        .join(
            requester,
            request_model.RequestHeader.requester_id == requester.user_id,
        )
        .join(
            assigner,
            request_model.RequestHeader.assigner_id == assigner.user_id,
        )
        
        #グループ化して集計関数を使用するために必要↓
        .group_by(
            request_model.RequestHeader.request_id,
            request_model.RequestHeader.request_cd,
            request_model.RequestHeader.request_date,
            request_model.RequestHeader.assigner_id,
            request_model.RequestHeader.requester_id,
            request_model.RequestHeader.delivery_date,
            request_model.RequestHeader.header_status,
            request_model.RequestHeader.request_comment,
            customer_model.Customer.customer_id,
            customer_model.Customer.customer_name,
            requester.department_id,
            assigner.department_id,
        )
    )
    

    if current_user.department_id == DEPARTMENT.PURCHASE:
        # 購買なら自分宛
        sql = sql.where(
            request_model.RequestHeader.assigner_id == current_user.user_id
        )
    else:
        # 営業なら自分が作成した依頼
        sql = sql.where(
            request_model.RequestHeader.requester_id == current_user.user_id
        )
        

    #  SQLの実行
    result = db.execute(sql)
    
    # header = result.mappings().one_or_none()
    
    #複数件取得
    headers = result.mappings().all()

    if not headers:
        return request_schema.RequestListResponseSchema(
            requests=[]
    )
    
    header_list = [
        request_schema.RequestHeaderSchema.model_validate(h)
        for h in headers
    ]

    return request_schema.RequestListResponseSchema(
        requests=header_list
)

#ヘッダ表示　（詳細画面）
def get_request_header(
    db: Session, 
    current_user,
    request_id: int | None = None,
) -> request_schema.RequestHeaderSchema | None:
    """
    リクエストIDでリクエストヘッダを取得する関数
    :param db: DBセッション
    :param request_id: リクエストID 
    :return: リクエストヘッダ情報（Requestスキーマ）
    """

    # ユーザー情報を取得
    if current_user is None:
        return None
    

    # sqlを作成
    sql = (
        select(
            request_model.RequestHeader.request_id,
            request_model.RequestHeader.request_cd,
            request_model.RequestHeader.request_date,
            request_model.RequestHeader.assigner_id,
            request_model.RequestHeader.requester_id,
            request_model.RequestHeader.delivery_date,
            request_model.RequestHeader.header_status,
            request_model.RequestHeader.request_comment,

            customer_model.Customer.customer_id,
            customer_model.Customer.customer_name,

            requester.department_id.label("requester_dept_id"),
            assigner.department_id.label("assigner_dept_id"),
            
            
            func.count(request_model.RequestDetail.detail_id).label("item_count"),

            func.sum(
                request_model.RequestDetail.sales_price *
                request_model.RequestDetail.quantity
            ).label("sales_price_total"),

            func.sum(
                request_model.RequestDetail.cost_price *
                request_model.RequestDetail.quantity
            ).label("cost_price_total"),
        )
        .join(
            request_model.RequestDetail,
            request_model.RequestHeader.request_id == request_model.RequestDetail.request_id,
        )
        .join(
            customer_model.Customer,
            request_model.RequestHeader.customer_id == customer_model.Customer.customer_id,
        )
        .join(
            requester,
            request_model.RequestHeader.requester_id == requester.user_id,
        )
        .join(
            assigner,
            request_model.RequestHeader.assigner_id == assigner.user_id,
        )
        
        #グループ化して集計関数を使用するために必要↓
        .group_by(
            request_model.RequestHeader.request_id,
            request_model.RequestHeader.request_cd,
            request_model.RequestHeader.request_date,
            request_model.RequestHeader.assigner_id,
            request_model.RequestHeader.requester_id,
            request_model.RequestHeader.delivery_date,
            request_model.RequestHeader.header_status,
            request_model.RequestHeader.request_comment,
            customer_model.Customer.customer_id,
            customer_model.Customer.customer_name,
            requester.department_id,
            assigner.department_id,
        )
    )
    

    if current_user.department_id == DEPARTMENT.PURCHASE:
        # 購買なら自分宛
        sql = sql.where(
            request_model.RequestHeader.assigner_id == current_user.user_id
        )
    else:
        # 営業なら自分が作成した依頼
        sql = sql.where(
            request_model.RequestHeader.requester_id == current_user.user_id
        )
        
    if request_id is not None:
        sql = sql.where(
            request_model.RequestHeader.request_id == request_id
        )
        

    #  SQLの実行
    result = db.execute(sql)
    
    header = result.mappings().one_or_none()

    if header is None:
        return None

    return request_schema.RequestHeaderSchema.model_validate(header)



# =================================================================
# CRUD処理　：　リクエスト　[詳細]
# =================================================================

#詳細表示　

def get_request_detail(
    db: Session, 
    current_user,
    request_id: int | None = None,
) -> list[request_schema.RequestDetailSchema] | None:
    """
    リクエストIDでリクエスト詳細を取得する関数
    :param db: DBセッション
    :param request_id: リクエストID 
    :return: リクエスト詳細情報（RequestDetailスキーマ）
    """

    # ユーザー情報を取得
    if current_user is None:
        return None
    

    # sqlを作成
    sql = (
        select(
            request_model.RequestDetail.request_id,
            request_model.RequestDetail.detail_id,
            request_model.RequestDetail.item_id,
            request_model.RequestDetail.quantity,
            request_model.RequestDetail.sales_price,
            request_model.RequestDetail.cost_price,
            request_model.RequestDetail.supplier_id,
            request_model.RequestDetail.item_status,
        )
        .where(request_model.RequestDetail.request_id == request_id)
    )

    #  SQLの実行
    result = db.execute(sql)
    
    details = result.mappings().all()

    if not details:
        return []

    detail_list = [
        request_schema.RequestDetailSchema.model_validate(d)
        for d in details
    ]

    return detail_list
