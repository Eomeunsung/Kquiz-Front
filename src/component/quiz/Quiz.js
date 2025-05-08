import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from "react-router-dom";
import "./../../css/Quiz.css"
import Question from "./Question"
import {quizGet} from "./../../api/QuizApi";
import {questionDelete, questionCreate, questionGet} from "./../../api/QuestionApi"

function Quiz(props) {
    const location = useLocation();
    const quizId = location.state;
    console.log(quizId)
    const [questions, setQuestions] = useState([]);
    const [questionGet, setQuestionGet] = useState(null);
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);

    useEffect(() => {
        quizGet(quizId)
            .then((res)=>{
                const data = res.data;
                if (data.questions && data.questions.length > 0) {
                    setQuestions(data.questions);
                    setQuestionGet(data.questions[0]);
                }
            })
            .catch(err=>{

        })
    },[quizId]);

    //기존에 있는 question과 update된 questuon id 비교후 같으면 교체
    const updateQuestion = (updatedQuestion) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === updatedQuestion.id ? updatedQuestion : question
            )
        );
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

    return (
        <div className="quiz-page">
            <div className="quiz-nav-bar">
                <ul>
                    <li onClick={addQuestion}>질문 추가</li>
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