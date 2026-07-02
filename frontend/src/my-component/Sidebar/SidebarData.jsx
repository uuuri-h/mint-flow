import React from 'react'
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { DEPARTMENT } from "../../my-constants";

export const SidebarData = (user) => {
    const menu = [
    {
        title: "ホーム",
        icon: <HomeIcon />,
        link: '/home',
        order: 0
    },
        {
        title: "依頼一覧",
        icon: <ListAltIcon />,
        link: '/order-list',
        order: 2

    },
];
    
    if (user?.department_id != DEPARTMENT.PURCHASING) { // 購買部以外のユーザーに表示
        menu.push({
            title: "新規依頼",
            icon: <AddIcon />,
            link: '/order-detail',
            order: 1
        });
    }

    /*menuをorderの昇順でソート　aをbと比較*/
    menu.sort((a, b) => a.order - b.order);
    return menu;
}