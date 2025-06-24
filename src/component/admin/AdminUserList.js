import React, {useEffect, useState} from 'react';
import {userList} from "./../../api/admin/AdminApi"
import "../../css/admin/AdminUserList.css"
import AdminUserDetail from "./AdminUserDetail";
function AdminUserList(props) {
    const [users, setUsers] = useState([]);
    const [detailFlag, setDetailFlag] = useState(false);
    const [userId, setUserId] = useState(0);

    useEffect(() => {
        userList()
            .then((res)=>{
                setUsers(res.data.userList)
            })
            .catch((err)=>{

            })
    },[])

    const handleDetail = (id) => {
        setUserId(id)
        setDetailFlag(!detailFlag);
    }

    const handleDetailClose = () => {
        setDetailFlag(false);
    }
    return (
        <div>
            <h2 className="admin-title">👨‍💼 관리자 - 회원 관리</h2>
            {
                !detailFlag ? (
                    <div className="user-list">
                        {users.map((user) => (
                            <div key={user.id} className="user-item" onClick={() => handleDetail(user.id)}>
                                <div className="user-summary">
                                    <span>📧 {user.email}</span>
                                    <span>가입일: {user.createAt || '알 수 없음'}</span>
                                </div>
                                {user.roles && user.roles.length > 0 && (
                                    <div className="user-roles">
                                        {user.roles.map((role, index) => (
                                            <span key={index} className="user-role">{role}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <AdminUserDetail id={userId} close={handleDetailClose}></AdminUserDetail>
                )
            }
        </div>
    );
}

export default AdminUserList;