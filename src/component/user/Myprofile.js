import React, {useEffect, useState} from 'react';
import "./../../css/user/MyProfile.css"
import {myProfile} from "./../../api/user/UserApi"
import {titleUpdate, quizDelete} from "./../../api/quiz/QuizApi"
import {useNavigate} from "react-router-dom";
import QuizTitleEditor from "../quiz/QuizTitleEditor";
import GameCreateModal from "../gamePlay/GameCreateModal";
function Myprofile(props) {
    const navigate = useNavigate();
    const [profile, setProfile] = React.useState(null);
    const [quizList, setQuizList] = React.useState(null);
    const [titleFlag, setTitleFlag] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [titleId, setTitleId] = React.useState(0);
    const [gameFlag, setGameFlag] = useState(false);
    const [quizId, setQuizId] = useState(0);

    useEffect(()=>{
        myProfile()
            .then((res)=>{
                setProfile(res.data);
                setQuizList(res.data.quizList)
            }).catch((err)=>{

        })
    },[])

    const handleUpdateQuiz = (data) =>{
        navigate("/quiz", {state: data});
    }

    //타이틀 수정
    const handleChangeTitle =(data)=>{
        setTitleId(data.id);
        setTitle(data.title);
        setTitleFlag(!titleFlag);
    }

    const handleSaveTitle = (title)=>{
        const data = {
            id: titleId,
            title:title
        };
        titleUpdate(data)
            .then((res)=>{
                console.log("타이틀 업데이트 성공 "+res)
                const updateList = quizList.map(quiz =>
                    quiz.id === titleId ? { ...quiz, title: title } : quiz
                );
                setQuizList(updateList)
            })
            .catch((err)=>{
                alert("수정 실패 했습니다. 다시 시도해 주시기 바랍니다.")
            })
        setTitleFlag(!titleFlag);
    }

    const handleCloseTitle = () =>{
        setTitleFlag(!titleFlag);
    }

    //quiz 삭제
    const handleQuizDelete = (id) =>{
        const confirmed = window.confirm("정말 삭제하시겠습니까? 삭제 시 복구가 안됩니다.");
        if (confirmed) {
            quizDelete(id)
                .then((res)=>{
                    alert("삭제 완료 되었습니다.")
                    const updateList = quizList.filter(quiz => quiz.id !== id);
                    setQuizList(updateList)
                })
                .catch((err)=>{
                    alert("다시 시도해 주시기 바랍니다.")
                })
            console.log("삭제 실행");
        } else {
            // 아니오
            console.log("삭제 취소");
        }
    }

    //게임 방 만들기
    const openGameModal = (id) => {
        setQuizId(id);
        setGameFlag(!gameFlag);
    };
    const closeGameModal = () =>{
        setGameFlag(!gameFlag);
    }

    //게임 미리보기
    const previewQuiz = (quizId) => {
        navigate("/preview", {state: quizId});
    }


    if(!profile) return <div>Loading...</div>;
    return (

        <div className="profile-container">

            <h2 className="profile-name">NickName: {profile.nickName}</h2>
            <p className="profile-email">Email: {profile.email}</p>
            <p className="profile-bio">가입일: {profile.createAt}</p>

            <h3>내가 만든 퀴즈 목록</h3>
            {quizList && quizList.length > 0 ? (
                <div className="quiz-list">
                    {quizList.map((quiz) => (

                        <div className="my-quiz-info" onClick={()=>{handleUpdateQuiz(quiz.id)}}>
                            <h3 className="my-quiz-title">{quiz.title}</h3>
                            <p className="my-quiz-date">작성일: {new Date(quiz.updateAt).toLocaleDateString()}</p>
                            {/*{quiz.thumbnail && (*/}
                            {/*    <img*/}
                            {/*        className="quiz-thumbnail"*/}
                            {/*        src={quiz.thumbnail}*/}
                            {/*        alt="퀴즈 썸네일"*/}
                            {/*    />*/}
                            {/*)}*/}
                            <div className="button-grid">
                                <button className="preview-button" onClick={(e)=>{ e.stopPropagation(); handleChangeTitle(quiz)}}>제목 수정</button>
                                <button className="preview-button" onClick={(e)=>{e.stopPropagation(); openGameModal(quiz.id)}}>방 만들기</button>
                                <button className="preview-button" onClick={(e)=>{e.stopPropagation(); previewQuiz(quiz.id)}}>미리 보기</button>
                                <button className="preview-button" onClick={(e)=>{ e.stopPropagation(); handleQuizDelete(quiz.id)}}>삭제</button>
                            </div>
                        </div>

                    ))}
                </div>
            ) : (
                <p>퀴즈가 없습니다.</p>
            )}
            {
                titleFlag ? (
                     <QuizTitleEditor title={title} close={handleCloseTitle} save={handleSaveTitle}></QuizTitleEditor>
                ):(<></>)
            }
            {
                gameFlag ? (
                    <GameCreateModal quizId={quizId} modalFlag={closeGameModal}/>
                ):
                    (<></>)
            }

        </div>
    );
}

export default Myprofile;