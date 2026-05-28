import React from 'react'
import './OrderTable.css'

function OrderTable() {
    return (
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
                    <tr>
                        <th className="th1"></th>
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
                    <tr>
                        <td className="td1"><input type="checkbox" className="check-box" /></td>  
                        <td className="td2">2023-10-01</td>
                        <td className="td3">JOB26-00022</td>
                        <td className="td4">A COMPANY</td>
                        <td className="td5">10</td>
                        <td className="td6">￥1000</td>
                        <td className="td7">2023-10-01</td>
                        <td className="td9">処理中</td>
                        <td className="td10">
                            <button className="btn btn-primary">編集</button>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>

    )
}

export default OrderTable