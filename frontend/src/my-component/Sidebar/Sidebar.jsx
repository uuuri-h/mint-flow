
import { Outlet } from "react-router-dom";
import "./Sidebar.css";

//名前つきエクスポートされたSidebarDataをインポート
import { SidebarData } from "./SidebarData"; 
import SidebarIcon from "./SidebarIcon";
import SidebarUser from "./SidebarUser";
import SidebarSetting from "./SidebarSetting";

function Sidebar() {

    return (
        <div className="SidebarContainer">
            <div className="Sidebar">
                <SidebarIcon />
                <ul className="SidebarList"> 
                    {SidebarData.map((value, key) => {
                        return (
                            <li 
                                /*active属性をつける*/
                                key={key} className="row" 
                                id={window.location.pathname === value.link ? "active" : ""} 
                                onClick={() => {
                                    window.location.href = value.link
                                }}
                            >
                                <div id="icon">{value.icon}</div>
                                <div id="title">{value.title}</div>
                            </li>
                        );
                    })}
                </ul>
                <SidebarUser />
                <SidebarSetting />
            </div>
        </div>
    );
}


export default Sidebar;