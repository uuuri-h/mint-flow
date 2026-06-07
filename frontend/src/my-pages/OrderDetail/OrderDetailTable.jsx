import React from 'react'
import './OrderDetailTable.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
// RequestDetail.jsx
import { STATUS_MAP, STATUS_CLASS_MAP } from "../../my-constants";


function OrderDetailTable() {
    return (
        <div className='detail-table-wrapper'>
            <div className='detail-table-container'>
                <table className='detail-table'>

                </table>
            </div>
        </div>
    )
}

export default OrderDetailTable