import React, {useState} from 'react';
import {roleCreate} from "./../../api/admin/AdminApi"

function RoleAddModal({close}) {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState(''); // 🔹// 에러 상태 추가

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!inputValue.trim()){
            setError("Role 을 입력해 주세요");
            return;
        }
        const data = {
            role: inputValue
        }
        roleCreate(data)
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
                        ROLE Name:
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="접두사 ROLE_ 필수"
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

export default RoleAddModal;