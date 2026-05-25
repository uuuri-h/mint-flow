import React from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
import "./SidebarSetting.css";
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ConfirmModal from '../Modal/ConfirmModal';


function SidebarSetting() {
    const [showModal, setShowModal] = React.useState(false);
    const [content, setContent] = React.useState("");

    const ShowModal = () => {
        setShowModal(true);
        setContent("ログアウト");
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout');
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };  

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
                    <div className='LogoutGrp' onClick={ShowModal} content={setContent}>
                        <LogoutIcon className='icon'/>
                        <p>ログアウト</p>
                    </div>

                </div>
            </div>
        <ConfirmModal 
            showFlag={showModal} 
            setShowModal={setShowModal} 
            content={content} 
            />
        </>
    )
};

export default SidebarSetting;