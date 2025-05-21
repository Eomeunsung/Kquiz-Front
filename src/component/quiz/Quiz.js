import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import "./../../css/Quiz.css";
import "./../../css/Question.css";
import { quizGet, quizUpdate } from "./../../api/QuizApi";
import { questionDelete, questionCreate, questionGet } from "./../../api/QuestionApi";
import ReactQuill from "react-quill";
import { modules } from "../../config/quill/QuillModules";
import { formats } from "../../config/quill/ToobarOption";
import 'react-quill/dist/quill.snow.css';
import { CiCirclePlus } from "react-icons/ci";
import { BiXCircle } from "react-icons/bi";
import { choiceCreate } from "../../api/ChoiceApi";

function Quiz() {
    const location = useLocation();
    const navigate = useNavigate();
    const quizId = location.state;
    const [questionList, setQuestionList] = useState([]);
    const [question, setQuestion] = useState(null);
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [quizTitle, setQuizTitle] = useState('');

    useEffect(() => {
        quizGet(quizId)
            .then((res) => {
                const data = res.data;
                setQuizTitle(data.title);
                if (data.questions && data.questions.length > 0) {
                    setQuestionList(data.questions);
                    setQuestion(data.questions[0]);
                    setSelectedQuestionId(data.questions[0].id);
                }
            })
            .catch(() => {
                alert("다시 시도해 주시기 바랍니다.");
                navigate("/");
            });
    }, [quizId]);

    const updateQuestion = (updatedQuestion) => {
        setQuestionList((prev) =>
            prev.map((q) =>
                q.id === updatedQuestion.id ? updatedQuestion : q
            )
        );
    };

    const addQuestion = () => {
        questionCreate(quizId)
            .then((res) => {
                setQuestionList(prev => [...prev, res.data]);
                setQuestion(res.data);
                setSelectedQuestionId(res.data.id);
            });
    };

    const deleteQuestion = (id) => {
        if (questionList.length === 1) {
            alert("퀴즈가 하나 남아서 삭제 안됩니다.");
            return;
        }
        questionDelete(id)
            .then(() => {
                setQuestionList(prev => prev.filter(q => q.id !== id));
                if (selectedQuestionId === id) {
                    const next = questionList.find(q => q.id !== id);
                    setQuestion(next || null);
                    setSelectedQuestionId(next?.id || null);
                }
            })
            .catch(() => alert("다시 시도해 주시기 바랍니다."));
    };

    const handleSave = () => {
        const updatedList = questionList.map(q =>
            q.id === question.id ? question : q
        );
        const data = {
            id: quizId,
            title: quizTitle,
            questions: updatedList,
        };
        quizUpdate(data).then(() => alert("저장되었습니다."));
    };

    // 선택지 조작 핸들러
    const handleChoiceChange = (index, newText) => {
        const updated = { ...question };
        updated.choices[index].content = newText;
        setQuestion(updated);
    };

    const handleCheckboxChange = (index) => {
        const updated = { ...question };
        updated.choices[index].isCorrect = !updated.choices[index].isCorrect;
        setQuestion(updated);
    };

    const handleDeleteChoice = (index) => {
        const updated = { ...question };
        updated.choices = updated.choices.filter((_, i) => i !== index);
        setQuestion(updated);
    };

    const handleAddChoice = () => {
        choiceCreate(question.id)
            .then((res) => {
                const updated = { ...question };
                updated.choices.push(res.data);
                setQuestion(updated);
            });
    };

    const handleSaveQuestion = (currentQuestion) =>{
        setQuestionList(prev => prev.map(q=>q.id === currentQuestion.id ? currentQuestion : q));
    }
    const handleChangeQuestion = (updateQuestion) => {
        handleSaveQuestion({ ...question }); // 복사하여 강제로 최신값 전달
        setQuestion(updateQuestion)
    }

    if (!question) return (<div>로딩중...</div>);

    return (
        <div className="quiz-page">
            <div className="quiz-nav-bar">
                <ul>
                    <li onClick={addQuestion}>질문 추가</li>
                    <li style={{ color: 'blue', cursor: 'pointer' }} onClick={handleSave}>💾 저장하기</li>
                    {questionList.map((q, idx) => (
                        <li
                            key={q.id}
                            className={`quiz-nav-item ${selectedQuestionId === q.id ? 'active' : ''}`}
                            onClick={() => { handleChangeQuestion(q) }}

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
                <div>퀴즈 제목: {quizTitle}</div>

                <div className="question-layout">
                    <div className="question-main">
                        <h3 className="question-title">
                            질문
                            <input
                                className="question-input"
                                value={question.title || ''}
                                onChange={(e) => setQuestion({ ...question, title: e.target.value })}
                                placeholder="질문을 입력하세요"
                            />
                        </h3>

                        <ReactQuill
                            className="quill-container"
                            theme="snow"
                            modules={modules}
                            format={formats}
                            value={question.content || ''}
                            onChange={(content) => setQuestion({ ...question, content })}
                        />

                        <div className="choice-container">
                            {question.choices.map((choice, index) => (
                                <div className="choice-item" key={index}>
                                    <input
                                        className="choice-input"
                                        type="text"
                                        placeholder={`선택지 ${index + 1}`}
                                        value={choice.content}
                                        onChange={(e) => handleChoiceChange(index, e.target.value)}
                                    />
                                    <div className="choice-actions">
                                        <div className="correct-answer-container">
                                            <CiCirclePlus className="correct-answer-label" />
                                            <input
                                                type="checkbox"
                                                checked={choice.isCorrect}
                                                onChange={() => handleCheckboxChange(index)}
                                            />
                                        </div>
                                        <BiXCircle className="delete-button" onClick={() => handleDeleteChoice(index)} />
                                    </div>
                                </div>
                            ))}
                            <div className="add-choice-button" onClick={handleAddChoice}>
                                + 선택지 추가하기
                            </div>
                        </div>
                    </div>

                    <div className="question-sidebar">
                        <h4>옵션 설정</h4>
                        <div className="option-item">
                            <label>⏱ 시간 제한</label>
                            <div className="option-control">
                                <button onClick={() => setQuestion({ ...question, option: { ...question.option, time: question.option.time - 5 } })}>-</button>
                                <span>{question.option.time} 초</span>
                                <button onClick={() => setQuestion({ ...question, option: { ...question.option, time: question.option.time + 5 } })}>+</button>
                            </div>
                        </div>

                        <div className="option-item">
                            <label>🤖 AI 사용</label>
                            <input
                                type="checkbox"
                                checked={question.option.useAiFeedBack}
                                onChange={(e) =>
                                    setQuestion({ ...question, option: { ...question.option, useAiFeedBack: e.target.checked } })
                                }
                            />
                        </div>

                        <div className="option-item">
                            <label>🧠 AI 힌트 답변</label>
                            <div className="option-display">{question.option.aiQuestion}</div>
                        </div>

                        <div className="option-item">
                            <label>💡 힌트 입력</label>
                            <input
                                type="text"
                                value={question.option.commentary}
                                onChange={(e) =>
                                    setQuestion({ ...question, option: { ...question.option, commentary: e.target.value } })
                                }
                            />
                        </div>

                        <div className="option-item">
                            <label>📊 배점 설정</label>
                            <div className="option-control">
                                <button onClick={() =>
                                    setQuestion({ ...question, option: { ...question.option, score: question.option.score - 1 } })
                                }>-</button>
                                <span>{question.option.score} 점</span>
                                <button onClick={() =>
                                    setQuestion({ ...question, option: { ...question.option, score: question.option.score + 1 } })
                                }>+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Quiz;
