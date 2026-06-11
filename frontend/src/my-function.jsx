//===============================================================
//共通関数のリストです！
//===============================================================

import React from 'react';


export default function fetchListItem (
    list_holder, //更新対象リスト
    end_point="", //FastApiエンドポイント指定
    respond_data_nm, //returnされるものの名前
){
    const [customer_list, setCustomerList] = useState([]);
    useEffect(() => {
        const fetchListItem = async () => {
            try {
                const response = await axios.get(
                    
                    // `http://localhost:8000/customer/customers`
                    `http://localhost:8000/`+end_point
                );


                setCustomerList(response.data.respond_data_nm)


            } catch (error) {
                console.error('顧客データの取得に失敗しました:', error);
            }
        };

        fetchListItem();
    }, []); 
};