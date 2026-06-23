import React from "react";
import "./OrderDetail.css";
import OrderDetailForms from "./OrderDetailForms";
import OrderDetailTable from "./OrderDetailTable";
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { API_URL,STATUS_MAP, STATUS_CLASS_MAP, DEPARTMENT } from "../../my-constants";
import axios from 'axios';
import MyBtn from '../../my-component/Button/NewOrderBtn';

function OrderDetail({ user }) {
  const location = useLocation();
  const {id} = location.state || {}; 

  // const { user } = useOutletContext(); //contextからuserを取得

  //営業部の場合はチェックボックスを非表示
  const userRole = user ? user.department_id : null; // ユーザーデータから役割を取得
  function canShow(departmentId) {
      return userRole === departmentId;
  }

  const [orderHeader, setOrderHeader] = useState({
      request_cd: "",
      customer_id: "",
      request_date: "",
      requester_dept_id: "",   // ←追加
      requester_dept_name: "",
      delivery_date: "",
      requester_name: "",
      requester_id: "",
      request_detail: "",
  });

  const [orderDetail, setOrderDetail] = useState([]);
  const [status, setStatus] = useState(0);
  const request_cd = id
  useEffect(() => {
      // ここでAPIから発注データを取得して状態に保存する処理を実装
      const fetchOrderDetail = async () => {
          try {
              const response = await axios.get(
                  `http://localhost:8000/requests/${id}/details`
              );

              setOrderHeader(response.data.header);
              setOrderDetail(response.data.details);
              setStatus(response.data.header.status);


          } catch (error) {
              console.error('発注依頼データの取得に失敗しました:', error);
          }
      };
      if (id) {
        fetchOrderDetail();
      }

  }, []); 

  const updateDetailField = (
      detailId, 
      field, 
      value
    ) => {
    
    setOrderDetail(prev => {
      //reactが最新のorderDetailを渡すようにprev =>を使う
      //reactで前のstateを使って更新するときは prev を使う
        return prev.map( item =>
          item.detail_id === detailId
              ? {
                ...item, // スプレッド構文：itemの中身をコピーして新しいオブジェクトを作る
                [field]: value // fieldで指定されたプロパティを更新（同じキーがある場合は上書き）
              }
              : item
        );
      });
    };

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
          status = {status}
          setStatus = {setStatus}
        />
        <OrderDetailTable 
          user={user} 
          orderDetail={orderDetail}
          setOrderDetail={setOrderDetail}
          updateDetailField={updateDetailField}

        />

        <div className="table-footer">
          {canShow(DEPARTMENT.PURCHASE) && 
            <MyBtn 
                className="order-btn" 
                text="発注する"
            />
          } 
          {canShow(DEPARTMENT.PURCHASE) && 
            <MyBtn 
                className="cancel-btn" 
                text="発注を取り消す"
            />
          } 
        </div>
      </div>
    </div>
  );
  
}

export default OrderDetail;