
import { Outlet } from "react-router-dom";
import "../my-styles/Sidebar.css";
import { SidebarData } from "./SidebarData";

function Sidebar() {

    return (

        <div className="sidebar">
            <ul className="sidebarList"> 
                {SidebarData.map((value, key) => {
                    return (
                        <li key={key} className="row" onClick={() => {
                            window.location.href = value.link
                        }}>
                            <div id="icon">{value.icon}</div>
                            <div>{value.title}</div>
                        </li>
                    );
                })}
            </ul>
            
        </div>

    );
}


export default Sidebar;