import React, {useEffect, useState} from 'react';
import "./../../css/admin/DetailModal.css"
import {roleDelete, roleUpdate} from "../../api/admin/AdminApi"
import ConfirmModal from "../../common/ConfirmModal";

function RoleDetailModal({close, role}) {
    const [roleInfo, setRoleInfo] = React.useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [editRole, setEditRole] = React.useState('');

    useEffect(() => {
        if(!role){return}
        console.log(role)
        setRoleInfo(role);
    }, [role]);

    const handleDelete=()=>{
        roleDelete(roleInfo.id)
            .then((res)=>{
                close()
            })
            .catch((err)=>{

            })
    }

    const handleUpdate=()=>{
        if(!editRole || editRole.length===0){
            return
        }
        const data = {
            "roleId": roleInfo.id,
            "roleName": editRole,
        }
        roleUpdate(data)
            .then((res)=>{
                setRoleInfo(res.data)
                handleIsEdit()
            })
            .catch((err)=>{})

    }

    const confirmModal = () =>{
        setShowConfirm(!showConfirm);
    }

    const handleIsEdit=()=>{
        setIsEditing(!isEditing);
    }

    if (!roleInfo) {
        return <div className="modal-overlay"><div className="modal-content">로딩중...</div></div>;
    }
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>권한 상세정보</h2>
                <div className="role-detail">
                    {
                        isEditing ? (
                            <div className="edit-container">
                                <input
                                    type="text"
                                    value={editRole}
                                    onChange={(e) => setEditRole(e.target.value)}
                                    placeholder={roleInfo.role}
                                    className="edit-input"
                                />
                                <button className="save-btn" onClick={()=>{handleUpdate()}}>저장</button>
                            </div>
                        ) :(
                            <p><strong>권한 이름:</strong> {roleInfo.role}</p>
                        )
                    }

                    {/*<p><strong>설명:</strong> {role.description || "설명이 없습니다."}</p>*/}
                    {/*<p><strong>생성일:</strong> {role.createdAt || "알 수 없음"}</p>*/}
                </div>

                <div className="modal-buttons">
                    <button className="edit-btn" onClick={handleIsEdit}>수정</button>
                    <button className="delete-btn" onClick={confirmModal}>삭제</button>
                    <button className="close-btn" onClick={close}>닫기</button>
                </div>

                {showConfirm && (
                    <ConfirmModal
                        message="정말로 이 권한을 삭제하시겠습니까?"
                        onConfirm={() => {
                            handleDelete();
                            setShowConfirm(false);
                        }}
                        onCancel={() => setShowConfirm(false)}
                    />
                )}
            </div>

        </div>
    );
}

export default RoleDetailModal;