import React from 'react';
import axios from 'axios';
import './OrderList.css'
import { useOutletContext } from 'react-router-dom' //outletからcontextを受け取る
import NewOrderbtn from './NewOrderbtn';'./NewOrderbtn';

import OrderTable from "./OrderTable"

function OrderList() {
    const { user } = useOutletContext(); //contextからuserを取得

    return (
        <div className="order-list-container">
            <div className="order-list-header">
                <h1>発注依頼一覧</h1>
            </div>
            <NewOrderbtn />
            <OrderTable />
        </div>
    );
}


export default OrderList;