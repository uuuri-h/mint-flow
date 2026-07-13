
from sqlalchemy import select, func #funcはSQL関数を扱うためのモジュール
from sqlalchemy.orm import Session
import app.models.request as request_model
import app.models.department as department_model
import app.models.user as user_model
import app.models.customer as customer_model
from datetime import date

from fastapi import HTTPException


from app.constants import DEPARTMENT, STATUS, ITEM_STATUS, Action

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
        
        .order_by(request_model.RequestHeader.request_id.desc())
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
        .order_by(request_model.RequestDetail.detail_id)
        
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


#新規登録
def create_request_data(
    db: Session,
    request_data: request_schema.CreateRequestHeaderSchema,
    requester_id: int
):
    # リクエストヘッダーを作成
    header = request_model.RequestHeader(
        assigner_id=request_data.header.assigner_id,
        request_cd=create_request_cd(db),   # 採番
        customer_id=request_data.header.customer_id,
        request_comment=request_data.header.request_comment,
        delivery_date=request_data.header.delivery_date,
        requester_id=requester_id,
        request_date=date.today(),          # 今日
        header_status=STATUS.REQUESTING,    # 初期ステータス
    )
    
    db.add(header)
    db.flush()  # request_idだけ取得

    # リクエスト詳細を作成
    details = []
    for detail_data in request_data.details:
        detail = request_model.RequestDetail(
            request_id=header.request_id,
            item_id=detail_data.item_id,
            quantity=detail_data.quantity,
            sales_price=detail_data.sales_price,
            cost_price=detail_data.cost_price,
            supplier_id=detail_data.supplier_id,
            item_status=ITEM_STATUS.REQUESTING
        )
        db.add(detail)
        details.append(detail)
    db.commit()
    db.refresh(header)

    return {
        "header": header,
        "details" : details
    }


def create_request_cd(db: Session) -> str:
    """
    依頼コードを採番する関数
    :param db: DBセッション
    :return: 採番された依頼コード
    """
    # 現在の最大の依頼コードを取得
    max_request_cd = db.query(func.max(request_model.RequestHeader.request_cd)).scalar()

    if max_request_cd is None:
        # 依頼コードがまだ存在しない場合、初期値を設定
        new_request_cd = "REQ26-0001"
    else:
        # 最大の依頼コードから新しい依頼コードを生成
        prefix, number = max_request_cd.split('-')
        new_number = str(int(number) + 1).zfill(4)
        new_request_cd = f"{prefix}-{new_number}"
        

    return new_request_cd


