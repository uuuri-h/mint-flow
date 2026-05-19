import React from 'react';
import axios from 'axios';
import '../my-styles/Home.css'

function Home() {
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                // ローカルストレージからトークンを取得
                const token = localStorage.getItem('token'); 

                console.log('取得したトークン:', token); // トークンの値を確認
                
                const response = await axios.get('http://localhost:8000/users/me/', {
                    headers: {
                        Authorization: `Bearer ${token}` // トークンをAuthorizationヘッダーに含める
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('ユーザー情報の取得に失敗しました', error);
            }
        };

        fetchUser();

    }, []); 

    return (
        <div>
            <h1>ホームページ</h1>
            <p>ここはホームページです。</p>
            <p>ようこそ{user ? user.user_name : 'ゲスト'}さん</p>
        </div>
    );
}


export default Home;