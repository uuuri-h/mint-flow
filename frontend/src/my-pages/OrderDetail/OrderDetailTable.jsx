import React from 'react'
import './OrderDetailTable.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
// RequestDetail.jsx
import { ITEM_STATUS_MAP, ITEM_STATUS_CLASS_MAP } from "../../my-constants";
import {FormSelect} from "../../my-component/FormItem/FormSelect";

function OrderDetailTable({
    user,
    orderDetail,
    setOrderDetail
}) {
    
    console.log("orderDetail=", orderDetail)
    console.log("typeof=", typeof orderDetail)

    //営業部の場合はチェックボックスを非表示
    const [showCheckBox, setShowCheckBox] = useState(true);
    const[showOrderBtn, setShowOrderBtn] = useState(true);

    useEffect(() => {
        const userRole = user ? user.department_id : null; // ユーザーデータから役割を取得
        if (userRole === 1) { // 営業部のコードに応じて条件を設定
            setShowCheckBox(false);
            setShowOrderBtn(false);
        } else {

            setShowCheckBox(true);
            setShowOrderBtn(true);
        }
    }, [user]); // userが変更されたときに実行される, これがないと、ユーザーデータが更新されてもチェックボックスの表示が変わらない
    if (showCheckBox === false) {
        
    }


    const [supplier_list, setSupplierList] = useState([]);
    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const response = await axios.get(
                    
                    `http://localhost:8000/supplier/suppliers`
                );


                setSupplierList(response.data.suppliers)
                console.log(response.data.suppliers)


            } catch (error) {
                console.error('顧客データの取得に失敗しました:', error);
            }
        };

        fetchSupplier();
    }, []); 



    return (
        <div className='detail-table-wrapper'>
            <div className='detail-table-container'>
                <table className='detail-table'>
                    <thead>
                        <tr 
                        >
                            {showCheckBox && <th className='th1'></th>}
                            <th className='th2'>型番</th>
                            <th className='th3'>アイテム名</th>
                            <th className='th4'>数量</th>
                            <th className='th5'>金額</th>
                            <th className='th6'>合計金額</th>
                            <th className='th7'>仕入先</th>
                            <th className='th9'>発注ステータス</th>
                            <th className='th10'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* ここに発注データをマッピングして表示 */}
                        {orderDetail.map((order) => (
                            <tr key={order.detail_id}>
                                {/* 営業部のユーザーの場合はチェックボックスを非表示にする */}
                                {showCheckBox && (
                                    <td className="td1"><input type="checkbox" className="check-box" disabled={!showCheckBox} /></td>
                                )}
                                <td className="td2">
                                    {/* {order.item_partsnum} */}

                                </td>
                                <td className="td3">{order.item_name}</td>
                                <td className="td4">
                                    <input 
                                        className ="form-input"
                                        type="text"
                                        id="quantity"
                                        style={{width: '70px'}}
                                        name="quantity"
                                        value={order.quantity}
                                        onChange={(e) =>
                                            setOrderDetail(
                                                orderDetail.map((item) =>
                                                    item.detail_id === order.detail_id
                                                        ? {
                                                            ...item,
                                                            quantity: e.target.value
                                                        }
                                                        : item
                                                )
                                            )
                                        }
                                    />
                                </td>
                                <td className="td5">￥{order.price}</td>
                                <td className="td6">￥{order.price * order.quantity}</td>
                                <td className="td7">

                                    {/* <FormSelect 
                                        selectedValue={}
                                        options={}
                                        onChange={(e) => setItemId(Number(e.target.value))}
                                    /> */}
                                    {/* <select
                                        onChange={(e) =>
                                            setOrderDetail(
                                                orderDetail.map((item) =>
                                                    item.detail_id === order.detail_id
                                                        ? {
                                                            ...item,
                                                            supplier_id: Number(e.target.value)
                                                        }
                                                        : item
                                                )
                                            )
                                        }
                                    >
                                        <option value="">選択してください</option>

                                        {supplier_list.map((supplier) => (
                                            <option
                                                key={supplier.supplier_id}
                                                value={supplier.supplier_id}
                                            >
                                                {supplier.supplier_name}
                                            </option>
                                        ))}
                                    </select> */}
                                </td>
                                <td className="td9">
                                    <span className={`item-status ${ITEM_STATUS_CLASS_MAP[order.status]}`}>
                                        {ITEM_STATUS_MAP[order.status]}
                                    </span>
                                </td>
                                <td className="td10">
                                    <button 
                                        className="button btn btn-primary"
                                        // onClick={() => requestEdit(order.request_cd)}
                                        type="submit"
                                    >
                                     {/* onClick={() => requestEdit(request.request_cd)}　 */}
                                        編集
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    )
}

export default OrderDetailTable