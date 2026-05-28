import React from 'react'
import './OrderTable.css'

function OrderTable() {
    return (
        <div className="order-table-container">
            <table className="order-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>依頼ID</th>
                        <th>顧客名</th>
                        <th>商品名</th>
                        <th>アイテム数</th>
                        <th>合計金額</th>
                        <th>納期</th>
                        <th>優先度</th>
                        <th>依頼ステータス</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {/* ここに発注データをマッピングして表示 */}
                    <tr>
                        <td><input type="checkbox" /></td>  
                        <td>1</td>
                        <td>商品A</td>
                        <td>10</td>
                        <td>1000円</td>
                        <td>2023-10-01</td>
                        <td>高</td>
                        <td>処理中</td>
                        <td>
                            <button className="btn btn-primary">編集</button>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>

    )
}

export default OrderTable