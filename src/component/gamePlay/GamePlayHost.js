import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "./../../css/GamePlayHost.css"
function GamePlayHost(props) {
    // useLocation 훅을 통해, URL에서 전달된 게임 정보 가져오기
    const location = useLocation();
    // 상태 변수들 초기화
    const [message, setMessage] = useState("");
    const [questionIds, setQuestionIds] = useState(null); //question 아이디 배열로 저장
    const [question, setQuestion] = useState(null); //question 정보
    const [quizTitle, setQuizTitle] = useState(null); //quizTitle
    const [questionIndex, setQuestionIndex] = useState(0);  // 현재 질문 번호
    const [remainingTime, setRemainingTime] = useState(0);  // 남은 시간
    const [isGameOver, setIsGameOver] = useState(false);  // 게임 종료 여부
    const stompClient = useRef(null);
    // console.log("게임 시작 주소 "+location.state.gameId);
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");

        stompClient.current = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                userId: localStorage.getItem("userId"),
                roomId: location.state.gameId,
                name: localStorage.getItem("name"),
                type:"GAME"
            },

            onConnect: () => {
                console.log("연결 완료 - 전체 문제 수신 대기");
                // 전체 문제 목록 구독
                stompClient.current.subscribe(`/topic/game/${location.state.gameId}`, (message) => {
                   // console.log("구독 성공 "+JSON.stringify(message.body));
                   const data = JSON.parse(message.body);
                   setMessage(data.content);
                });
                stompClient.current.subscribe(`/topic/quiz/${location.state.gameId}`, (message) => {
                    // console.log("quiz가져오기 성공 "+message.body);
                    const quizData = JSON.parse(message.body);
                    if(quizData.type==="QUESTION"){
                        // console.log("question가져오기 성공 "+message.body);
                        setQuestion(quizData.question);
                    }else{
                        // setQuiz(JSON.parse(message.body));
                        setQuestionIds(quizData.questionId);
                        setQuizTitle(quizData.title);
                        setQuestionIndex(quizData.questionId[0])
                        setQuestionIds(prevIds => {
                            const newIds = [...prevIds];  // 기존 배열을 복사한 후
                            newIds.shift();  // 맨 앞 아이템 제거
                            return newIds;  // 새로운 배열 반환
                        });
                    }

                });
            },
        });

        stompClient.current.activate();
        return () => {
            stompClient.current.deactivate();
        };
    }, [location.state.gameId]);

    // useEffect(() => {
    //     if(!quiz) return
    //     // 첫 번째 문제의 타이머를 가져와서 설정
    //     const firstQuestion = quiz.questions[0];
    //     // console.log("퀘스천 1 "+JSON.stringify(quiz.questions[0].options.time));
    //     setRemainingTime(firstQuestion?.option.time || 10);  // 타이머 값 (없으면 기본 10초)
    //
    // }, [quiz]);
    //
    useEffect(() => {
        if (!question) return;

        // 처음에 타이머를 설정할 때, `question.option.time` 값이 존재하는지 확인
        if (remainingTime <= 0) {
            if (questionIds.length > 0) {
                setQuestionIndex(prevIndex => {
                    const nextIndex = questionIds[0];
                    setQuestionIds(prevIds => prevIds.slice(1)); // Remove first item
                    return nextIndex;
                });
                // `question.option.time`이 없으면 기본 10초를 설정, 있으면 해당 시간으로 설정
                const nextQuestionTime = question?.option?.time || 10;
                setRemainingTime(nextQuestionTime);  // 다음 문제 타이머 설정
            } else {
                setIsGameOver(true);  // 게임 종료
            }
        } else {
            // 타이머가 0초 이하가 되면 다시 1초씩 감소하도록 설정
            const timer = setInterval(() => {
                setRemainingTime(prev => prev - 1);  // 1초씩 남은 시간 감소
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [remainingTime, questionIndex, questionIds, question]);


    useEffect(() => {
        if(questionIndex===0)return
        console.log("퀘스천 인덱스 "+questionIndex)
        if (stompClient.current && stompClient.current.connected) {
            stompClient.current.publish({
                destination: `/app/quiz/${location.state.gameId}`, // ✅ 여기 수정!
                body: JSON.stringify({
                    questionId: questionIndex
                }),
            });
        }
    }, [questionIndex]);
    // quiz가 아직 로드되지 않으면 로딩 중 화면 표시
    if (!question) return <div className="loading">{message}</div>;

    if(question) console.log("question 저장 "+JSON.stringify(question))

    // // 현재 문제 정보 가져오기
    // const question = quiz.questions[questionIndex];
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
                    <h2>{quizTitle}</h2>
                    <div className="game-header">
                        {/*<div className="game-info">문제 {questionIndex + 1} / {quiz.questions.length}</div>*/}
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