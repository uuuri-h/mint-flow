import React from 'react'
import './OrderDetailForms.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
// RequestDetail.jsx
import { STATUS_MAP, STATUS_CLASS_MAP, DEPARTMENT} from "../../my-constants";
import FormSelect from '../../my-component/FormItem/FormSelect';
import FormInput from '../../my-component/FormItem/FormInput';

function OrderDetailForms({
    user, 
    orderHeader, 
    setOrderHeader,
    headerStatus,
    setStatus,
    updateDetailField,
    errors = {},
    setErrors
}) {

    // 顧客リスト取得
    const [customer_list, setCustomerList] = useState([]);
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(
                    
                    `http://localhost:8000/customer/customers`
                );


                setCustomerList(response.data.customers)


            } catch (error) {
                console.error('顧客データの取得に失敗しました:', error);
            }
        };

        fetchCustomer();
    }, []); 

    //部署リスト取得
    const [department_list, setDepartmentList] = useState([]);
    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const response = await axios.get(
                    
                    `http://localhost:8000/department/departments`
                );

                setDepartmentList(response.data.departments)

            } catch (error) {
                console.error('部署データの取得に失敗しました:', error);
            }
        };

        fetchDepartment();
    }, []); 

    //ユーザーリストを取得　
    const [user_list, setUserList] = useState([]);  
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://localhost:8000/user/users`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                
                setUserList(response.data.users);

            } catch (error) {
                console.error('ユーザ一覧データの取得に失敗しました:', error);
            }
        };

        fetchUser();
    }, []); 

    //セレクトボックス用にvalue:---, label: ---に変換
    const userList = (user_list || []).map((item) => ({
        value: item.user_id,
        label: item.user_name,
    }));

    //セレクトボックス用にvalue:---, label: ---に変換
    const departmentList = (department_list || []).map((item) => ({
        value: item.department_id,
        label: item.department_name,
    }));

    const userRole = user ? user.department_id : null; // ユーザーデータから役割を取得
    
    //ログイン中のユーザーの権限（部署）によって、表示を分ける（部署id）と一致すれば表示する
    function canShow(departmentId) {
        return userRole === departmentId;
    }
    
    const canShow_PURCHASE = canShow(DEPARTMENT.PURCHASE);
    return (
        <div className="order-detail-forms-container">
            <div className="order-detail-forms">
                {/* ここに発注依頼の詳細フォームを実装する */ }
                <form className="order-detail-form">

                    <div className="form-item request-id-container">
                        <label className="form-label" htmlFor="request-id">依頼ID:</label>
                        <input 
                            className="form-input" 
                            type="text" 
                            id="request-id" 
                            name="request-id" 
                            style={{width: '150px'}}
                            value={orderHeader.request_cd}
                            placeholder='登録後に採番'
                            disabled

                        />
                    </div>

                    <div className="form-item request-status-container">
                        <p className="form-label" htmlFor="request-status">依頼ステータス:</p>
                        <div 
                            className={`status ${STATUS_CLASS_MAP[headerStatus]}`}
                        >
                            {STATUS_MAP[headerStatus]}
                        </div>
                    </div>

                    <div className="form-item request-date-container">
                        <label className="form-label" htmlFor="request-date">依頼日:</label>
                        <input 
                            className="form-input" 
                            type="date" 
                            id="request-date" 
                            style={{width: '150px'}}
                            name="request-date" 
                            // value={order_header?.request_date || ''}
                            value={orderHeader.request_date}
                            disabled
                            onChange={(e) => {
                                if (canShow_PURCHASE) return;

                                setOrderHeader({
                                    ...orderHeader,
                                    request_date: e.target.value
                                })
                            }}
                        />
                    </div>

                    <div className="form-item customer-nm-container">
                    <label className="form-label" htmlFor="customer-nm">
                        顧客名: 
                    </label>

                    <select
                        className={`form-input ${!!errors.customer_id ? "input-error" : ""}`}
                        id="customer-nm"
                        name="customer-nm"
                        value={orderHeader.customer_id}
                        disabled={canShow_PURCHASE}
                        onChange={(e) => {
                            if (canShow_PURCHASE) return;

                            setOrderHeader({
                                ...orderHeader,
                                customer_id: e.target.value
                            })
                        }}
                        
                    >
                        <option value="">選択してください</option>

                        {customer_list.map((customer) => (
                            <option
                                key={customer.customer_id}
                                value={customer.customer_id}
                            >
                                {customer.customer_name}
                            </option>
                        ))}
                    </select>
                </div>


                    <div className="form-item request-date-container">
                        <label className="form-label" htmlFor="delivery_date">納期:</label>
                        <input 
                            className={`form-input ${!!errors.delivery_date ? "input-error" : ""}`}
                            type="date" 
                            id="delivery_date" 
                            style={{width: '150px'}}
                            name="delivery_date" 
                            // value={order_header?.request_date || ''}
                            value={orderHeader.delivery_date}
                            disabled={canShow_PURCHASE}
                            onChange={(e) => {
                                if (canShow_PURCHASE) return;

                                setOrderHeader({
                                    ...orderHeader,
                                    delivery_date: e.target.value
                                })
                            }}
                        />
                    </div>
 
                    <div className="form-item request-dept-container">
                        <label className="form-label" htmlFor="requester">
                            {/*購買の場合は依頼主、その他部署の場合は依頼先*/}
                            {/*依頼先は購買部のみ選べるようにすること（セレクトボックスの表示）*/}
                            {canShow_PURCHASE && ("依頼主部署:")}
                            {! canShow_PURCHASE && ("依頼先部署:")}
                        </label>
                        <FormSelect 
                            selectedValue={canShow_PURCHASE ? orderHeader.requester_dept_id : DEPARTMENT.PURCHASE}
                            // selectedValue={orderHeader.requester_dept_id}
                            options={departmentList}
                            disabled={true}
                            onChange={(e) => {
                                if (canShow_PURCHASE) return;
                                setOrderHeader({
                                    ...orderHeader,
                                    assigner_dept_id: Number(e.target.value),
                                    assigner_dept_name: "",
                                    assigner_id: "",
                                    assigner_name: "",
                                });
                            }}
                            className="form-input" 
                            id="request-dept" 
                            name="request-dept" 
                            style={{width: '100px'}}
                        />
                    </div>

                    <div className="form-item requester-nm-container">
                        <label className="form-label" htmlFor="requester">
                            {canShow_PURCHASE && ("依頼主")}
                            {! canShow_PURCHASE && ("依頼先")}
                        </label>
                        <FormSelect 
                            // selectedValue={orderHeader.requester_id}
                            selectedValue={canShow_PURCHASE ? orderHeader.requester_id : orderHeader.assigner_id}
                            options={userList}
                            disabled={canShow_PURCHASE}
                            hasError={
                                canShow_PURCHASE
                                    ? !!errors.requester_id
                                    : !!errors.assigner_id
                            }
                            onChange={(e) => {
                                if (canShow_PURCHASE) return;

                                const userId = Number(e.target.value);

                                if (canShow_PURCHASE) {
                                    setOrderHeader({
                                        ...orderHeader,
                                        requester_id: userId,
                                    });
                                } else {
                                    setOrderHeader({
                                        ...orderHeader,
                                        assigner_id: userId,
                                    });
                                }
                                
                            }}
                            id="requester" 
                            name="requester" 
                            style={{width: '150px'}}
                        />
                    </div>


                    <div className="form-item request-remarks-container">
                        <label className="form-label" htmlFor="request-remarks">備考:</label>
                        <textarea 
                            className="form-textarea" 
                            id="request-remarks" 
                            name="request-remarks"
                            // value={order_header?.request_comment || ''}
                            style={{width: '100%', height: '80px'}}
                            value={orderHeader.request_comment}
                            onChange={(e) =>
                                setOrderHeader({
                                    ...orderHeader,
                                    request_comment: e.target.value
                                })
                            }
                        >
                        </textarea>
                    </div>

                     {/* ここに必要なフォームフィールドを追加する */ }
                </form>
            </div>
        </div>
    )
}

export default OrderDetailForms