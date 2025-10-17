import React, { useEffect, useState } from 'react';

function MappingModal({ close, mappings, role, resource }) {
    const [resources, setResources] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedResource, setSelectedResource] = useState('');
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [error, setError] = useState('');

    // ✅ props로 받은 role, resource 데이터 초기화
    useEffect(() => {
        if (role) setRoles(role);
        if (resource) setResources(resource);
    }, [role, resource]);

    // ✅ 리소스 선택 시, 해당 리소스의 기존 매핑된 권한을 자동 선택
    useEffect(() => {
        if (!selectedResource || !mappings) return;

        // 🔹 mappings 구조에 맞게 resource.id 기준으로 검색
        const found = mappings.find(
            (m) => m.resource?.id === parseInt(selectedResource)
        );

        if (found) {
            // 🔹 roles 배열에서 id만 추출
            const roleIds = found.roles.map((r) => r.id);
            setSelectedRoles(roleIds);
        } else {
            setSelectedRoles([]); // 🔹 없으면 모두 해제
        }
    }, [selectedResource, mappings]);

    // ✅ 체크박스 클릭 시 상태 업데이트
    const handleCheckboxChange = (roleId) => {
        setSelectedRoles((prev) =>
            prev.includes(roleId)
                ? prev.filter((id) => id !== roleId)
                : [...prev, roleId]
        );
    };

    // ✅ Save 클릭 시
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedResource) {
            setError('리소스를 선택해주세요.');
            return;
        }
        if (selectedRoles.length === 0) {
            setError('하나 이상의 권한을 선택해주세요.');
            return;
        }

        setError('');

        const mappingData = {
            resourceId: parseInt(selectedResource),
            roleIds: selectedRoles,
        };

        console.log('✅ 매핑 데이터 전송:', mappingData);

        // TODO: 이 데이터를 API로 전송하는 부분 추가 가능
        close();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>리소스 권한 매핑</h3>

                <form onSubmit={handleSubmit}>
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
                                    checked={selectedRoles.includes(r.id)}
                                    onChange={() => handleCheckboxChange(r.id)}
                                />
                                {r.role}
                            </label>
                        ))}
                    </div>

                    {error && <p className="input-error">{error}</p>}

                    <div className="modal-buttons">
                        <button type="submit" className="save-btn">
                            Save
                        </button>
                        <button type="button" className="cancel-btn" onClick={close}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MappingModal;
