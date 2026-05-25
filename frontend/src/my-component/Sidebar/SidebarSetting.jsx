import React from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
import "./SidebarSetting.css";
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';


function SidebarSetting() {
    const [open, setOpen] = React.useState(false);

    const logout = async () => {
        try {
            await axios.post('/api/logout');
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };  

    return (
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
                <div className='LogoutGrp' onClick={() => setOpen(true)}>
                    <LogoutIcon className='icon'/>
                    <p>ログアウト</p>
                </div>
            </div>
        </div>
    )
};

export default SidebarSetting;