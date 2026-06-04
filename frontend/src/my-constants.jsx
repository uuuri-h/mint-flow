// src/my-constants.js
// import { STATUS_MAP, STATUS_CLASS_MAP } from "../../my-constants";
//EXAMPLE_CONSTANTS みたいに書く事！！！！

export const STATUS_MAP = {
    0: '新規依頼',
    1: '依頼中',
    2: '一部発注済み',
    3: '発注済み',
    99: 'キャンセル'
};

export const STATUS_CLASS_MAP = {
    0: 'new-request',
    1: 'requesting',
    2: 'partial',
    3: 'completed',
    99: 'cancelled'
    };

// export const SCREEN_MODE = {
//     CREATE: "create",
//     EDIT: "edit",
//     DETAIL: "detail",
// };

// export const MESSAGE = {
//     SAVE_SUCCESS: "登録しました",
//     UPDATE_SUCCESS: "更新しました",
// };

export const API_URL = "http://localhost:8000";