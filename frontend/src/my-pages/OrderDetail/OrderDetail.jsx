import React from "react";
import "./OrderDetail.css";
import OrderDetailForms from "./OrderDetailForms";
import OrderDetailTable from "./OrderDetailTable";
import { useLocation } from 'react-router-dom';

function OrderDetail({ user }) {
  const location = useLocation();
  const {id} = location.state || {}; 

  return (
    <div className="pg-container order-detail-container">
      <div className="pg-header order-detail-header">
        <h1>発注依頼詳細</h1>
      </div>
      <div className="order-detail-body">
        <OrderDetailForms user={user} id={id}/>
        <OrderDetailTable user={user} id={id}/>
      </div>
    </div>
  );
  
}

export default OrderDetail;