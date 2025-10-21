import React, {useEffect, useState} from 'react';
import ConfirmModal from "../../common/ConfirmModal";
import {resourceDelete, resourceUpdate} from "../../api/admin/AdminApi";

function ResourceDetailModal({close, resource}) {
    console.log("ResourceDetailModal ", resource);
    const [resourceInfo, setResourceInfo] = React.useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [editResource, setEditResource] = React.useState('');

    useEffect(() => {
        if(!resource){return}
        console.log(resource)
        setResourceInfo(resource)
    }, [resource]);

    const handleDelete=()=>{
        resourceDelete(resourceInfo.id)
            .then((res)=>{
                close()
            })
            .catch((err)=>{

            })
    }

    const handleUpdate=()=>{
        if(!editResource || editResource.length===0){
            return
        }
        const data = {
            "resourceId": resourceInfo.id,
            "name": editResource
        }
        resourceUpdate(data)
            .then((res)=>{
                setResourceInfo(res.data);
                handleIsEdit()
            })
            .catch((err)=>{

            })
    }


    const handleIsEdit=()=>{
        setIsEditing(!isEditing)
    }

    const confirmModal = () =>{
        setShowConfirm(!showConfirm);
    }
    if (!resourceInfo) {
        return <div className="modal-overlay"><div className="modal-content">로딩중...</div></div>;
    }
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>리소스 상세정보</h2>
                <div className="role-detail">
                    {
                        isEditing ? (
                            <div className="edit-container">
                                <input
                                    type="text"
                                    value={editResource}
                                    onChange={(e) => setEditResource(e.target.value)}
                                    placeholder={resourceInfo.resource}
                                    className="edit-input"
                                />
                                <button className="save-btn" onClick={()=>{handleUpdate()}}>저장</button>
                            </div>
                        ) :(
                            <p><strong>리소스 이름:</strong> {resourceInfo.resource}</p>
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
                        message="정말로 이 리소스을 삭제하시겠습니까?"
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

export default ResourceDetailModal;