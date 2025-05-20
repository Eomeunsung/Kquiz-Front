import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import "./../../css/Quiz.css"
import Question from "./Question"
import {quizGet, quizUpdate} from "./../../api/QuizApi";
import {questionDelete, questionCreate, questionGet} from "./../../api/QuestionApi"

function Quiz(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const quizId = location.state;
    console.log(quizId)
    const [questions, setQuestions] = useState([]);
    const [questionGet, setQuestionGet] = useState(null);
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [quizTitle, setQuizTitle] = useState(null);

    useEffect(() => {
        quizGet(quizId)
            .then((res)=>{
                console.log("퀴즈 조회 "+JSON.stringify(res.data))
                const data = res.data;
                setQuizTitle(data.title)
                if (data.questions && data.questions.length > 0) {
                    setQuestions(data.questions);
                    setQuestionGet(data.questions[0]);
                }
            })
            .catch(err=>{
                alert("다시 시도해 주시기 바랍니다.")
                navigate("/")
        })
    },[quizId]);

    //기존에 있는 question과 update된 questuon id 비교후 같으면 교체
    const updateQuestion = (updatedQuestion) => {
        if(!updatedQuestion){return}
        console.log("updatedQuestion"+JSON.stringify(updatedQuestion.question.id))
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === updatedQuestion.question.id ? updatedQuestion.question : question
            )
        );
        console.log("업데이트 된 퀘스천 "+JSON.stringify(questions));
    };



    const addQuestion = () => {
        questionCreate(quizId)
            .then((res)=>{
                setQuestions(prev=>[...prev, res.data])
                questionGet(res.data)
                setSelectedQuestionId(res.data.id);
            })
            .catch(err=>{

            })
    };

    const deleteQuestion = (id) => {
        if(questions.length===1){
            alert("퀴즈가 하나 남아서 삭제 안됩니다.");
            return;
        }
        questionDelete(id)
            .then((res)=>{
                setQuestions(prev => prev.filter(q => q.id !== id));
                if (selectedQuestionId === id) {
                    setSelectedQuestionId(null);
                }
            })
            .catch(err=>{
                alert("다시 시도해 주시기 바랍니다.")
            })
    };

    const handleSave = (id) => {
        const data ={
            id: quizId,
            title: quizTitle,
            questions: questions
        }
        quizUpdate(data)
            .then((res)=>{

            })
            .catch((err)=>{

            })
    }
    return (
        <div className="quiz-page">
            <div className="quiz-nav-bar">
                <ul>
                    <li onClick={addQuestion}>질문 추가</li>
                    <li  style={{color: 'blue', cursor: 'pointer'}} onClick={()=>{handleSave()}}>💾 저장하기</li>
                    {questions.map((q, idx) => (
                        <li
                            key={q.id}
                            className={`quiz-nav-item ${selectedQuestionId === q.id ? 'active' : ''}`}
                            onClick={() => setQuestionGet(q)}
                        >
                            질문 {idx + 1}
                            <button onClick={(e) => {
                                e.stopPropagation();
                                deleteQuestion(q.id);
                            }}>
                                삭제
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="quiz-content">
                <div>퀴즈 제목 {quizTitle}</div>
                {questionGet ? (
                    <Question questionGet={questionGet} updateQuestion={updateQuestion} />
                ) : (
                    <div>질문을 선택해주세요</div>
                )}
            </div>
        </div>
    );
}

export default Quiz;