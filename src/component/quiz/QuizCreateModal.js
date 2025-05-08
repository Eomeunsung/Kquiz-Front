import React, {useState} from 'react';
import "./../../css/QuizCreateModal.css"
import {useNavigate} from "react-router-dom";
import {quizCreate} from "./../../api/QuizApi"

function QuizCreateModal({onClose}) {
    const [title, setTitle] = useState("");
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (title.trim() === "") {
            alert("퀴즈 제목을 입력해주세요.");
            return;
        }
        const data = {
            title: title,
        }
        quizCreate(data)
            .then((result) => {
                onClose();
                navigate("/quiz", {state: result.data});
            })
            .catch((err) => {
                alert("오류가 발생했습니다. 다시 시도바랍니다.");
            })
    };
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>퀴즈 만들기</h2>
                <input
                    type="text"
                    placeholder="퀴즈 제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div className="modal-buttons">
                    <button className="cancel-button" onClick={onClose}>취소</button>
                    <button className="submit-button" onClick={handleSubmit}>생성</button>
                </div>
            </div>
        </div>
    );
}

export default QuizCreateModal;