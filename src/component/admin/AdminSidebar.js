import React from 'react';
import "../../css/admin/AdminSideBar.css"
import {Link, useNavigate} from "react-router-dom";

function AdminSidebar(props) {
    const navigate = useNavigate();
    return (
        <div className="admin-sidebar">
            <h2 className="sidebar-title">관리자 메뉴</h2>
            <ul className="sidebar-menu">
                <li><button className="sidebar-button" onClick={()=>{navigate("/admin/user/list")}}>👥 유저 설정</button></li>
                <li><button  className="sidebar-button" onClick={()=>{navigate("/admin/quiz/list")}}>✅ 퀴즈 리스트</button></li>
                <li><button className="sidebar-button" onClick={()=>{navigate("/admin/access/control")}}>권한 설정</button> </li>
            </ul>
        </div>
    );
}

export default AdminSidebar;