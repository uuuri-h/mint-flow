import React from 'react';
import axios from 'axios';
import "../my-styles/SidebarUser.css";
import icon from "../images/user_icon.png"

function SidebarUser() {
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
        <div className="SidebarUserContainer">
            <div className="SidebarUser">
                <img src={icon} ></img>
                <p>{user ? user.user_name : 'ゲスト'}</p>
                <p>{user ? user.userid : '000000'} / {user ? user.department_name : '----'}</p>
                <p></p>
            </div>
        </div>
    )
};

export default SidebarUser;