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
import MyBtn from '../../my-component/Button/MyBtn';

function OrderDetail({ user }) {
  const location = useLocation();
  const {id} = location.state || {};  //URLを変化させることなくページ遷移時に一時的なデータを渡す

  //営業部の場合はチェックボックスを非表示
  const userRole = user ? user.department_id : null; // ユーザーデータから役割を取得
  function canShow(departmentId) {
      return userRole === departmentId;
  }

  //今日の日付を取得
  // .padStart(2, "0")　で「6」を［06」にしている
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const date = String(currentDate.getDate()).padStart(2, "0");

  //ヘッダーの空行
  const emptyHeader = {
      request_cd: "",
      customer_id: "",
      request_date: `${year}-${month}-${date}`,
      requester_dept_id: "", 
      assigner_dept_id: "",
      requester_dept_name: "",
      assigner_dept_name: "",
      delivery_date: "",
      requester_name: "",
      assigner_: "",
      requester_id: "",
      assigner_id: "",
      request_detail: "",
};

  //テーブルの空行を作る
  const createEmptyRow = () => ({
      detail_id: Date.now(), //keyが被らないようにするため。
      item_id: "",
      quantity: "",
      sales_price: "",
      cost_price: "",
      maker_name: "",
      supplier_id: "",
      status: 0,
  });

  const [orderHeader, setOrderHeader] = useState(emptyHeader);
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

      //一覧から取得したidがない＝新規の場合はフォームとテーブルをリセット
      if (! id) {
        setOrderHeader(emptyHeader);
        setOrderDetail([]);
        setOrderDetail([createEmptyRow()]);
        setStatus(0);
        return;
      }
      fetchOrderDetail();
  }, [id]); //[id]が変わった時だけ実行

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
          id = {id}
          user={user} 
          orderDetail={orderDetail}
          setOrderDetail={setOrderDetail}
          updateDetailField={updateDetailField}
          createEmptyRow = {createEmptyRow}

        />

        <div className="table-footer">

          {canShow(DEPARTMENT.PURCHASE) && 
            <MyBtn 
                className="btn cancel-order-btn red-btn" 
                text="発注を取り消す"
            />
          } 
          {!canShow(DEPARTMENT.PURCHASE) && 
            <MyBtn 
                className="btn cancel-request-btn red-btn" 
                text="依頼を削除する"
            />
          } 
          {canShow(DEPARTMENT.PURCHASE) && 
            <MyBtn 
                className="btn order-btn" 
                text="発注する"
            />
          } 
          {!canShow(DEPARTMENT.PURCHASE) && 
            <MyBtn 
                className="btn request-btn" 
                text="依頼する"
            />
          } 
        </div>
      </div>
    </div>
  );
  
}

export default OrderDetail;