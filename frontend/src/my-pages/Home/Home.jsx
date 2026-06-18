import React from 'react';
import axios from 'axios';
import './Home.css'

function Home({user}) {
 
    return (
        <div>
            <h1>ホームページ</h1>
            <p>ここはホームページです。</p>
            <p>ようこそ{user ? user.user_name : 'ゲスト'}さん</p>
        </div>
    );
}


export default Home;