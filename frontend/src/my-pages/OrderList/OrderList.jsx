import React from 'react';
import axios from 'axios';
import './OrderList.css'
import { useOutletContext } from 'react-router-dom' //outletからcontextを受け取る


function OrderList() {
    const { user } = useOutletContext(); //contextからuserを取得

    return (
        <div className="order-list-container">
            <div className="order-list-header">
                <h1>発注依頼一覧</h1>
            </div>
            <p>ここは依頼一覧です。</p>
            <p>ようこそ{user ? user.user_name : 'ゲスト'}さん</p>
        </div>
    );
}


export default OrderList;