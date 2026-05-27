import React from 'react'
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";


export const SidebarData = (user) => {
    const menu = [
    {
        title: "ホーム",
        icon: <HomeIcon />,
        link: '/home'
    },
        {
        title: "依頼一覧",
        icon: <ListAltIcon />,
        link: '/order-list'
    },
];
    
    if (user?.department_code === "001") { // 営業のユーザーにのみ表示
        menu.push({
            title: "新規依頼",
            icon: <AddIcon />,
            link: '/new-order'
        });
    }
    return menu;
}