def update_request_data(
    db: Session,
    request_data: request_schema.UpdateRequestSchema,
    user_department_id: int
):
    newHeader = request_data.header
    newDetail = request_data.details
    
    #　# 更新対象のリクエストヘッダーを取得
    currentData = db.query(request_model.RequestHeader).filter(
        request_model.RequestHeader.request_id == newHeader.request_id
    ).first()
    
    
    if currentData is None:
        raise HTTPException(status_code=404, detail="発注依頼が見つかりません")
    
    # リクエストヘッダーを更新
    if user_department_id != DEPARTMENT.PURCHASE :
        currentData.assigner_id=newHeader.assigner_id
        currentData.customer_id=newHeader.customer_id
        currentData.delivery_date=newHeader.delivery_date
        

    #備考
    currentData.request_comment=newHeader.request_comment

    if user_department_id != DEPARTMENT.PURCHASE :

        
        # 更新対象のリクエスト詳細を取得
        deleteDetails = db.query(request_model.RequestDetail).filter(
            request_model.RequestDetail.request_id == newHeader.request_id
        ).all()
        
        #リクエスト詳細を削除
        for detail in deleteDetails:
            db.delete(detail)   
            
        db.flush()
        
        # リクエスト詳細を作成
        details = []
        

        for detail_data in newDetail:
            
            #アイテムステータス
            if detail_data.item_status == ITEM_STATUS.COMPLETED:
                item_status = ITEM_STATUS.COMPLETED
            else:
                item_status = ITEM_STATUS.REQUESTING
                
            detail = request_model.RequestDetail(
                request_id=newHeader.request_id,
                item_id=detail_data.item_id,
                quantity=detail_data.quantity,
                sales_price=detail_data.sales_price,
                cost_price=detail_data.cost_price,
                supplier_id=detail_data.supplier_id,
                item_status=item_status,
            )
            db.add(detail)
            details.append(detail)

        db.flush()
        
        print("newDetail件数:", len(newDetail))

    else :
        
        for newDetailData in newDetail:
            currentDetail = db.query(request_model.RequestDetail).filter(
                request_model.RequestDetail.detail_id == newDetailData.detail_id
            ).first()
            
            if currentDetail is None:
                raise HTTPException(
                    status_code=404,
                    detail="発注依頼詳細が見つかりません"
                )

            currentDetail.quantity = newDetailData.quantity
            currentDetail.cost_price = newDetailData.cost_price
            currentDetail.supplier_id=newDetailData.supplier_id
            
            #ここでアイテムステータスを変更
            if newDetailData.isChecked :
                if request_data.action == Action.PURCHASE :
                    #更新ボタンの場合
                        currentDetail.item_status = ITEM_STATUS.COMPLETED
                elif request_data.action == Action.DELETE :
                    #削除ボタンの場合
                        currentDetail.item_status = ITEM_STATUS.REQUESTING
                        
        
    
    #---ヘッダーステータス更新---------------------------------------------------------￥
    
    
    #　更新する詳細データを取得
    updatedDetails = db.query(request_model.RequestDetail).filter(
        request_model.RequestDetail.request_id == newHeader.request_id
    ).all()
    
    requestCnt = len(updatedDetails)
    
    
    #条件に合う要素の件数を数える
    # sum(
    #     1 for 要素 in リスト
    #     if 条件
    # )
    completedCnt = sum(
        1 for detail in updatedDetails
        if detail.item_status == ITEM_STATUS.COMPLETED
    )
    
    print("requestCnt:", requestCnt)
    print("completedCnt:", completedCnt)

    for detail in updatedDetails:
        print(detail.detail_id, detail.item_status)
        
    #ヘッダーのステータスを更新する
    if requestCnt == 0:
        currentData.header_status = STATUS.REQUESTING
    elif completedCnt == requestCnt:
        currentData.header_status = STATUS.COMPLETED
    elif completedCnt > 0:
        currentData.header_status = STATUS.PARTIAL
    else:
        currentData.header_status = STATUS.REQUESTING
            
                
    db.commit()
    db.refresh(currentData)


    return {
        "header": currentData,
        "details" : updatedDetails
    }
    
    

# 発注依頼の取り消し（ヘッダーと明細を全て削除）
def delete_request_data (
    db : Session,
    request_id : int,
    requester_id : int
):
    
    #　削除する詳細データを取得
    deleteHeader = db.query(request_model.RequestHeader).filter(
        request_model.RequestHeader.request_id == request_id 
    ).first()
    
    #削除するリクエスト詳細を取得
    deleteDetails = db.query(request_model.RequestDetail).filter(
        request_model.RequestDetail.request_id == request_id
    ).all()
    
    
    #.all() は見つからないとき None ではなく空リスト [] を返す。
    # is None → 「値が None（存在しないことを表す特別な値）かどうか」だけを見る。
    # not → 「Pythonで False と判定される値かどうか」を見る。
    if deleteHeader is None or not deleteDetails:
        raise HTTPException(
            status_code=403,
            detail="削除するデータが見つかりません"
        )
    
    # ログインユーザーが依頼主の場合のみ削除可能
    if deleteHeader.requester_id != requester_id :
        raise HTTPException(
            status_code=404,
            detail="このデータは削除できません。"
        )
    
    #リクエスト詳細を削除
    for detail in deleteDetails:
        db.delete(detail)
    
    #リクエスト詳細をヘッダーを削除
    db.delete(deleteHeader)  
        
    db.commit()

    result = "依頼を削除しました。"

    return {
        "message": result
    }