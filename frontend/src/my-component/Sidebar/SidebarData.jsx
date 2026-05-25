import React from 'react'
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";


export const SidebarData = [
    {
        title: "ホーム",
        icon: <HomeIcon />,
        link: '/home'
    },
    {
        title: "新規依頼",
        icon: <AddIcon />,
        link: '/new-order'
    },
        {
        title: "依頼一覧",
        icon: <ListAltIcon />,
        link: '/order-list'
    },
];
