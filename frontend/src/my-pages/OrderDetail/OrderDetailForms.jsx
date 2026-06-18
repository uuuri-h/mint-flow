import React from 'react'
import './OrderDetailForms.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
// RequestDetail.jsx
import { STATUS_MAP, STATUS_CLASS_MAP } from "../../my-constants";
import FormSelect from '../../my-component/FormItem/FormSelect';
import FormInput from '../../my-component/FormItem/FormInput';

function OrderDetailForms({
    user, 
    orderHeader, 
    setOrderHeader,
    status,
    setStatus,
    updateDetailField,
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
                const response = await axios.get(
                    
                    `http://localhost:8000/user/users`
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

    //ユーザー選択時
    function setByUser(userId) {
        const selectedUser = user_list.find(
            user => user.user_id === userId
        );

        if (!selectedUser) return;
        console.log("user変更");

        //スプレット構文で、orderHeaderをコピーして、必要な値を更新し、上書き
        setOrderHeader(prev => ({
            ...prev,
            requester_id: userId, 
            requester_name: selectedUser.user_name,
            requester_dept_id: selectedUser.department_id,
            requester_dept_name: selectedUser.department_name,
        }));
    }

    //部署選択時
    //あとで選択部署に所属するユーザーを、依頼主/依頼先ユーザーセレクトボックスに表示する（ひとまず選択されたら空にしておく）
    function setByDept() {

    }

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
                            // value={order_header?.request_cd || ''}
                            value={orderHeader.request_cd}

                            readOnly

                        />
                    </div>

                    <div className="form-item request-status-container">
                        <p className="form-label" htmlFor="request-status">依頼ステータス:</p>
                        <div 
                            className={`status ${STATUS_CLASS_MAP[status]}`}
                        >
                            {STATUS_MAP[status]}
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
                            onChange={(e) =>
                                setOrderHeader({
                                    ...orderHeader,
                                    request_date: e.target.value
                                })
                            }
                        />
                    </div>

                    <div className="form-item customer-nm-container">
                    <label className="form-label" htmlFor="customer-nm">
                        顧客名:
                    </label>

                    <select
                        className="form-input"
                        id="customer-nm"
                        name="customer-nm"
                        value={orderHeader.customer_id}
                        onChange={(e) =>
                            setOrderHeader({
                                ...orderHeader,
                                customer_id: e.target.value
                            })
                        }
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
                            className="form-input" 
                            type="date" 
                            id="delivery_date" 
                            style={{width: '150px'}}
                            name="delivery_date" 
                            // value={order_header?.request_date || ''}
                            value={orderHeader.delivery_date}
                            onChange={(e) =>
                                setOrderHeader({
                                    ...orderHeader,
                                    delivery_date: e.target.value
                                })
                            }
                        />
                    </div>
 
                    <div className="form-item request-dept-container">
                        <label className="form-label" htmlFor="request-dept">
                            {}依頼主部署:
                        </label>
                        <FormSelect 
                            selectedValue={orderHeader.requester_dept_id}
                            options={departmentList}
                            onChange={(e) => {
                                setOrderHeader({
                                    ...orderHeader,
                                    requester_dept_id: Number(e.target.value),
                                    requester_dept_name: "",
                                    requester_id: "",
                                    requester_name: "",
                                });
                                // setByDept();
                                console.log("部署変更");
                            }}
                            className="form-input" 
                            id="request-dept" 
                            name="request-dept" 
                            style={{width: '100px'}}
                        />
                    </div>

                    <div className="form-item requester-nm-container">
                        <label className="form-label" htmlFor="requester-nm">依頼主:</label>
                        <FormSelect 
                            selectedValue={orderHeader.requester_id}
                            options={userList}
                            onChange={(e) => {
                                const userId = Number(e.target.value);
                                // setOrderHeader({
                                //     ...orderHeader,
                                //     userId
                                // });
                                setByUser(userId);
                                
                            }}
                            className="form-input" 
                            id="request-dept" 
                            name="request-dept" 
                            style={{width: '150px'}}
                        />
                    </div>


                    <div className="form-item request-remarks-container">
                        <label className="form-label" htmlFor="request-remarks">備考:</label>
                        <textarea 
                            className="form-textarea" 
                            id="request-remarks" 
                            name="request-remarks"
                            // value={order_header?.request_detail || ''}
                            style={{width: '100%', height: '80px'}}
                            value={orderHeader.request_detail}
                            onChange={(e) =>
                                setOrderHeader({
                                    ...orderHeader,
                                    request_detail: e.target.value
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