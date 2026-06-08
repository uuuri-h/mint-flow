import React from 'react'
import './OrderDetailForms.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
// RequestDetail.jsx
import { STATUS_MAP, STATUS_CLASS_MAP } from "../../my-constants";

function OrderDetailForms({
    user, 
    orderHeader, 
    setOrderHeader,
    status,
    setStatus,
}) {

    // const [status, setStatus] = useState(0);

    const [customer_list, setCustomerList] = useState([]);
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(
                    
                    `http://localhost:8000/customer/customers`
                );


                setCustomerList(response.data.customers)


            } catch (error) {
                console.error('顧客データの取得に失敗しました:', error);
            }
        };

        fetchCustomer();
    }, []); 

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
                            // value={order_header?.request_id || ''}
                            value={orderHeader.request_id}

                            readOnly

                        />
                    </div>

                    <div className="form-item request-status-container">
                        <p className="form-label" htmlFor="request-status">依頼ステータス:</p>
                        <div 
                            className={`status ${STATUS_CLASS_MAP[status]}`}
                        >
                            {STATUS_MAP[status]}
                        </div>
                    </div>

                    <div className="form-item request-date-container">
                        <label className="form-label" htmlFor="request-date">依頼日:</label>
                        <input 
                            className="form-input" 
                            type="date" 
                            id="request-date" 
                            style={{width: '150px'}}
                            name="request-date" 
                            // value={order_header?.request_date || ''}
                            value={orderHeader.request_date}
                            onChange={(e) =>
                                setOrderHeader({
                                    ...orderHeader,
                                    request_date: e.target.value
                                })
                            }
                        />
                    </div>

                    <div className="form-item customer-nm-container">
                    <label className="form-label" htmlFor="customer-nm">
                        顧客名:
                    </label>

                    <select
                        className="form-input"
                        id="customer-nm"
                        name="customer-nm"
                        value={orderHeader.customer_id}
                        onChange={(e) =>
                            setOrderHeader({
                                ...orderHeader,
                                customer_id: e.target.value
                            })
                        }
                    >
                        <option value="">選択してください</option>

                        {customer_list.map((customer) => (
                            <option
                                key={customer.customer_id}
                                value={customer.customer_id}
                            >
                                {customer.customer_name}
                            </option>
                        ))}
                    </select>
                </div>


                    <div className="form-item request-date-container">
                        <label className="form-label" htmlFor="delivery_date">納期:</label>
                        <input 
                            className="form-input" 
                            type="date" 
                            id="delivery_date" 
                            style={{width: '150px'}}
                            name="delivery_date" 
                            // value={order_header?.request_date || ''}
                            value={orderHeader.delivery_date}
                            onChange={(e) =>
                                setOrderHeader({
                                    ...orderHeader,
                                    delivery_date: e.target.value
                                })
                            }
                        />
                    </div>
 
                    <div className="form-item request-dept-container">
                        <label className="form-label" htmlFor="request-dept">依頼主部署:</label>
                        <input 
                            className="form-input" 
                            id="request-dept" 
                            name="request-dept" 
                            style={{width: '200px'}}
                            // value={order_header?.requester_dept_name || ''}
                            value={orderHeader.requester_dept_name}
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
                            value={orderHeader.requester_name}
                            // value={order_header?.requester_name || ''}
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
                            // value={order_header?.request_detail || ''}
                            style={{width: '100%', height: '80px'}}
                            value={orderHeader.request_detail}
                            onChange={(e) =>
                                setOrderHeader({
                                    ...orderHeader,
                                    request_detail: e.target.value
                                })
                            }
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