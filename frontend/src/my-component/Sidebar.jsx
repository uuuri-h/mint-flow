
import { Outlet } from "react-router-dom";
import "../my-styles/Sidebar.css";

//名前つきエクスポートされたSidebarDataをインポート
import { SidebarData } from "./SidebarData"; 
import SidebarIcon from "./SidebarIcon";

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
                
            </div>
        </div>
    );
}


export default Sidebar;