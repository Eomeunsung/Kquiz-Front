import React, {useEffect, useRef, useState} from 'react';
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
import {changeImg, extractImgUrls} from "./../../config/ChangeImg"
import {fileUpload, changeImgApi} from "./../../api/FileApi"

function Quiz() {
    const location = useLocation();
    const navigate = useNavigate();
    const quizId = location.state;
    const [questionList, setQuestionList] = useState([]);
    const [question, setQuestion] = useState(null);
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [quizTitle, setQuizTitle] = useState('');
    const [questionTitle, setQuestionTitle] = useState('');
    const [content, setContent] = useState('');
    const [option, setOption] = useState(null);
    const [choice, setChoice] = useState([]);
    const [imgUrls, setImgUrls] = useState([]);

// 퀴즈 ID가 변경될 때마다 퀴즈 데이터를 서버에서 불러옴
    useEffect(() => {
        quizGet(quizId) // 서버에서 퀴즈 데이터 가져오기
            .then((res) => {
                const data = res.data;
                setQuizTitle(data.title); // 퀴즈 제목 설정
                if (data.questions && data.questions.length > 0) {
                    setQuestionList(data.questions); // 전체 질문 리스트 저장
                    setQuestion(data.questions[0]); // 첫 번째 질문을 현재 선택된 질문으로 설정
                    setSelectedQuestionId(data.questions[0].id); // 선택된 질문 ID 설정
                    setQuestionTitle(data.questions[0].title); // 현재 질문의 제목 설정
                    setContent(data.questions[0].content); // 현재 질문의 본문 설정
                    setChoice(data.questions[0].choices); // 현재 질문의 선택지 목록 설정
                    setOption(data.questions[0].option); // 현재 질문의 옵션 설정
                }
            })
            .catch(() => {
                alert("다시 시도해 주시기 바랍니다.");
                navigate("/"); // 실패 시 홈으로 이동
            });
    }, [quizId]);


    // 새로운 질문 추가
    const addQuestion = () => {
        questionCreate(quizId) // 새로운 질문 생성 API 호출
            .then((res) => {
                setQuestionList(prev => [...prev, res.data]); // 기존 질문 리스트에 새 질문 추가
                setQuestion(res.data); // 새 질문을 현재 선택된 질문으로 설정
                // setSelectedQuestionId(res.data.id); // 선택된 질문 ID도 설정하고 싶다면 주석 해제
            });
    };

    // 질문 삭제
    const deleteQuestion = (id) => {
        if (questionList.length === 1) {
            alert("퀴즈가 하나 남아서 삭제 안됩니다.");
            return;
        }
        questionDelete(id) // 서버에서 질문 삭제
            .then(() => {
                setQuestionList(prev => prev.filter(q => q.id !== id)); // 리스트에서 해당 질문 제거
                if (selectedQuestionId === id) {
                    // 삭제한 질문이 현재 선택된 질문이면, 다른 질문으로 전환
                    const next = questionList.find(q => q.id !== id);
                    setQuestion(next || null);
                    setSelectedQuestionId(next?.id || null);
                }
            })
            .catch(() => alert("다시 시도해 주시기 바랍니다."));
    };

    // 퀴즈 전체 저장 (모든 질문 포함)
    const handleSave = (questions) =>{
        const formData = new FormData();
        const updateList = questions.map((question, index)=>{
            const { updatedContent, newUrlimgList, newNameimg } = changeImg(question.content);
            if(newUrlimgList){
                newUrlimgList.forEach((file)=>{
                    formData.append("files", file);
                })
            }
            return {
                ...question,               // 기존 question의 모든 속성을 그대로 복사
                content: updatedContent,   // content만 이미지가 반영된 새로운 값으로 덮어씀
            }

        })

        // 위 예시 기준으로:
        // allImgs === ["img1.png", "img2.png", "img3.png"]
        const allImgs = updateList.flatMap(question => extractImgUrls(question.content));
        console.log("퀘스천 내용 이미지 "+allImgs);
        const changeImgs ={
            id: quizId,
            img: allImgs,
        }
        const data = {
            id: quizId,
            title: quizTitle,
            questions: updateList, // 전체 질문 리스트 포함
        };

        if(formData.getAll("files").length > 0){
            fileUpload(formData, quizId)
                .then((res)=>{
                    quizUpdate(data).then(() => alert("저장되었습니다.")); // 서버에 업데이트 요청
                    if(changeImgs){
                        changeImgApi(changeImgs)
                            .then((res)=>{

                            })
                            .catch((err)=>{

                            })
                    }
                })
                .catch((err)=>{
                    alert("저장 실패했습니다. 다시 시도해주시기바랍니다.")
                })
        }else{
            quizUpdate(data).then(() => alert("저장되었습니다.")); // 서버에 업데이트 요청
            if(changeImgs){
                changeImgApi(changeImgs)
                    .then((res)=>{

                    })
                    .catch((err)=>{

                    })
            }
        }
    }
    //현재 선택된 퀘스천 저장
    const handleQuestionSave = () => {
        const idxData = {
            id: selectedQuestionId,
            title: questionTitle,
            content: content,
            choices: choice,
            option: option
        };

        // 현재 선택된 질문이 반영된 새로운 리스트 생성해서 저장 함수에 전달
        const updatedList = questionList.map(q =>
            q.id === idxData.id ? idxData : q
        );

        handleSave(updatedList);

    };



    // 선택지 내용 변경 핸들러
    const handleChoiceChange = (index, newText) => {
        const updatedChoices = choice.map((c, i) =>
            i === index ? { ...c, content: newText } : c // 해당 index의 선택지 내용 변경
        );
        setChoice(updatedChoices); // 상태 업데이트
    };

    // 정답 체크박스 토글 핸들러
    const handleCheckboxChange = (index) => {
        const updatedChoices = choice.map((c, i) =>
            i === index ? { ...c, isCorrect: !c.isCorrect } : c // 해당 선택지의 정답 여부 토글
        );
        setChoice(updatedChoices); // 상태 업데이트
        setQuestion(prev => ({ ...prev, choices: updatedChoices })); // 선택지 수정 사항을 question에도 반영 (옵션에 따라 필요할 수도 있음)
    };

    // 선택지 삭제
    const handleDeleteChoice = (index) => {
        const updatedChoices = choice.filter((_, i) => i !== index); // 해당 index의 선택지를 제거
        setChoice(updatedChoices); // 상태 업데이트
        setQuestion(prev => ({ ...prev, choices: updatedChoices })); // question에도 반영 (옵션)
    };

    // 새로운 선택지 추가
    const handleAddChoice = () => {
        choiceCreate(question.id) // 새로운 선택지 생성 API 호출
            .then((res) => {
                const updatedChoices = [...choice, res.data]; // 기존 선택지에 추가
                setChoice(updatedChoices); // 상태 업데이트
                setQuestion(prev => ({ ...prev, choices: updatedChoices })); // question에도 반영 (옵션)
            });
    };

    // 현재 질문 저장 (질문 리스트에 반영)
    const handleSaveQuestion = (currentQuestion) => {
        console.log("세이브 퀘스천 " + JSON.stringify(currentQuestion));
        setQuestionList(prev => prev.map(q =>
            q.id === currentQuestion.id ? currentQuestion : q // 해당 질문을 최신 값으로 대체
        ));
        console.log("전체 question 리스트 " + JSON.stringify(questionList));
    };

    // 질문 선택 시 호출
    const handleChangeQuestion = (updateQuestion) => {
        const data = {
            id: selectedQuestionId,
            title: questionTitle,
            content: content,
            choices: choice,
            option: option
        };
        handleSaveQuestion(data); // 현재 질문 저장
        setQuestion(updateQuestion); // 새로운 질문으로 전환
        setSelectedQuestionId(updateQuestion.id); // 선택된 질문 ID 변경
        setQuestionTitle(updateQuestion.title); // 제목 변경
        setContent(updateQuestion.content); // 본문 변경
        setChoice(updateQuestion.choices); // 선택지 변경
        setOption(updateQuestion.option); // 옵션 변경
    };


    // useEffect(() => {
    //     localStorage.setItem("questionList", JSON.stringify(questionList));
    // }, [questionList]);

    const quillRef = useRef(null);

    // (디버깅) 확인용
    useEffect(() => {
        const editor = quillRef.current?.getEditor();
        console.log('Loaded modules:', editor?.options.modules);
        console.log('Has imageResize module?', !!editor?.getModule('imageResize'));
    }, []);

    if (!question) return (<div>로딩중...</div>);

    return (
        <div className="quiz-page">
            <div className="quiz-nav-bar">
                <ul>
                    <li onClick={addQuestion}>질문 추가</li>
                    <li style={{ color: 'blue', cursor: 'pointer' }} onClick={handleQuestionSave}>💾 저장하기</li>
                    {questionList.map((q, idx) => (
                        <li
                            key={q.id}
                            className={`quiz-nav-item ${selectedQuestionId === q.id ? 'active' : ''}`}
                            onClick={() => { handleChangeQuestion(q); console.log("선택된 question "+JSON.stringify(q))}}

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
                {!question ? (
                    <div>로딩중..</div>
                ):(
                    <div>
                        <div>퀴즈 제목: {quizTitle}</div>

                        <div className="question-layout">
                            <div className="question-main">
                                <h3 className="question-title">
                                    질문
                                    <input
                                        className="question-input"
                                        value={questionTitle}
                                        onChange={(e) => setQuestionTitle(e.target.value)}
                                    />
                                </h3>

                                <ReactQuill
                                    ref={quillRef}
                                    className="quill-container"
                                    theme="snow"
                                    modules={modules}
                                    formats={formats}
                                    value={content || ''}
                                    onChange={(value) => {
                                        if (value !== null && value !== undefined) {
                                            setContent(value);
                                        }
                                        // null or undefined면 그냥 무시
                                    }}
                                />

                                <div className="choice-container">
                                    {choice.map((choice, index) => (
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
                                                    <CiCirclePlus className="correct-answer-label"/>
                                                    <input
                                                        type="checkbox"
                                                        checked={choice.isCorrect}
                                                        onChange={() => handleCheckboxChange(index)}
                                                    />
                                                </div>
                                                <BiXCircle className="delete-button"
                                                           onClick={() => handleDeleteChoice(index)}/>
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
                                        <button onClick={() => setOption(prev => ({
                                            ...prev,
                                            time: Math.max(0, prev.time - 5)
                                        }))}>-
                                        </button>
                                        <span>{option.time} 초</span>
                                        <button onClick={() => setOption(prev => ({
                                            ...prev,
                                            time: prev.time + 5
                                        }))}>+
                                        </button>
                                    </div>
                                </div>

                                <div className="option-item">
                                    <label>🤖 AI 사용</label>
                                    <input
                                        type="checkbox"
                                        checked={option.useAiFeedBack}
                                        onChange={(e) =>
                                            setOption(prev => ({...prev, useAiFeedBack: e.target.checked}))
                                        }
                                    />
                                </div>

                                <div className="option-item">
                                    <label>🧠 AI 힌트 답변</label>
                                    <div className="option-display">{option.aiQuestion}</div>
                                </div>

                                <div className="option-item">
                                    <label>💡 힌트 입력</label>
                                    <input
                                        type="text"
                                        value={option.commentary}
                                        onChange={(e) =>
                                            setOption(prev => ({...prev, commentary: e.target.value}))
                                        }
                                    />
                                </div>

                                <div className="option-item">
                                    <label>📊 배점 설정</label>
                                    <div className="option-control">
                                        <button onClick={() =>
                                            setOption(prevOption => ({...prevOption, score: prevOption.score - 1}))
                                        }>-
                                        </button>
                                        <span>{option.score} 점</span>
                                        <button onClick={() =>
                                            setOption(prevOption => ({...prevOption, score: prevOption.score + 1}))
                                        }>+
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Quiz;
