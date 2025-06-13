import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../../css/PreviewPage.css";
import "./../../css/GamePlayHost.css"
import { quizGet } from "../../api/quiz/QuizApi";

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
                    <span className="question-time">⏱ 시간 {currentQuestion.option?.time}초</span>
                    <span className="question-score">📊 점수 {currentQuestion.option?.score}점</span>
                </div>

                <div className="game-box">
                    <div className="game-box-inner">
                        {currentQuestion.option.useCommentary && (
                            <div className="commentary-box">
                                <h3>사용자 힌트</h3>
                                <p>{currentQuestion.option.commentary}</p>
                            </div>
                        )}

                        <div className="question-main">
                            <h2>{currentQuestion.title}</h2>
                            <div className="question-content"
                                 dangerouslySetInnerHTML={{ __html: currentQuestion.content }}></div>

                            <ul className="choices-container">
                                {currentQuestion.choices.map((choice, idx) => (
                                    <li className={`choice-card ${choice.isCorrect ? 'correct-choice':''}`} key={choice.id}>
                                        <span className="choice-label">{String.fromCharCode(65 + idx)}</span>
                                        {choice.content}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {currentQuestion.option.useAiFeedBack && (
                            <div className="hint-sidebar">
                                <h3>AI 힌트</h3>
                                <p>{currentQuestion.option.aiQuestion}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="navigation-buttons">
                    <button className="nav-button" onClick={handlePrev} disabled={currentIndex === 0}>
                        ← 이전
                    </button>
                    <button className="nav-button" onClick={handleNext}
                            disabled={currentIndex === quiz.questions.length - 1}>
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
