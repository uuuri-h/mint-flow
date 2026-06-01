import React from "react";
import "./OrderDetail.css";
import OrderDetailForms from "./OrderDetailForms";

function OrderDetail() {
  return (
    <div className="pg-container order-detail-container">
      <div className="pg-header order-detail-header">
        <h1>発注依頼詳細</h1>
      </div>
      <div className="order-detail-body">
        <OrderDetailForms />
      </div>
    </div>
  );
}

export default OrderDetail;