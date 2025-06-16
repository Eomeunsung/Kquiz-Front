import React from 'react';
import AdminSidebar from "./AdminSidebar"
import {Outlet} from "react-router-dom";
import "./../../css/admin/AdminDashboard.css"
function AdminDashboard(props) {
    return (
        <div className="admin-layout">
            <AdminSidebar/>
            <div className="container">
                <Outlet/>
            </div>
        </div>
    );
}

export default AdminDashboard;