import React from 'react'
import './OrderDetailForms.css'

function OrderDetailForms({}) {
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
                            readOnly 
                        />
                    </div>

                    <div className="form-item customer-nm-container">
                        <label className="form-label"  htmlFor="customer-nm">顧客名:</label>
                        <input 
                            className="form-input" 
                            type="text" 
                            id="customer-nm" 
                            style={{width: '200px'}}
                            name="customer-nm"/>
                    </div>

                    <div className="form-item request-date-container">
                        <label className="form-label" htmlFor="request-date">納期:</label>
                        <input 
                            className="form-input" 
                            type="date" 
                            id="request-date" 
                            style={{width: '150px'}}
                            name="request-date" 
                        />
                    </div>

                    <div className="form-item request-status-container">
                        <label className="form-label" htmlFor="request-status">依頼ステータス:</label>
                        <input 
                            className="form-input" 
                            type="text" 
                            id="request-status" 
                            style={{width: '150px'}}
                            name="request-status" 
                        />
                    </div>
 
                    <div className="form-item request-dept-container">
                        <label className="form-label" htmlFor="request-dept">依頼主部署:</label>
                        <input 
                            className="form-input" 
                            id="request-dept" 
                            name="request-dept" 
                            style={{width: '200px'}}
                            readOnly 
                        />
                    </div>

                    <div className="form-item requester-nm-container">
                        <label className="form-label" htmlFor="requester-nm">依頼主:</label>
                        <input 
                            className="form-input" 
                            type="text" 
                            id="requester-nm" 
                            style={{width: '150px'}}
                            name="requester-nm" 
                            readOnly
                        />
                    </div>


                    <div className="form-item request-remarks-container">
                        <label className="form-label" htmlFor="request-remarks">備考:</label>
                        <textarea 
                            className="form-textarea" 
                            id="request-remarks" 
                            name="request-remarks"
                            style={{width: '100%', height: '100px'}}
                        ></textarea>
                    </div>

                     {/* ここに必要なフォームフィールドを追加する */ }
                </form>
            </div>
        </div>
    )
}

export default OrderDetailForms