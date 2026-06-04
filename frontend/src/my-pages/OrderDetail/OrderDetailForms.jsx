import React from 'react'
import './OrderDetailForms.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

function OrderDetailForms({}) {
    const [status, setStatus] = useState(0);
    const statusMap = {
        0: '新規依頼',
        1: '依頼中',
        2: '一部発注済み',
        3: '発注済み',
        99: 'キャンセル'
    };

    const statusClassMap = {
        0: 'new-request',
        1: 'requesting',
        2: 'partial',
        3: 'completed',
        99: 'cancelled'
    };

    const request_id = "REQ26-0001" //あとで編集ボタンからもらう
    const [order_header, setOrder] = useState(null);
    useEffect(() => {
        // ここでAPIから発注データを取得して状態に保存する処理を実装
        const fetchOrder = async () => {
            try {
                const response = await axios.get(
                    
                    `http://localhost:8000/requests/${request_id}/details`
                );
                console.log('response.data.requests:', response.data.requests[0])

                setOrder(response.data.requests[0])
                setStatus(response.data.requests[0].status)

            } catch (error) {
                console.error('発注依頼データの取得に失敗しました:', error);
            }
        };

        fetchOrder();
    }, []); 

    // const [customer_list, setCustomerList] = useState([]);
    // useEffect(() => {
    //     const fetchCustomer = async () => {
    //         try {
    //             const response = await axios.get(
                    
    //                 `http://localhost:8000/customer/customers`
    //             );
    //             console.log('部署リスト', response.data.customers)

    //             setCustomerList(response.data.customers)

    //         } catch (error) {
    //             console.error('部署データの取得に失敗しました:', error);
    //         }
    //     };

    //     fetchCustomer();
    // }, []); 

    return (
        <div className="order-detail-forms-container">
            <div className="order-detail-forms">
                {/* ここに発注依頼の詳細フォームを実装する */ }
                <form className="order-detail-form">

                    <div className="form-item request-id-container">
                        <label className="form-label" htmlFor="request-id">依頼ID:</label>
                        <input 
                            className="form-input" 
                            type="text" 
                            id="request-id" 
                            name="request-id" 
                            style={{width: '150px'}}
                            readOnly 
                            value={order_header?.request_id || ''}

                        />
                    </div>

                    <div className="form-item customer-nm-container">
                        <label className="form-label"  htmlFor="customer-nm">顧客名:</label>
                        <input 
                            className="form-input" 
                            type="text" 
                            id="customer-nm" 
                            style={{width: '200px'}}
                            name="customer-nm"
                            value={order_header?.customer_name || ''}                  
                            />
                    </div>

                    <div className="form-item request-date-container">
                        <label className="form-label" htmlFor="request-date">納期:</label>
                        <input 
                            className="form-input" 
                            type="date" 
                            id="request-date" 
                            style={{width: '150px'}}
                            name="request-date" 
                            value={order_header?.request_date || ''}
                        />
                    </div>

                    <div className="form-item request-status-container">
                        <label className="form-label" htmlFor="request-status">依頼ステータス:</label>
                        <div 
                            className={`status ${statusClassMap[status]}`}
                        >
                            {statusMap[status]}
                        </div>
                    </div>
 
                    <div className="form-item request-dept-container">
                        <label className="form-label" htmlFor="request-dept">依頼主部署:</label>
                        <input 
                            className="form-input" 
                            id="request-dept" 
                            name="request-dept" 
                            style={{width: '200px'}}
                            value={order_header?.requester_dept_name || ''}
                            
                            readOnly 
                        />
                    </div>

                    <div className="form-item requester-nm-container">
                        <label className="form-label" htmlFor="requester-nm">依頼主:</label>
                        <input 
                            className="form-input" 
                            type="text" 
                            id="requester-nm" 
                            style={{width: '150px'}}
                            name="requester-nm" 
                            value={order_header?.requester_name || ''}
                            readOnly
                            // value={order_header.requester || ''}
                        />
                    </div>


                    <div className="form-item request-remarks-container">
                        <label className="form-label" htmlFor="request-remarks">備考:</label>
                        <textarea 
                            className="form-textarea" 
                            id="request-remarks" 
                            name="request-remarks"
                            value={order_header?.request_detail || ''}
                            style={{width: '100%', height: '80px'}}
                        >
                        </textarea>
                    </div>

                     {/* ここに必要なフォームフィールドを追加する */ }
                </form>
            </div>
        </div>
    )
}

export default OrderDetailForms