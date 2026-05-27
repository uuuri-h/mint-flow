import React from 'react';
import "./SidebarUser.css";
import icon from "../../images/user_icon.png"

function SidebarUser({user}) {
    return (
        <div className="SidebarUserContainer">
            <div className="SidebarUser">
                <img src={icon} ></img>
                <div className="UserGrp">
                    <p className="UserName">{user ? user.user_name : 'ゲスト'}</p>
                    <p className="UserInfo">{user ? user.userid : '000000'} / {user ? user.department_name : '----'}</p>
                </div>
            </div>
        </div>
    )
};

export default SidebarUser;