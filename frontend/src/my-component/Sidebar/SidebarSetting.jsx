import React from 'react';
import axios from 'axios';
import "./SidebarSetting.css";
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

function SidebarSetting() {

    return (
        <div className="SidebarSettingContainer">
            <div className="SidebarSetting">
                <div className='SettingGrp'>
                    <SettingsIcon className='icon'/>
                    <p>設定</p>
                </div>
                <div className='LogoutGrp'>
                    <LogoutIcon className='icon'/>
                    <p>ログアウト</p>
                </div>
            </div>
        </div>
    )
};

export default SidebarSetting;