import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css'
import { useNavigate } from 'react-router-dom'; // 追加: useNavigateをインポート

function Login() {
    const navigate = useNavigate(); // useNavigateフックを初期化

    //useStateに入力された値を保存
    const [data, setData] = useState('');
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');


    //ログインボタンがクリックされたときの処理
    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("login click");
        try {
            const response = await axios.post(
                'http://localhost:8000/login/',//ReactからFastAPIへ！　HTTP通信（JSONデータを送信）
                //JSONデータの形式でユーザーIDとパスワードを送信
                {
                    userid: userid,
                    password: password
                }
            );

            //setData(response.data.message);
            alert(response.data.message);
            //ログインに成功したらローカルストーレッジにtokenを保存
            //localStorageはブラウザの保存領域、ページ更新しても残る
            localStorage.setItem(
                'token',
                response.data.access_token
            );
            
            //ホームページにリダイレクト
            navigate('/home');

        } catch (error) {
            console.error('There was an error!', error);
        }
    }

    return (
        <div className="login-container">
            <h1>Mint Flow</h1>
            <h2>ログイン</h2>
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label>
                        ユーザーID:
                    </label>
                    <input 
                        type="text"
                        name="userid" 
                        value={userid}
                        placeholder='ユーザーID'
                        onChange={(e) => setUserid(e.target.value)}
                    />
                    
                </div>
                <br />
                <div className="input-group">
                    <label>
                        パスワード:
                    </label>
                    <input 
                        type="password" 
                        name="password"
                        value={password}
                        placeholder='パスワード'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                </div>
                <br />
                <button type="submit">ログイン</button>
            </form>
            <p>{data}</p>
        </div>
    );
}

export default Login;
