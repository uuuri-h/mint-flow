import React from 'react'
import './NewOrderBtn.css'
import { useNavigate } from 'react-router-dom'; 



function NewOrderBtn() {
    const navigate = useNavigate(); // useNavigateフックを初期化
    const newOrderClick = async() => {
        console.log("新規登録ボタンが押された")
        navigate('../order-detail');
    }


    return (
        <div className='new-order-btn-container'>
            <button 
                className='button new-order-btn'
                onClick={() => newOrderClick()}
                type="submit"
                
            >
                新規発注
            </button>
        </div>
    )
    }

export default NewOrderBtn