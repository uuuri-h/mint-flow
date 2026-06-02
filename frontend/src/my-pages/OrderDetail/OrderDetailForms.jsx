import React from 'react'
import './OrderDetailForms.css'

function OrderDetailForms() {
    return (
        <div className="order-detail-forms-container">
            <div className="order-detail-forms">
                {/* ここに発注依頼の詳細フォームを実装する */ }
                <form className="order-detail-form">

                    <div className="form-item request-id-container">
                        <label htmlFor="request-id">依頼ID:</label>
                        <input type="text" id="request-id" name="request-id" readOnly />
                    </div>

                    <div className="form-item customer-nm-container">
                        <label htmlFor="customer-nm">顧客名:</label>
                        <input type="text" id="customer-nm" name="customer-nm" readOnly />
                    </div>

                    <div className="form-item request-date-container">
                        <label htmlFor="request-date">納期:</label>
                        <input type="text" id="request-date" name="request-date" readOnly />
                    </div>

                    <div className="form-item request-status-container">
                        <label htmlFor="request-status">依頼ステータス:</label>
                        <input type="text" id="request-status" name="request-status" readOnly />
                    </div>
 
                    <div className="form-item request-dept-container">
                        <label htmlFor="request-dept">依頼主部署:</label>
                        <textarea id="request-dept" name="request-dept" readOnly></textarea>
                    </div>

                    <div className="form-item requester-nm-container">
                        <label htmlFor="requester-nm">依頼主:</label>
                        <input type="text" id="requester-nm" name="requester-nm" readOnly />
                    </div>


                    <div className="form-item request-remarks-container">
                        <label htmlFor="request-remarks">備考:</label>
                        <textarea id="request-remarks" name="request-remarks" readOnly></textarea>
                    </div>

                     {/* ここに必要なフォームフィールドを追加する */ }
                </form>
            </div>
        </div>
    )
}

export default OrderDetailForms