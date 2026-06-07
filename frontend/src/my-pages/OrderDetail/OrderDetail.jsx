import React from "react";
import "./OrderDetail.css";
import OrderDetailForms from "./OrderDetailForms";
import OrderDetailTable from "./OrderDetailTable";
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import axios from 'axios';

function OrderDetail({ user }) {
  const location = useLocation();
  const {id} = location.state || {}; 


  const [orderHeader, setOrderHeader] = useState({
      request_id: "",
      customer_id: "",
      request_date: "",
      requester_dept_name: "",
      delivery_date: "",
      requester_name: "",
      request_detail: "",
  });

  const [orderDetail, setOrderDetails] = useState([]);

  const request_id = id
  useEffect(() => {
      // ここでAPIから発注データを取得して状態に保存する処理を実装
      const fetchOrderDetail = async () => {
          try {
              const response = await axios.get(
                  `http://localhost:8000/requests/${id}/details`
              );
              console.log(response.data);

              setOrderHeader(response.data.header);
              setOrderDetails(response.data.details);

          } catch (error) {
              console.error('発注依頼データの取得に失敗しました:', error);
          }
      };
      if (id) {
        fetchOrderDetail();
      }

  }, []); 

  return (
    <div className="pg-container order-detail-container">
      <div className="pg-header order-detail-header">
        <h1>発注依頼詳細</h1>
      </div>
      <div className="order-detail-body">
        <OrderDetailForms 
          user={user}     
          orderHeader={orderHeader}
          setOrderHeader={setOrderHeader}
        />
        <OrderDetailTable 
          user={user} 
          orderDetail={orderDetail}

        />
      </div>
    </div>
  );
  
}

export default OrderDetail;