# app/constants/constants.py
from enum import Enum

# ===========================
# ヘッダステータス
# ===========================

class STATUS:
    NEW_REQUEST = 0
    REQUESTING = 1
    PARTIAL = 2
    COMPLETED = 3
    CANCELLED = 99


STATUS_MAP = {
    STATUS.NEW_REQUEST: "新規依頼",
    STATUS.REQUESTING: "依頼中",
    STATUS.PARTIAL: "一部発注済み",
    STATUS.COMPLETED: "発注済み",
    STATUS.CANCELLED: "キャンセル",
}

# ===========================
# 明細ステータス
# ===========================

class ITEM_STATUS:
    NEW_REQUEST = 0
    REQUESTING = 1
    COMPLETED = 3


ITEM_STATUS_MAP = {
    ITEM_STATUS.NEW_REQUEST: "新規",
    ITEM_STATUS.REQUESTING: "未発注",
    ITEM_STATUS.COMPLETED: "発注済",
}

# ===========================
# 部署
# ===========================

class DEPARTMENT:
    ADMIN = 1
    PURCHASE = 2
    SALES = 3
    MANUFACTURER = 4
    

# ===========================
# アクション
# ===========================
class Action(str, Enum):
    REQUEST = "request"
    PURCHASE = "purchase"
    DELETE = "delete"