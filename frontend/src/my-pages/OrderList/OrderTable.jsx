import React from 'react'
import './OrderTable.css'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import MyBtn from '../../my-component/Button/MyBtn';
import { API_URL,STATUS_MAP, STATUS_CLASS_MAP,DEPARTMENT } from "../../my-constants";
import { useNavigate } from 'react-router-dom'; // 追加: useNavigateをインポート


function OrderTable({ user }) {
    const navigate = useNavigate(); // useNavigateフックを初期化

    // const user = JSON.parse(localStorage.getItem('user'));
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState('');

    //営業部の場合はチェックボックスを非表示
    const userRole = user ? user.department_id : null; // ユーザーデータから役割を取得
    function canShow(departmentId) {
        return userRole === departmentId;
    }

    //ログイン中のユーザーの権限（部署）によって、表示を分ける（部署id）と一致すれば表示する
    function canShow(departmentId) {
        return userRole === departmentId;
    }
    
    const canShow_PURCHASE = canShow(DEPARTMENT.PURCHASE);

    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    {/* const[状態, 状態を更新する関数] = useState(初期値) */ }

    useEffect(() => {
        // ここでAPIから発注データを取得して状態に保存する処理を実装
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token"); 
                const response = await axios.get(
                    'http://localhost:8000/requests/summaries', {
                        headers : {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );

                setOrders(response.data.requests)
                setTotalItems(response.data.requests.length) 

            } catch (error) {
                console.error('発注依頼データの取得に失敗しました:', error);
            }
        };

        fetchOrders();
    }, []); 

    //テーブルの編集ボタンが押下されたときの処理
    const requestEdit  = async(id) => {
        // e.preventDefault(); //ページのリロードを止める

                    //ホームページにリダイレクト
        navigate('../order-detail', {state :{id}});

    }

    return (
        <div className="order-table-wrapper"> 
        
            <p className='total-items'>件数（ <span className='total-items-count'>{totalItems}</span> 件）</p>
            <div className="order-table-container">
                <table className="order-table">
                    <thead>
                        <tr 
                        >
                            {/* {canShow(DEPARTMENT.PURCHASE) &&
                                <th className='th1'></th>
                                
                            } */}
                            <th className='th2'>依頼日</th>
                            <th className='th3'>依頼ID</th>
                            <th className='th4'>顧客名</th>
                            <th className='th5'>アイテム数</th>
                            <th className='th6'>合計金額</th>
                            <th className='th7'>納期</th>
                            <th className='th9'>依頼ステータス</th>
                            <th className='th10'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* ここに発注データをマッピングして表示 */}
                        {orders.map((order) => {
                            const inputCostValue = canShow_PURCHASE
                                ? order.cost_price_total
                                : order.sales_price_total;
                            
                            return(
                            <tr key={order.request_id}>
                                {/* 営業部のユーザーの場合はチェックボックスを非表示にする */}
                                {/* {canShow(DEPARTMENT.PURCHASE) &&
                                    <td className="td1"><input type="checkbox" className="check-box" /></td>
                                } */}
                                <td className="td2">{order.request_date}</td>
                                <td className="td3">{order.request_cd}</td>
                                <td className="td4">{order.customer_name}</td>
                                <td className="td5">{order.item_count}</td>
                                <td className="td6">
                                    {canShow_PURCHASE ? "＄" : "￥"}
                                    {(inputCostValue ?? 0).toLocaleString()}
                                </td>
                                <td className="td7">{order.delivery_date}</td>
                                <td className="td9">
                                    <span className={`status ${STATUS_CLASS_MAP[order.header_status]}`}>
                                        {STATUS_MAP[order.header_status]}
                                    </span>
                                </td>
                                <td className="td10">
                                    <button 
                                        className="button btn-primary"
                                        onClick={() => requestEdit(order.request_id)}
                                        type="submit"
                                    >
                                        編集
                                    </button>
                                </td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            {/* <div className="table-footer">
            {canShow(DEPARTMENT.PURCHASE) && 
                <MyBtn 
                    className="order-btn" 
                    text="発注する"
                />
            } 
            </div> */}
        </div>
    );
}

export default OrderTable;