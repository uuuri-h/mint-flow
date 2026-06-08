
import { Outlet } from "react-router-dom";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";

//名前つきエクスポートされたSidebarDataをインポート
import { SidebarData } from "./SidebarData"; 
import SidebarIcon from "./SidebarIcon";
import SidebarUser from "./SidebarUser";
import SidebarSetting from "./SidebarSetting";

function Sidebar({user}) {
    const menu = SidebarData(user);

    return (
        <div className="SidebarContainer">
            <div className="Sidebar">
                <SidebarIcon />
                <ul className="SidebarList"> 
                    {menu.map((value, key) => {
                        return (
                            <li key={key} className="row" >
                                <NavLink 
                                    to={value.link} 
                                    className={({ isActive }) =>
                                        isActive ? "nav-link active" : "nav-link"
                                    }   
                                >  
                                {/* /*active属性をつける*/}
                                {/* key={key} className="row" 
                                id={window.location.pathname === value.link ? "active" : ""} 
                                onClick={() => {
                                    window.location.href = value.link
                                }} */}
                            
                                    <div id="icon">{value.icon}</div>
                                    <div id="title">{value.title}</div>
                                </NavLink>
                        </li>
                        );
                    })}
                </ul>
                <SidebarUser  user={user}/>
                <SidebarSetting />
            </div>
        </div>
    );
}


export default Sidebar;