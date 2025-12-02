import React, {useEffect, useState} from 'react';
import "./../../css/ListPage.css"
import {getQuizList, quizDelete} from "../../api/quiz/QuizApi";
import {useNavigate} from "react-router-dom";
import GameCreateModal from "../gamePlay/GameCreateModal";
import useCustomMove from "../../common/useCustomMove";
import PageComponent from "../../common/PageComponent";

const initialState = {
    dtoList:[],
    pageNumList:[],
    pageRequestDTO: null,
    prev:false,
    next:false,
    totalCount:0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current:0
}
function List(props) {
    let navigate = useNavigate();
    const {page, size, moveToList} = useCustomMove()
    const [quizzes, setQuizzes] = useState([]);
    const [modalFlag, setModalFlag] = useState(false);
    const [quizId, setQuizId] = useState(0);
    const [serverData, setServerData] = useState(initialState);
    useEffect(() => {
        getQuizList({page, size})
            .then((res)=>{
                if(res.data){
                    setQuizzes(res.data.dtoList)
                    setServerData(res.data)
                }
            })
            .catch((err)=>{

            });
    }, [page, size]);


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

    return (
        <div>
            {
                !modalFlag ? (
                    <div className="list-page">
                        <h2 className="list-title">퀴즈 목록</h2>
                        {!quizzes || quizzes.length === 0  ? (
                            <p className="no-quiz">퀴즈가 없습니다.</p>
                        ) : (
                            <ul className="quiz-list">
                                {quizzes.map((quiz) => (
                                    <li key={quiz.id} className="quiz-item">
                                        <div className="quiz-info" onClick={() => previewQuiz(quiz.id)}>
                                            <h3 className="quiz-title">{quiz.title}</h3>
                                            <p className="quiz-date">작성일: {new Date(quiz.updateAt).toLocaleDateString()}</p>
                                            <p className="quiz-date">민든이: {quiz.nickName}</p>
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
                        <PageComponent serverData={serverData} movePage={moveToList}></PageComponent>
                    </div>
                ):(
                    <GameCreateModal quizId={quizId} modalFlag={handleModal}/>
                )
            }

        </div>
    );
}

export default List;