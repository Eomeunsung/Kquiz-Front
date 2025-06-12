import React, {useState} from 'react';
import "./../../css/QuizCreateModal.css"
import {useNavigate} from "react-router-dom";
import {quizCreate} from "../../api/quiz/QuizApi"

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
                console.log("에러 "+JSON.stringify(err))
                // if(err.response.status === 403) {
                //     alert("로그인이 만료 되어 다시 로그인 바랍니다.")
                // }else if(err.response.status === 401) {
                //     alert("로그인 후 이용 가능 합니다.");
                // }
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