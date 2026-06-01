import React from 'react'

function OrderDetailForms() {
    return (
        <div className="order-detail-forms-container">
            <div className="order-detail-forms">
                {/* ここに発注依頼の詳細フォームを実装する */ }
                <form>
                    <label htmlFor="order-id">発注ID:</label>
                    <input type="text" id="order-id" name="order-id" readOnly />

                    <label htmlFor="order-status">ステータス:</label>
                    <input type="text" id="order-status" name="order-status" readOnly />

                    <label htmlFor="order-date">発注日:</label>
                    <input type="text" id="order-date" name="order-date" readOnly />

                    <label htmlFor="supplier">仕入先:</label>
                    <input type="text" id="supplier" name="supplier" readOnly />

                    <label htmlFor="items">発注品目:</label>
                    <textarea id="items" name="items" readOnly></textarea>

                     {/* ここに必要なフォームフィールドを追加する */ }
                </form>
            </div>
        </div>
    )
}

export default OrderDetailForms