import React from 'react'
import './OrderDetailTable.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
// RequestDetail.jsx
import { STATUS_MAP, STATUS_CLASS_MAP } from "../../my-constants";


function OrderDetailTable({user}) {

    //営業部の場合はチェックボックスを非表示
    const [showCheckBox, setShowCheckBox] = useState(true);
    const[showOrderBtn, setShowOrderBtn] = useState(true);
    const [orders, setOrders] = useState([]);
    // console.log("OrderTable user:", user); 
    useEffect(() => {
        const userRole = user ? user.department_code : null; // ユーザーデータから役割を取得
        if (userRole === '001') { // 営業部のコードに応じて条件を設定
            console.log("ds" + user);
            setShowCheckBox(false);
            setShowOrderBtn(false);
        } else {
            console.log("ds" + user);
            setShowCheckBox(true);
            setShowOrderBtn(true);
        }
    }, [user]); // userが変更されたときに実行される, これがないと、ユーザーデータが更新されてもチェックボックスの表示が変わらない
    if (showCheckBox === false) {
        // console.log("営業部のユーザーのため、チェックボックスは非表示です。");
        
    }


    return (
        <div className='detail-table-wrapper'>
            <div className='detail-table-container'>
                <table className='detail-table'>
                    <thead>
                        <tr 
                        >
                            {showCheckBox && <th className='th1'></th>}
                            <th className='th2'>型番</th>
                            <th className='th3'>アイテム名</th>
                            <th className='th4'>数量</th>
                            <th className='th5'>金額</th>
                            <th className='th6'>合計金額</th>
                            <th className='th7'>仕入先</th>
                            <th className='th9'>発注ステータス</th>
                            <th className='th10'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* ここに発注データをマッピングして表示 */}
                        {orders.map((order) => (
                            <tr key={order.request_id}>
                                {/* 営業部のユーザーの場合はチェックボックスを非表示にする */}
                                {showCheckBox && (
                                    <td className="td1"><input type="checkbox" className="check-box" disabled={!showCheckBox} /></td>
                                )}
                                <td className="td2">{order.request_date}</td>
                                <td className="td3">{order.request_id}</td>
                                <td className="td4">{order.customer_name}</td>
                                <td className="td5">{order.item_count}</td>
                                <td className="td6">￥{order.total_amount}</td>
                                <td className="td7">{order.delivery_date}</td>
                                <td className="td9">
                                    {/* <span className={`status ${STATUS_CLASS_MAP[order.status]}`}>
                                        {STATUS_MAP[order.status]}
                                    </span> */}
                                </td>
                                <td className="td10">
                                    <button 
                                        className="button btn btn-primary"
                                        // onClick={() => requestEdit(order.request_id)}
                                        type="submit"
                                    >
                                     {/* onClick={() => requestEdit(request.request_id)}　 */}
                                        編集
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    )
}

export default OrderDetailTable