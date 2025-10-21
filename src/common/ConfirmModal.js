import React from 'react';
import "./../css/ConfirmModal.css"
function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="confirm-overlay">
            <div className="confirm-content">
                <p>{message}</p>
                <div className="confirm-buttons">
                    <button className="confirm-yes" onClick={onConfirm}>확인</button>
                    <button className="confirm-no" onClick={onCancel}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;