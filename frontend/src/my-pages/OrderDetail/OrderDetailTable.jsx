import React from 'react'
import './OrderDetailTable.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
// RequestDetail.jsx
import { ITEM_STATUS_MAP, ITEM_STATUS_CLASS_MAP, DEPARTMENT, ITEM_STATUS } from "../../my-constants";
import FormSelect from '../../my-component/FormItem/FormSelect';
import FormInput from '../../my-component/FormItem/FormInput';

function OrderDetailTable({
    id,
    user,
    orderDetail,
    setOrderDetail,
    updateDetailField,
    createEmptyRow,
    errors = {},
    setErrors,
    isChecked,
    setIsChecked,
}) {


    //テーブルのアイテム数を取得
    let totalItems = orderDetail.length;
    let rowNo = 0;

    const userRole = user ? user.department_id : null; // ユーザーデータから役割を取得
    
    //ログイン中のユーザーの権限（部署）によって、表示を分ける（部署id）と一致すれば表示する
    function canShow(departmentId) {
        return userRole === departmentId;
    }

    const canShow_PURCHASE = canShow(DEPARTMENT.PURCHASE);

    //サプライヤーリストを取得
    const [supplier_list, setSupplierList] = useState([]);
    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const response = await axios.get(
                    
                    `http://localhost:8000/supplier/suppliers`
                );

                setSupplierList(response.data.suppliers)
                

            } catch (error) {
                console.error('顧客データの取得に失敗しました:', error);
            }
        };

        fetchSupplier();
    }, []); 

    //アイテムリストを取得
    const [item_list, setItemList] = useState([]);  
    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(
                    
                    `http://localhost:8000/item/items`
                );
                
                setItemList(response.data.items);

            } catch (error) {
                console.error('アイテムデータの取得に失敗しました:', error);
            }
        };

        fetchItem();
    }, []); 

    //セレクトボックス用にvalue:---, label: ---に変換
    const supplierOptions = (supplier_list || []).map((item) => ({
        value: item.supplier_id,
        label: item.supplier_name
    }));

    //セレクトボックス用にvalue:---, label: ---に変換
    const itemNmOptions = (item_list || []).map((item) => ({
        value: item.item_id,
        label: item.item_name
    }));

    //セレクトボックス用にvalue:---, label: ---に変換
    const MakerOptions = (item_list || []).map((item) => ({
        value: item.item_id,
        label: item.maker_name
    }));


    //セレクトボックス用にvalue:---, label: ---に変換
    const itemCdOptions = (item_list || []).map((item) => ({
        value: item.item_id,
        label: item.item_cd
    }));


    //セレクトボックス用にvalue:---, label: ---に変換
    const itemCostPriceList = (item_list || []).map((item) => ({
        value: item.item_id,
        label: 
            //条件式 ? 式1 (真の場合) : 式2 (偽の場合)
            canShow_PURCHASE ? (item.cost_price) : ((item.sales_price)),
    }));

    //選択した型番やアイテム名（item_id)によって、金額、サプライヤ、メーカー等をセットする
    function setByItem (detail_id, item_id) {

        //item_listの中からitem_idが一致するものを1件探してselectedItemに入れる
        //一件だけ見つけたい場合はfind(条件)
        const selectedItem = item_list.find (
            item => item.item_id === item_id
        );

        if (!selectedItem) return;

        updateDetailField(detail_id, "sales_price", selectedItem.sales_price);
        updateDetailField(detail_id, "cost_price", selectedItem.cost_price);
        updateDetailField(detail_id, "supplier_id", selectedItem.supplier_id);

    }

    //テーブル左下の行追加ボタン「＋」が押された時の処理
    function AddNewRow () {

        //テーブルに追加できる行は10行までとする
        if (totalItems >= 10) {
            //setOrderDetail(undefined);にならないようにorderDetailを返す
            alert("テーブルに追加できるのは10件までです。")
            return orderDetail;
        }

        // 今入っているデータ
        const currentList = orderDetail;

         // 元の配列 + 新しい行
        const newList = [...currentList, createEmptyRow()];

        // state更新
        return newList
    }

    //テーブルの削除ボタンが押された時の処理
    const detailRowDelate = async(detail_id) => {

        // 今入っているデータをコピー
        const newList = [...orderDetail];

        //detail_idが位置する行を削除
        newList.forEach((item, index) => {
            if (item.detail_id === detail_id) {
                newList.splice(index , 1); //splice(開始位置, 削除件数)
            }
        });

        // state更新
        if (newList.length === 0) {
            setOrderDetail([createEmptyRow()]);
        } else {
            setOrderDetail(newList);
        }
    
    };

      // チェックボックスの状態を変更する関数
    // チェックしたタイミングでisCheckedがtrueになる
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    return (
        <div className='detail-table-wrapper'>
            <div className='detail-table-header'>
                <p className='total-items'>件数（ <span className='total-items-count'>{totalItems}</span> 件）</p>
            </div>
            <div className='detail-table-container'>
                <table className='detail-table'>
                    <thead>
                        <tr 
                        >
                            {canShow_PURCHASE && <th className='th0'></th>}
                            <th className='th1'>#</th>
                            <th className='th2'>型番</th>
                            <th className='th3'>アイテム名</th>
                            <th className='th4'>数量</th>
                            <th className='th5'>{canShow_PURCHASE ? "原価 " : "販売原価 "}</th>
                            <th className='th6'>合計金額</th>
                            <th className='th7'>メーカー名</th>
                            {canShow_PURCHASE && <th className='th8'>仕入先</th>}
                            <th className='th9'>発注ステータス</th>
                            <th className='th10'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* ここに発注データをマッピングして表示 */}
                        {orderDetail.map((order, index) => {
                                console.log(orderDetail);
                                const inputCostValue = canShow_PURCHASE
                                    ? order.cost_price
                                    : order.sales_price;

                                const selectedItem = item_list.find(
                                    item => item.item_id === order.item_id
                                );

                            return (
                            <tr key={order.detail_id}>
                                
                                {/*チェックボックス*/}
                                {canShow_PURCHASE && (
                                    <td className="td0">
                                        <input 
                                            checked={isChecked}
                                            onChange={handleCheckboxChange}
                                            type="checkbox" 
                                            className="check-box" 
                                            id={"check_"+order.detail_id}
                                        />
                                    </td>
                                )}

                                {/*行番号*/}
                                <td className='td1'>
                                    {rowNo = rowNo+1}
                                </td>

                                {/*アイテムコード（型番）*/}
                                <td className="td2">
                                    <FormSelect 
                                        selectedValue={order.item_id}
                                        options={itemCdOptions}
                                        disabled={canShow_PURCHASE}
                                        hasError={!!errors[`details.${index}.item_id`]}
                                        onChange= {(e) => {
                                            const itemId = Number(e.target.value);
                                            updateDetailField(
                                                order.detail_id, 
                                                "item_id",
                                                itemId
                                            );

                                            setByItem(
                                                order.detail_id,
                                                itemId
                                            );
                                        }}
                                        style={{width: '110px'}}

                                    />

                                </td>
                                
                                {/*アイテム名*/}
                                <td className="td3">
                                    <FormSelect 
                                        selectedValue={order.item_id}
                                        options={itemNmOptions}
                                        disabled={canShow_PURCHASE}
                                        hasError={!!errors[`details.${index}.item_id`]}
                                        onChange= {(e) => {
                                            const itemId = Number(e.target.value);
                                            updateDetailField(
                                                order.detail_id, 
                                                "item_id",
                                                itemId,
                                            );

                                            setByItem(
                                                order.detail_id,
                                                itemId
                                            );
                                        }}
                                        style={{width: '130px'}}
                                    />
                                </td>
                                <td className="td4">
                                        
                                    <FormInput 
                                        value={order.quantity}
                                        hasError={!!errors[`details.${index}.quantity`]}
                                        onChange= {(e) => updateDetailField(
                                                order.detail_id, 
                                                "quantity",
                                                Number(e.target.value)
                                            )
                                        }
                                        width = "70px"
                                        type = "number"
                                        min="0"
                                    />
                                </td>
                                
                                {/*原価・販売原価*/}
                                 {/* = {canShow_PURCHASE ? (order.cost_price) : ((order.sales_price))}; */}
                                <td className="td5">
                                    {canShow_PURCHASE ? "＄ " : "￥ "}
                                    <FormInput
                                        value={inputCostValue}
                                        options={itemCostPriceList}
                                        disabled={! canShow_PURCHASE}

                                        hasError={
                                            canShow_PURCHASE
                                                ? !!errors[`details.${index}.cost_price`]
                                                : !!errors[`details.${index}.sales_price`]
                                        }

                                        onChange= {(e) => 
                                            updateDetailField(
                                                order.detail_id, 
                                                canShow_PURCHASE ? "cost_price" : "sales_price",
                                                Number(e.target.value)
                                            )

                                        }
                                        width = "90px"
                                        type = "number"
                                        min="0"
                                    />
                                </td>

                                {/*合計金額*/}
                                <td className="td6"
                                >
                                    {canShow_PURCHASE ? "＄ " : "￥ "}
                                    {(
                                        (canShow_PURCHASE
                                            ? order.cost_price
                                            : order.sales_price
                                        ) * order.quantity
                                    ).toLocaleString()}
                                </td>

                                {/*メーカー名*/}
                                {/* メーカーは専用テーブルを持たず、itemテーブルで管理しています */}
                                <td className="td7">
                                    <input
                                        className="form-input"
                                        value={selectedItem?.maker_name ?? ""}
                                        style={{width: '130px'}}
                                        readOnly
                                    />
                                </td>
                                
                                {/*仕入れ先名*/}
                                {/*仕入れ先は購買部のみ表示する*/}
                                {canShow_PURCHASE && 
                                    <td className="td8">
                                        <FormSelect 
                                            selectedValue={order.supplier_id}
                                            options={supplierOptions}
                                            hasError={!!errors[`details.${index}.supplier_id`]}
                                            onChange= {(e) => updateDetailField(
                                                    order.detail_id, 
                                                    "supplier_id",
                                                    Number(e.target.value)
                                                )
                                            }
                                            style={{width: '130px'}}
                                        />
                                    </td>
                                }

                                {/*ステータス*/}
                                <td className="td9">
                                    <span className={`item-status ${ITEM_STATUS_CLASS_MAP[order.item_status]}`}>
                                        {ITEM_STATUS_MAP[order.item_status]}
                                    </span>
                                </td>
                                {canShow_PURCHASE || order.item_status != ITEM_STATUS.COMPLETED && (
                                
                                    <td className="td10">
                                        <button 
                                            className="button red-btn"
                                            onClick={() => detailRowDelate(order.detail_id)}
                                            type="button"
                                        >
                                            削除
                                        </button>
                                    </td>
                                )}
                            </tr>
                            )
                        })}
                    </tbody>

                </table>
            </div>
            <div className='detail-table-footer'>

            {! canShow_PURCHASE && 
                <button 
                    className='button row-add-btn'
                    type = 'button'
                    // onClick={setOrderDetail(AddNewRow)}
                    onClick={() => setOrderDetail(AddNewRow())}
                >
                    ＋      
                </button>
            }
            </div>
        </div>
    )
}

export default OrderDetailTable