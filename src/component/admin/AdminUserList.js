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
                    <ul className="user-list">
                        {users.map((user) => (
                            <li key={user.id} className="user-item" >
                                <div className="user-summary" onClick={()=>{
                                    handleDetail(user.id);
                                }}>
                                    <span>📧 {user.email}</span>
                                    <span>가입일: {user.localDate || '알 수 없음'}</span>
                                    {user.roles ? (
                                        <span>
                                            {user.roles.map((role, index) => (
                                            <span key={index} className="user-role">{role}</span>
                                            ))}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <AdminUserDetail id={userId} close={handleDetailClose}></AdminUserDetail>
                )
            }
        </div>
    );
}

export default AdminUserList;