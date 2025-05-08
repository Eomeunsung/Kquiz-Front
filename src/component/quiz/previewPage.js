import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../../css/PreviewPage.css";
import { quizGet } from "../../api/QuizApi";

function PreviewPage() {
    const location = useLocation();
    const quizId = location.state;
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0); // ⭐ 현재 문제 번호

    useEffect(() => {
        quizGet(quizId)
            .then((res) => {
                setQuiz(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, [quizId]);

    if (!quiz) return <div className="loading">퀴즈 정보를 불러오는 중...</div>;

    const currentQuestion = quiz.questions[currentIndex];

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < quiz.questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <div className="preview-page">
            <h2 className="preview-title">{quiz.title || '퀴즈 제목'}</h2>

            <div className="question-preview">
                <div className="question-header">
                    <span className="question-number">Q{currentIndex + 1}</span>
                    <span className="question-time">⏱ {currentQuestion.option?.time || 30}초</span>
                    <span className="question-score">📊 {currentQuestion.option?.score || 100}점</span>
                </div>
                <div className="question-content" dangerouslySetInnerHTML={{__html: currentQuestion.content}}></div>
                <ul className="choice-list">
                    {currentQuestion.choices.map((choice, idx) => (
                        <li key={idx} className="choice-item">
                            {choice.content}
                        </li>
                    ))}
                </ul>

                <div className="navigation-buttons">
                    <button className="nav-button" onClick={handlePrev} disabled={currentIndex === 0}>
                        ← 이전
                    </button>
                    <button className="nav-button" onClick={handleNext} disabled={currentIndex === quiz.questions.length - 1}>
                        다음 →
                    </button>
                </div>
            </div>

            <button className="start-button">
                퀴즈 시작하기
            </button>
        </div>
    );
}

export default PreviewPage;
