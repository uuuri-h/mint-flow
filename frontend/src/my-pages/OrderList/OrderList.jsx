import React from 'react';
import axios from 'axios';
import './OrderList.css'
import { useOutletContext } from 'react-router-dom' //outletからcontextを受け取る
import NewOrderBtn from '../../my-component/Button/NewOrderBtn';
import OrderTable from "./OrderTable"
import { DEPARTMENT } from "../../my-constants";

function OrderList() {
    const { user } = useOutletContext(); //contextからuserを取得

    //営業部の場合はチェックボックスを非表示
    const userRole = user ? user.department_id : null; // ユーザーデータから役割を取得
    function canShow(departmentId) {
        return userRole === departmentId;
    }

    return (
        <div className="pg-container order-list-container">
            <div className="pg-header order-list-header">
                <h1>発注依頼一覧</h1>
            </div>
            {canShow(DEPARTMENT.SALES) && <NewOrderBtn user={user} />}
            <OrderTable user={user} />
        </div>
    );
}


export default OrderList;