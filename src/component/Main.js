import React, {useEffect, useState} from 'react';
import "./../css/Main.css"
import GameCreateModal from "./gamePlay/GameCreateModal";
import {useNavigate} from "react-router-dom";
import {getQuizList, quizDelete} from "../api/quiz/QuizApi";

function Main(props) {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [modalFlag, setModalFlag] = useState(false);
    const [quizId, setQuizId] = useState(0);

    useEffect(() => {
        getQuizList()
            .then((res)=>{
                if(res.data){
                    setQuizzes(res.data)
                }

            })
            .catch((err)=>{

            });
    }, []);


    const previewQuiz = (quizId) => {
        navigate("/preview", {state: quizId});
    }

    const toggleModal = () => {
        setModalFlag(!modalFlag);
    };

    const openModalQuizId = (id) => {
        setQuizId(id);
        setModalFlag(true);
    };

    return (
        <div className="main-container">
            {!modalFlag ? (
                <div className="quiz-section">
                    <h2 className="section-title">📚 최신 퀴즈 목록</h2>
                    {quizzes.length === 0 ? (
                        <p className="empty-message">퀴즈가 없습니다.</p>
                    ) : (
                        <ul className="quiz-card-list">
                            {quizzes.map((quiz) => (
                                <li key={quiz.id} className="quiz-card">
                                    <div className="card-content" onClick={() => previewQuiz(quiz.id)}>
                                        <h3 className="quiz-title">{quiz.title}</h3>
                                        <p className="quiz-date">
                                            작성일: {new Date(quiz.updateAt).toLocaleDateString()}
                                        </p>
                                        <p className="quiz-date">
                                            만든이: {quiz.nickName}
                                        </p>
                                        {quiz.thumbnail && (
                                            <img
                                                className="quiz-thumbnail"
                                                src={quiz.thumbnail}
                                                alt="퀴즈 썸네일"
                                            />
                                        )}
                                    </div>
                                    <div className="button-group">
                                        <button className="action-button" onClick={() => openModalQuizId(quiz.id)}>
                                            방 만들기
                                        </button>
                                        {/*<button className="action-button" onClick={() => previewQuiz(quiz.id)}>*/}
                                        {/*    미리 보기*/}
                                        {/*</button>*/}
                                        {/*<button className="action-button delete" onClick={() => handleDelete(quiz.id)}>*/}
                                        {/*    삭제*/}
                                        {/*</button>*/}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <GameCreateModal quizId={quizId} modalFlag={toggleModal}/>
            )}
        </div>
    );
}

export default Main;