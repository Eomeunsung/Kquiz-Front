import React, {useEffect, useState} from 'react';
import "./../css/Nav.css"
import {useNavigate} from "react-router-dom";
import QuizCreateModal from "./quiz/QuizCreateModal";
function Nav(props) {
    let navigate = useNavigate();
    const [quizFlag, setQuizFlag] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [nickName, setNickName] = useState("");
    const handleCreateQuiz=()=>{
        setQuizFlag(!quizFlag);
    }

    useEffect(()=>{
        if(localStorage.getItem("token")){
            setNickName(localStorage.getItem("nickName"));
        }
    },[localStorage.getItem("token")])

    const handleLogout = ()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("nickName");
        setIsLoggedIn(!isLoggedIn);
    }

    const hnadleMyprofile = () => {
        navigate("/myProfile")
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
                    {
                        !localStorage.getItem("token") ? (
                            <>
                                <li className="nav-item" onClick={() => {
                                    navigate("/signUp")
                                }}>회원가입
                                </li>
                                <li className="nav-item" onClick={() => {
                                    navigate("/signIn")
                                }}>로그인
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item" onClick={hnadleMyprofile}>
                                    {nickName}
                                </li>
                                <li className="nav-item" onClick={handleLogout}>
                                    로그아웃
                                </li>
                            </>
                        )
                    }

                </ul>
                {/* 퀴즈 만들기 모달 */}
                {quizFlag && <QuizCreateModal onClose={handleCreateQuiz}/>}
            </div>
        </div>

    );
}

export default Nav;