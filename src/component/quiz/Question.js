import React, {useEffect, useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import "../../css/Question.css"
import { BiXCircle } from "react-icons/bi";
import { CiCirclePlus } from "react-icons/ci";
import {choiceCreate} from "./../../api/ChoiceApi";
import {questionUpdate} from "./../../api/QuestionApi";

function Question({questionGet, updateQuestion}) {
    console.log(questionGet);
    const [question, setQuestion] = useState(null);
    const [choices, setChoices] = useState([]);
    const [option, setOption] = useState(null);

    useEffect(() => {
        if(question && choices && option){
            saveQuestion()
        }
        const questionData = {
            id: questionGet.id,
            title: questionGet.title,
            content: questionGet.content,
        }
        setQuestion(questionData);
        setChoices(questionGet.choices);
        setOption(questionGet.option);
    },[questionGet.id])

    const saveQuestion = () => {
        const data = {
            id: question.id,
            title: question.title,
            content: question.content,
            choices: choices,
            option: option,
        }
        questionUpdate(data)
            .then((result) => {
                updateQuestion(result.data)
        }).catch((err) => {})
    }

    // 선택지 입력 값 수정 핸들러
    const handleChoiceChange = (index, newText) => {
        const updatedChoices = [...choices];
        updatedChoices[index].content = newText;
        setChoices(updatedChoices);
    };

    // 체크 박스
    const handleCheckboxChange = (index) => {
        const updatedChoices = [...choices];
        updatedChoices[index].isCorrect = !updatedChoices[index].isCorrect;
        setChoices(updatedChoices);
    };

    // 선택지 삭제 핸들러
    const handleDeleteChoice = (index) => {
        const updatedChoices = choices.filter((_, i) => i !== index);
        setChoices(updatedChoices);
    };

    // 선택지 추가 핸들러
    const handleAddChoice = (id) => {
        choiceCreate(id)
            .then((res)=>{
                setChoices([...choices, res.data]);
            })
            .catch((err)=>{

            })
        setChoices([...choices, { content: '', isCorrect: false }]);
    };

    if(!question || choices===null){
        return <div>로딩 중...</div>
    }

    return (
        <div className="question-layout">
            <div className="question-main">
                <h3 className="question-title">
                    질문
                    <input
                        className="question-input"
                        value={question?.title || ""}  // question이 null이면 빈 문자열을 사용
                        onChange={(e) => {setQuestion({ ...question, title: e.target.value })}}
                        placeholder="질문을 입력하세요"
                    />
                </h3>
                <ReactQuill className="quill-container" theme="snow"
                            value={question.content}
                            onChange={(content)=>{setQuestion(prev => ({ ...prev, content }))}} />

                <div className="choice-container">
                    {choices.map((choice, index) => (
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
                    <div className="add-choice-button" onClick={() => handleAddChoice(questionGet.id)}>
                        + 선택지 추가하기
                    </div>
                </div>
            </div>

            <div className="question-sidebar">
                <h4>옵션 설정</h4>
                <div className="option-item">
                    <label>⏱ 시간 제한</label>
                    <div className="option-control">
                        <button onClick={() => setOption({ ...option, time: option.time - 5 })}>-</button>
                        <span>{option.time} 초</span>
                        <button onClick={() => setOption({ ...option, time: option.time + 5 })}>+</button>
                    </div>
                </div>

                <div className="option-item">
                    <label>🤖 AI 사용</label>
                    <input
                        type="checkbox"
                        checked={option.useAiFeedBack}
                        onChange={(e) => setOption({ ...option, useAiFeedBack: e.target.checked })}
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
                        onChange={(e) => setOption({ ...option, commentary: e.target.value })}
                        placeholder="힌트를 입력하세요"
                    />
                </div>

                <div className="option-item">
                    <label>📊 배점 설정</label>
                    <div className="option-control">
                        <button onClick={() => setOption({ ...option, score: option.score - 1 })}>-</button>
                        <span>{option.score} 점</span>
                        <button onClick={() => setOption({ ...option, score: option.score + 1 })}>+</button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Question;