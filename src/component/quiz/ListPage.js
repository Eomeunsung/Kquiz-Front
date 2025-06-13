import React, {useEffect, useState} from 'react';
import "./../../css/ListPage.css"
import {getQuizList, quizDelete} from "../../api/quiz/QuizApi";
import {useNavigate} from "react-router-dom";
import GameCreateModal from "../gamePlay/GameCreateModal";

function ListPage(props) {
    let navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [modalFlag, setModalFlag] = useState(false);
    const [quizId, setQuizId] = useState(0);

    useEffect(() => {
        getQuizList()
            .then((res)=>{
                setQuizzes(res.data)
            })
            .catch((err)=>{

            });
    }, []);


    const previewQuiz = (quizId) => {
        navigate("/preview", {state: quizId});
    }


    const handleModal = () =>{
        setModalFlag(!modalFlag);
    }
    const openModalQuizId = (id) => {
        setQuizId(id);
        setModalFlag(true);
    };

    const handleDelete = (id) => {
        quizDelete(id)
            .then((res)=>{
                getQuizList()
                    .then((res)=>{
                        setQuizzes(res.data)
                    })
                    .catch((err)=>{

                    });
            }).catch((err)=>{

        })
    }
    return (
        <div>
            {
                !modalFlag ? (
                    <div className="list-page">
                        <h2 className="list-title">퀴즈 목록</h2>
                        {quizzes.length === 0 ? (
                            <p className="no-quiz">퀴즈가 없습니다.</p>
                        ) : (
                            <ul className="quiz-list">
                                {quizzes.map((quiz) => (
                                    <li key={quiz.id} className="quiz-item">
                                        <div className="quiz-info" onClick={() => previewQuiz(quiz.id)}>
                                            <h3 className="quiz-title">{quiz.title}</h3>
                                            <p className="quiz-date">작성일: {new Date(quiz.updateAt).toLocaleDateString()}</p>
                                            <p className="quiz-date">민든이 </p>
                                            {/*{quiz.thumbnail && (*/}
                                            {/*    <img*/}
                                            {/*        className="quiz-thumbnail"*/}
                                            {/*        src={quiz.thumbnail}*/}
                                            {/*        alt="퀴즈 썸네일"*/}
                                            {/*    />*/}
                                            {/*)}*/}
                                        </div>
                                        <button className="preview-button" onClick={()=>{openModalQuizId(quiz.id)}}>방 만들기</button>
                                        {/*<button className="preview-button" onClick={()=>{previewQuiz(quiz.id)}}>미리 보기</button>*/}
                                        {/*<button className="preview-button" onClick={()=>{handleDelete(quiz.id)}}>삭제</button>*/}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ):(
                    <GameCreateModal quizId={quizId} modalFlag={handleModal}/>
                )
            }

        </div>
    );
}

export default ListPage;