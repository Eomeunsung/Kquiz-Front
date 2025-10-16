import React, {useState} from 'react';
import "./../../css/admin/AdminResourceModal.css"
import {resourceCreate} from "./../../api/admin/AdminApi"

function ResourceAddModal({close}) {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState(''); // 🔹// 에러 상태 추가
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!inputValue.trim()){
            setError("리소스 이름을 입력해 주세요");
            return;
        }
        const data = {
            resource: inputValue
        }
        resourceCreate(data)
            .then(res => {
                close()
            })
            .catch(err => {
                setError(err.message);
            })



    };
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Add Resource</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Resource Name:
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="ex) /api/admin/users"
                            required
                        />
                    </label>
                    {error && <p className="input-error">{error}</p>}
                    <div className="modal-buttons">
                        <button type="submit" className="save-btn">Save</button>
                        <button type="button" className="cancel-btn" onClick={close}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResourceAddModal;