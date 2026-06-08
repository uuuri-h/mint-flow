import React from 'react';
import axios from 'axios';
import './OrderList.css'
import { useOutletContext } from 'react-router-dom' //outletからcontextを受け取る
import NewOrderBtn from '../../my-component/Button/NewOrderBtn';
import OrderTable from "./OrderTable"

function OrderList() {
    const { user } = useOutletContext(); //contextからuserを取得


    return (
        <div className="pg-container order-list-container">
            <div className="pg-header order-list-header">
                <h1>発注依頼一覧</h1>
            </div>
            <NewOrderBtn user={user} />
            <OrderTable user={user} />
        </div>
    );
}


export default OrderList;