import React from "react";
import "./OrderDetail.css";
import OrderDetailForms from "./OrderDetailForms";
import OrderDetailTable from "./OrderDetailTable";
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { API_URL,STATUS_MAP, STATUS_CLASS_MAP, DEPARTMENT, ITEM_STATUS, STATUS } from "../../my-constants";
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
      request_id: "",
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
      header_status: STATUS.NEW_REQUEST,
      request_comment: "",
};

  //テーブルの空行を作る
  const createEmptyRow = () => ({
      detail_id: Date.now(), //keyが被らないようにするため。
      item_id: "",
      quantity: 0,
      sales_price: 0,
      cost_price: 0,
      maker_name: "",
      supplier_id: "",
      item_status: ITEM_STATUS.NEW_REQUEST,
  });

  const { id: locationId } = location.state || {};
  const [requestId, setRequestId] = useState(locationId);

  const [orderHeader, setOrderHeader] = useState(emptyHeader);
  const [orderDetail, setOrderDetail] = useState([]);

  const [headerStatus, setStatus] = useState(0);
  const request_id = id

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");


  // ここでAPIから発注データを取得して状態に保存する処理を実装
  const fetchOrderDetail = async (requestIdArg = null) => {
    const idToFetch = requestIdArg ?? requestId; // 引数があればそれを使い、なければURLから取得したidを使う
      if (!idToFetch) return;
      try {
        const token = localStorage.getItem("token");
          const response = await axios.get(
              `http://localhost:8000/requests/${idToFetch}/details`,
              {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              }
          );

          //発注依頼ヘッダ (フォーム)
          setOrderHeader(response.data.header);

          //発注依頼詳細をセット (テーブル)
          setOrderDetail(response.data.details);

          //発注依頼ヘッダのステータス
          setStatus(response.data.header.header_status);

      } catch (error) {
          console.error('発注依頼データの取得に失敗しました:', error);
      }
  };

  //発注依頼ヘッダ・発注依頼詳細をセットで取得
  useEffect(() => {
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

     // ● 発注依頼新規登録
    const createRequest = async () => {
    try {
      // console.log(JSON.stringify({
      //     header: orderHeader,
      //     details: orderDetail
      // }, null, 2));
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/requests/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          header: orderHeader,
          details: orderDetail
        })
      });

        if (response.ok) {
          // displayMessage('発注依頼が正常に登録されました。', 'success');
          alert('発注依頼が正常に登録されました。', 'success')

          //フォームの更新
          const data = await response.json();

          setRequestId(data.request_id); // ←追加

          // data.request_id を使って取得
          await fetchOrderDetail(data.request_id);

        } else {
          if (response.status === 422) {
            const errorData = await response.json();

            const errorMap = {};
            

            errorData.detail.forEach(error => {
              const loc = error.loc;

              if (loc[1] === "header") {
                // header.customer_id
                errorMap[loc[2]] = error.msg;

              } else if (loc[1] === "details") {
                // details.0.quantity
                errorMap[`details.${loc[2]}.${loc[3]}`] = error.msg;
              }
            });

            console.log("422発生", errorMap);

            setErrorMessage("* 入力に不備があります。" );

            setErrors(errorMap);
            return;

          } else {
            const errorData = await response.json();
            // displayMessage(`発注依頼の登録に失敗しました: ${errorData.message}`, 'error');
            alert('発注依頼の登録に失敗しました', 'error')
          }
      }
    } catch (error) {
      // displayMessage(`発注依頼の登録中にエラーが発生しました: ${error.message}`, 'error');
      alert(`発注依頼の登録中にエラーが発生しました: ${error.message}`, 'error')
    }
  }

    // ● 発注依頼更新 ：　依頼内容を更新する
    // ● 発注/発注の取り消し　：　備考、金額、数量、アイテムステータスの更新（REQUESTING/COMPLETED）

  //発注依頼ヘッダ・発注依頼詳細の新規登録・更新処理
  const saveRequest = async () => {
    if (!requestId) {
       // ● 発注依頼新規登録
      await createRequest();
        
    } else if (
      // ● 発注依頼更新 ：　依頼内容を更新する
      // ● 発注/発注の取り消し　：　備考、金額、数量、アイテムステータスの更新（REQUESTING/COMPLETED）
      headerStatus === STATUS.REQUESTING || 
      headerStatus === STATUS.PARTIAL
    ) {

    } 
};

// 
  const deleteRequest = async () => {
    if (id) {
      // ● 依頼ヘッダ削除(依頼自体の取り下げ)　：　発注済でない場合のみ可能
      if (! headerStatus === STATUS.COMPLETED) {
      }
    }
  }

  //詳細データを更新する
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
        {/* {errorMessage && (<div>{errorMessage}</div>)} */}
        {errorMessage && (
            <div className="error-message">
                {errorMessage}
            </div>
        )}
        <OrderDetailForms 
          user={user}     
          orderHeader={orderHeader}
          setOrderHeader={setOrderHeader}
          headerStatus = {headerStatus}
          setStatus = {setStatus}
          errors = {errors}
          setErrors ={setErrors}
        />
        <OrderDetailTable 
          id = {id}
          user={user} 
          orderDetail={orderDetail}
          setOrderDetail={setOrderDetail}
          updateDetailField={updateDetailField}
          createEmptyRow = {createEmptyRow}
          errors = {errors}
          setErrors ={setErrors}

        />

        <div className="table-footer">

          {canShow(DEPARTMENT.PURCHASE) && 
            <MyBtn 
                className="btn cancel-order-btn red-btn" 
                text="発注を取り消す"
                onClick={saveRequest}
                // disabled = {!errors}
            />
          } 

          {/*発注済のアイテムがある場合、依頼の取り消しはできない為、ボタンを非表示にする*/}
          {! canShow(DEPARTMENT.PURCHASE) && 
            orderHeader.header_status !== STATUS.COMPLETED  &&
            orderHeader.header_status !== STATUS.PARTIAL && 
            (
            <MyBtn 
                className="btn cancel-request-btn red-btn" 
                text="依頼を削除する"
                onClick={deleteRequest}
            />
            )
          } 
          {canShow(DEPARTMENT.PURCHASE) && 
            <MyBtn 
                className="btn order-btn" 
                text="発注する"
                onClick={saveRequest}
                
            />
          } 
          {!canShow(DEPARTMENT.PURCHASE) && 
            <MyBtn 
                className="btn request-btn" 
                text="依頼する"
                onClick={saveRequest}
            />
          } 
        </div>
      </div>
    </div>
  );
  
}

export default OrderDetail;