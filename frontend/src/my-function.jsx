//===============================================================
//共通関数のリストです！
//===============================================================

import axios from 'axios';

//アイテムを取得（リスト用）
// export async function fetchListItem (
//     end_point="", //FastApiエンドポイント指定
//     respond_data_nm, //returnされるものの名前
// ){
//     try {
//         const response = await axios.get(
            
//             // `http://localhost:8000/customer/customers`
//             `http://localhost:8000/`+end_point
//         );


//         return (response.data[respond_data_nm])


//     } catch (error) {
//         console.error('顧客データの取得に失敗しました:', error);
//         return[];
//     }
// }