import React, { useEffect, useState } from 'react';
import "./../../css/admin/MappingModal.css"
import {mappingUpdate} from "./../../api/admin/AdminApi"

function MappingModal({ close, mapping, role, resource }) {
    const [resources, setResources] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedResource, setSelectedResource] = useState('');
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [mappings, setMappings] = useState([]);


    // ✅ props로 받은 role, resource 데이터 초기화
    useEffect(() => {
        if (role) setRoles(role);
        if (resource) setResources(resource);
        if (mapping) setMappings(mapping);
    }, [role, resource]);

    // ✅ 리소스 선택 시, 기존 매핑된 권한 자동 체크
    useEffect(() => {
        console.log("selectResource", selectedResource);
        const found = mappings.find(mapping => mapping.resource.id === parseInt(selectedResource));

        if (found) {
            setSelectedRoles(found.roles.map(r => r.id)); // roles 배열에서 id만 추출
        } else {
            setSelectedRoles([]); // 없으면 초기화
        }
        setSuccess('');
    }, [selectedResource]);


    // ✅ 체크박스 클릭 시 상태 업데이트
    const handleCheckboxChange = (roleId) => {
        setSelectedRoles((prev) =>
            prev.includes(roleId)
                ? prev.filter((id) => id !== roleId)
                : [...prev, roleId]
        );
    };

    // ✅ Save 클릭 시
    const handleMappingSave = () => {

        if (!selectedResource) {
            setError('리소스를 선택해주세요.');
            return;
        }


        setError('');

        const mappingData = {
            resourceId: parseInt(selectedResource),
            roleId: selectedRoles,
        };

        mappingUpdate(mappingData)
            .then(
                (res) => {setMappings(prev => prev.map(m=>m.resource.id === mappingData.resourceId ? {
                    ...m,
                    roles: roles.filter(r => mappingData.roleId.includes(r.id))
                }:m
                ))

                setSuccess("저장 완료 되었습니다.")}

            )
            .catch((err) => {
                setError(err.message);
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>리소스 권한 매핑</h3>

                <label>
                    리소스 선택:
                    <select
                        value={selectedResource}
                        onChange={(e) => setSelectedResource(e.target.value)}
                    >
                        <option value="">-- 리소스 선택 --</option>
                        {resources.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.resource || '(이름 없음)'}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="role-checkbox-list">
                    <p>권한 선택:</p>
                    {roles.map((r) => (
                        <label key={r.id} className="checkbox-item">
                            <input
                                type="checkbox"
                                checked={selectedRoles.includes(Number(r.id))}
                                onChange={() => handleCheckboxChange(r.id)}
                            />
                            {r.role}
                        </label>
                    ))}
                </div>

                {error && <p className="input-error">{error}</p>}
                {success && <p className="input-success">{success}</p>}
                <div className="modal-buttons">
                    <button className="save-btn" onClick={handleMappingSave}>
                        Save
                    </button>
                    <button type="button" className="cancel-btn" onClick={close}>
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
}

export default MappingModal;
