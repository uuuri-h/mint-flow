import React from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
import "./SidebarSetting.css";
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ConfirmModal from '../Modal/ConfirmModal';


function SidebarSetting() {
    const [showModal, setShowModal] = React.useState(false);
    const [logout, setConfirmStatus] = React.useState(false);
    const [content, setContent] = React.useState("");

    const ShowModal = () => {
        setShowModal(true);
        setContent("ログアウト");
    };


    const Logout = async () => {
        localStorage.removeItem("token");

        alert("ログアウトしました");
        window.location.href = '/'; // ログアウト後にログインページへリダイレクト
    };
    

    React.useEffect(() => { //値が変更されたときに実行される（logoutがtrueになったときにLogout関数を呼び出す）
        if (logout) {
            Logout();
        }
    }, [logout]);

    return (
        <>
            <div className="SidebarSettingContainer">
                <div className="SidebarSetting">
                    <NavLink 
                        to="/setting" 
                        className={({ isActive }) =>
                            isActive ? "SettingGrp active" : "SettingGrp"
                        }
                    >
                        <SettingsIcon className='icon'/>
                        <p>設定</p>
                    </NavLink>
                    <div 
                        className='LogoutGrp' 
                        onClick={ShowModal} 
                    >
                        <LogoutIcon className='icon'/>
                        <p>ログアウト</p>
                    </div>

                </div>
            </div>
        <ConfirmModal 
            showFlag={showModal} 
            setShowModal={setShowModal} 
            setConfirmStatus={setConfirmStatus}
            content={content} 
            

            />
        </>
    )
};

export default SidebarSetting;