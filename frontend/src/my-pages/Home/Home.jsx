import React from 'react';
import axios from 'axios';
import './Home.css'
import { useOutletContext } from 'react-router-dom' //outletからcontextを受け取る

function Home() {
    const { user } = useOutletContext(); //contextからuserを取得

    return (
        <div>
            <h1>ホームページ</h1>
            <p>ここはホームページです。</p>
            <p>ようこそ{user ? user.user_name : 'ゲスト'}さん</p>
        </div>
    );
}


export default Home;