import React from 'react'
import './OrderTable.css'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import OrderBtn from '../../my-component/Button/OrderBtn';
import { API_URL,STATUS_MAP, STATUS_CLASS_MAP } from "../../my-constants";
import { useNavigate } from 'react-router-dom'; // 追加: useNavigateをインポート


function OrderTable({ user }) {
    const navigate = useNavigate(); // useNavigateフックを初期化

    // const user = JSON.parse(localStorage.getItem('user'));
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState('');

    //営業部の場合はチェックボックスを非表示
    const [showCheckBox, setShowCheckBox] = useState(true);
    const[showOrderBtn, setShowOrderBtn] = useState(true);
    // console.log("OrderTable user:", user); 
    useEffect(() => {
        const userRole = user ? user.department_code : null; // ユーザーデータから役割を取得
        if (userRole === '001') { // 営業部のコードに応じて条件を設定
            setShowCheckBox(false);
            setShowOrderBtn(false);
        } else {
            setShowCheckBox(true);
            setShowOrderBtn(true);
        }
    }, [user]); // userが変更されたときに実行される, これがないと、ユーザーデータが更新されてもチェックボックスの表示が変わらない
    if (showCheckBox === false) {
        // console.log("営業部のユーザーのため、チェックボックスは非表示です。");
        
    }

    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    {/* const[状態, 状態を更新する関数] = useState(初期値) */ }

    useEffect(() => {
        // ここでAPIから発注データを取得して状態に保存する処理を実装
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8000/requests/summaries'
                );
                // console.log('response.data.requests:', response.data.requests)

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
        console.log(id + "行の編集ボタンが押された！")
                    //ホームページにリダイレクト
        navigate('../order-detail', {state :{id}});

    }

    return (
        <div className="order-table-wrapper"> 
            <p className='total-items'>件数（ <span className='total-items-count'>{totalItems}</span> 件）</p>
            <div className="order-table-container">
                <table className="order-table">
                    {/* <colgroup>
                        <col className="col1" style={{ width: '8%' }} />
                        <col className="col2" style={{ width: '15%' }} />
                        <col className="col3" style={{ width: '15%' }} />
                        <col className="col4" style={{ width: '15%' }} />
                        <col className="col5" style={{ width: '15%' }} />
                        <col className="col6" style={{ width: '15%' }} />
                        <col className="col7" style={{ width: '15%' }} />
                        <col className="col8" style={{ width: '15%' }} />
                        <col className="col10" style={{ width: '8%' }} />
                    </colgroup> */}
                    <thead>
                        <tr 
                        >
                            {showCheckBox && <th className='th1'></th>}
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
                        {orders.map((order) => (
                            <tr key={order.request_id}>
                                {/* 営業部のユーザーの場合はチェックボックスを非表示にする */}
                                {showCheckBox && (
                                    <td className="td1"><input type="checkbox" className="check-box" disabled={!showCheckBox} /></td>
                                )}
                                <td className="td2">{order.request_date}</td>
                                <td className="td3">{order.request_id}</td>
                                <td className="td4">{order.customer_name}</td>
                                <td className="td5">{order.item_count}</td>
                                <td className="td6">￥{order.total_amount}</td>
                                <td className="td7">{order.delivery_date}</td>
                                <td className="td9">
                                    <span className={`status ${STATUS_CLASS_MAP[order.status]}`}>
                                        {STATUS_MAP[order.status]}
                                    </span>
                                </td>
                                <td className="td10">
                                    <button 
                                        className="button btn btn-primary"
                                        onClick={() => requestEdit(order.request_id)}
                                        type="submit"
                                    >
                                     {/* onClick={() => requestEdit(request.request_id)}　 */}
                                        編集
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="table-footer">
                {showOrderBtn && <OrderBtn className="order-btn" user={user} />} 
            </div>
        </div>
    );
}

export default OrderTable;