import React from 'react';
import axios from 'axios';
import './OrderList.css'
import NewOrderBtn from '../../my-component/Button/NewOrderBtn';
import OrderTable from "./OrderTable"
import { DEPARTMENT } from "../../my-constants";

function OrderList({user}) {
    //{user}は分割代入（Destructuring）　{}がないとpropsに入ってるので、props.user;と書かないといけなくなる

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
            {! canShow(DEPARTMENT.PURCHASING) && <NewOrderBtn user={user}/>}
            <OrderTable user={user} />
        </div>
    );
}


export default OrderList;