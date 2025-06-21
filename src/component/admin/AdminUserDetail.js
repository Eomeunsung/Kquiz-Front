import React, {useEffect, useState} from 'react';
import {userGet} from "./../../api/admin/AdminApi";
import "./../../css/admin/AdminUserDetail.css"
import {roleGet} from "../../api/role/RoleApi";
import {userUpdate} from "./../../api/admin/AdminApi"
function AdminUserDetail({id, close}) {
    const [userInfo, setUserInfo] = React.useState({});
    const [updateFlag, setUpdateFlag] = React.useState(false);
    const [error, setError] = useState('');
    const [roleData, setRoleData] = useState([]);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [checkRoles, setCheckRoles] = useState([]);


    useEffect(() => {
        userGet(id)
            .then((res)=>{
                setUserInfo(res.data)
            })
            .catch((err)=>{

            })
    },[])


    //유저 수정 페이지 열기
    const handleUpdate= async ()=>{
        setUpdateFlag(!updateFlag);
        await roleGet()
            .then((res)=>{
                setRoleData(res.data.roles)
                setCheckRoles(userInfo.roles)
        }).catch((err)=>{

        })
    }

    //유저 수정 페이지 닫기
    const handleClose = () => {
        setUpdateFlag(!updateFlag);
    }

    //권한체크
    const handleRoleCheck = (item) => {
        setCheckRoles((prev)=>
            prev.includes(item) ? // 현재 선택된 목록 중 item이 있는지 확인
                prev.filter((v)=> v !==item)  //있으면 제외 item과 일치하지 않는 값만 남김 즉, item을 제외한 새로운 배열 생성
                : [...prev, item] //없는 경우 기존 배열에 추가
        )
    }

    const handleUserSave = ()=>{
        // userInfo.id,
        // editEmail ? editEmail : userInfo.email,
        const data= {
            userId: userInfo.id,
            email: editEmail ? editEmail : userInfo.email,
            nickName: editName ? editName : userInfo.nickName,
            roles: checkRoles
        }
        userUpdate(data)
            .then((res)=>{
                close()
            })
            .catch((err)=>{
                if(err.response.data.code==="A000" || err.response.data.code==="A001" ){
                    setError(err.response.data.message)
                }else{
                    setError("서버에서 오류가 발생했습니다.")
                }
            })
    }
    return (
        <div className="detail-user-container">
            {
                updateFlag ?
                    (
                        <div className="user-edit-container">
                            <h3 className="section-title">✏️ 사용자 정보 수정</h3>
                            {error && <div className="error-message">{error}</div>}
                            <div className="form-row">
                                <label>이름</label>
                                <input
                                    type="text"
                                    value={editName}
                                    placeholder={userInfo.nickName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="editable-input"
                                />
                            </div>

                            <div className="form-row">
                                <label>이메일</label>
                                <input
                                    type="text"
                                    value={editEmail}
                                    placeholder={userInfo.email}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    className="editable-input"
                                />
                            </div>

                            <div className="form-section">
                                <h4 className="section-subtitle">📌 권한 선택</h4>
                                {roleData.length > 0 ? (
                                    <div className="checkbox-group">
                                        {roleData.map((item, idx) => (
                                            <label key={idx} className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={checkRoles.includes(item)} //roles 배열에 내가 가지고 있는 권한이 있으면 체크 안되어 있으면 노체크
                                                    onChange={() => handleRoleCheck(item)}
                                                />
                                                {item}
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <p>등록된 권한이 없습니다.</p>
                                )}
                            </div>

                            <div className="role-badge-group">
                                {checkRoles?.map((r, idx) => (
                                    <span className="role-badge" key={idx}>{r}</span>
                                ))}
                            </div>

                            <div className="close-button" onClick={handleUserSave}>저장</div>
                            <div className="close-button" onClick={handleClose}>편집 닫기</div>
                        </div>
                    ) : (
                        <>
                            {userInfo ? (
                                <>
                                    <p><strong>이름:</strong> {userInfo.nickName}</p>
                                    <p><strong>이메일:</strong> {userInfo.email}</p>
                                    <p><strong>가입일:</strong> {userInfo.createAt}</p>
                                    <p><strong>권한 목록:</strong></p>
                                    <div className="role-badge-group">
                                        {userInfo.roles?.map((r, idx) => (
                                            <span className="role-badge" key={idx}>
                                              {r}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="close-button" onClick={handleUpdate}>수정</div>
                                    <div className="close-button" onClick={close}>닫기</div>
                                </>
                            ) : (
                                <p>불러오는 중...</p>
                            )}
                        </>
                    )
            }

        </div>
    );
}

export default AdminUserDetail;