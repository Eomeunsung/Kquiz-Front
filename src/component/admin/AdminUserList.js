import React, {useEffect, useState} from 'react';
import {userList} from "./../../api/admin/AdminApi"
import "../../css/admin/AdminUserList.css"
function AdminUserList(props) {
    const [users, setUsers] = useState([]);
    const [detailFlag, setDetailFlag] = useState(false);

    useEffect(() => {
        userList()
            .then((res)=>{
                setUsers(res.data.userList)
            })
            .catch((err)=>{

            })
    },[])
    return (
        <div>
            <h2 className="admin-title">👨‍💼 관리자 - 회원 관리</h2>
            {
                !detailFlag ? (
                    <ul className="user-list">
                        {users.map((user) => (
                            <li key={user.id} className="user-item" >
                                <div className="user-summary">
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
                    // <DetailUser data={userId} close={handleCloseDetail}></DetailUser>
                    <></>
                )
            }
        </div>
    );
}

export default AdminUserList;