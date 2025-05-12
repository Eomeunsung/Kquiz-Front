import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "./../../css/GamePlayHost.css"
function GamePlayHost(props) {
    // useLocation 훅을 통해, URL에서 전달된 게임 정보 가져오기
    const location = useLocation();
    // 상태 변수들 초기화
    const [quiz, setQuiz] = useState(null);  // 퀴즈 정보
    const [questionIndex, setQuestionIndex] = useState(0);  // 현재 질문 번호
    const [remainingTime, setRemainingTime] = useState(0);  // 남은 시간
    const [isGameOver, setIsGameOver] = useState(false);  // 게임 종료 여부
    const stompClient = useRef(null);
    console.log()
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("연결 완료 - 전체 문제 수신 대기");
                // 전체 문제 목록 구독
                stompClient.current.subscribe(`/topic/game/${location.state.gameId}`, (message) => {
                   console.log("구독 성공 "+JSON.stringify(message.body));
                });
            },
        });

        stompClient.current.activate();
        return () => {
            stompClient.current.deactivate();
        };
    }, [location.state.gameId]);
    // 서버로 게임 시작 요청 전송
    const startGame = () => {
        if (stompClient.current && stompClient.current.connected) {
            stompClient.current.send(`/app/game/${location.state.gameId}`, {}, {});
            console.log("🚀 게임 시작 요청 전송");
        }
    };
    // console.log("받아온 데이터 "+JSON.stringify(location.state.quizInfo.questions[0]));
    useEffect(() => {
        // location.state로 전달된 퀴즈 정보가 있을 때, 이를 상태에 설정
        if (location.state && location.state.quizInfo) {
            setQuiz(location.state.quizInfo);

            // 첫 번째 문제의 타이머를 가져와서 설정
            const firstQuestion = location.state.quizInfo.questions[0];
            setRemainingTime(firstQuestion?.time || 10);  // 타이머 값 (없으면 기본 10초)
        }
    }, [location.state]);

    useEffect(() => {
        // console.log("퀴즈 "+JSON.stringify(quiz))
        // quiz나 quiz.questions이 없으면 렌더링하지 않도록 처리
        if (!quiz || !quiz.questions) return;
        // 남은 시간이 0 이하가 되면 다음 문제로 넘어가거나 게임 종료 처리
        if (remainingTime <= 0) {
            // 아직 문제 목록이 남아있으면 다음 문제로 넘어감
            if (questionIndex < quiz.questions.length - 1) {
                setQuestionIndex(prevIndex => prevIndex + 1);  // 문제 번호 증가
                const nextQuestion = quiz.questions[questionIndex + 1];
                setRemainingTime(nextQuestion?.time || 10);  // 다음 문제 타이머 설정
            } else {
                setIsGameOver(true);  // 모든 문제가 끝났으면 게임 종료 처리
            }
        } else {
            // 타이머를 매 초마다 1초씩 감소시킴
            const timer = setInterval(() => {
                setRemainingTime(prev => prev - 1);  // 1초씩 남은 시간 감소
            }, 1000);

            // 컴포넌트가 unmount되거나 remainingTime이 변경되면 타이머를 clear
            return () => clearInterval(timer);
        }
    }, [remainingTime, questionIndex, quiz]);  // 타이머가 변경될 때마다 실행

    // quiz가 아직 로드되지 않으면 로딩 중 화면 표시
    if (!quiz) return <div className="loading">로딩 중...</div>;

    // 현재 문제 정보 가져오기
    const question = quiz.questions[questionIndex];
    return (
        <div className="game-host-wrapper">
            {isGameOver ? (
                // 게임 종료 화면
                <div className="game-over">
                    <h2>게임 종료!</h2>
                    <p>모든 문제가 종료되었습니다. 결과를 확인해주세요!</p>
                </div>
            ) : (
                // 퀴즈 문제 화면
                <div className="game-box">
                    <div className="game-header">
                        <div className="game-info">문제 {questionIndex + 1} / {quiz.questions.length}</div>
                        <div className="timer-box">{remainingTime}초</div>
                    </div>
                    <div className="question-text">{question.content}</div>
                    <div className="choices-container">
                        {question.choices.map((choice, idx) => (
                            <div className="choice-card" key={choice.id}>
                                <span className="choice-label">{String.fromCharCode(65 + idx)}</span>
                                {choice.content}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default GamePlayHost;