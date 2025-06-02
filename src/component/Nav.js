import React from 'react';
import "./../css/Nav.css"
import {useNavigate} from "react-router-dom";
import QuizCreateModal from "./quiz/QuizCreateModal";
function Nav(props) {
    let navigate = useNavigate();
    const [quizFlag, setQuizFlag] = React.useState(false);
    const handleCreateQuiz=()=>{
        setQuizFlag(!quizFlag);
    }
    return (
        <div>
            <div className="nav-bar">
                <h1 className="logo" onClick={()=>{navigate("/")}}>KQUIZ</h1>
                <ul className="nav-links">
                    <li className="nav-item" onClick={() => {
                        navigate("/list")
                    }}>퀴즈 목록
                    </li>
                    <li className="nav-item" onClick={() => {
                        handleCreateQuiz()
                    }}>퀴즈 만들기
                    </li>
                    <li className="nav-item" onClick={() => {
                        navigate("/participation")
                    }}>퀴즈 참여하기
                    </li>
                    <li className="nav-item" onClick={() => {
                        navigate("/signUp")
                    }}>회원가입
                    </li>
                    <li className="nav-item" onClick={() => {
                        navigate("/signIn")
                    }}>로그인
                    </li>
                </ul>
                {/* 퀴즈 만들기 모달 */}
                {quizFlag && <QuizCreateModal onClose={handleCreateQuiz} />}
            </div>
        </div>

    );
}

export default Nav;