//===============================================================
//共通関数のリストです
//===============================================================

import axios from 'axios';


//部署によって表示・非表示を切り替えるための関数
//

export function canShow(departmentId) {
    return userRole === departmentId;
}

