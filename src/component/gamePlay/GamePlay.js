import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "./../../css/GamePlayHost.css"
function GamePlayHost(props) {
    // useLocation 훅을 통해, URL에서 전달된 게임 정보 가져오기
    const location = useLocation();
    const navigate = useNavigate();

    // 상태 변수들 초기화
    const [message, setMessage] = useState("");
    const [question, setQuestion] = useState(null); //question 정보
    const [remainingTime, setRemainingTime] = useState(0);  // 남은 시간
    const [isGameOver, setIsGameOver] = useState(false);  // 게임 종료 여부
    const stompClient = useRef(null);

    const [isReady, setIsReady] = useState(true);  // 준비 시간 상태
    const [readyTime, setReadyTime] = useState(10); // 10초 준비 시간

    const [selectedChoiceId, setSelectedChoiceId] = useState([]); //선택지 id
    const [hasSubmitted, setHasSubmitted] = useState(false); // 중복 제출 방지
    const [score, setScore] = useState(0);

    const [rank, setRank] = useState(null);
    const headerinit = {
        userId: localStorage.getItem("userId"),
        roomId: location.state.gameId,
        name: localStorage.getItem("name"),
        type:"GAME"
    }
    useEffect(() => {
        if (!location.state || !location.state.gameId) {
            // 렌더링 전에 조건 처리
            console.log("게임 끊김")
            alert("네트워크가 끊겼습니다.");
            navigate("/");
        }
    }, [location.state, navigate]);

    // console.log("게임 시작 주소 "+location.state.gameId);
    useEffect(() => {
        if (!location.state || !location.state.gameId) return;
        const socket = new SockJS("http://localhost:8080/ws");

        stompClient.current = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                headerinit
            },

            onConnect: () => {
                console.log("연결 완료 - 전체 문제 수신 대기");
                // 전체 문제 목록 구독
                stompClient.current.subscribe(`/topic/game/${location.state.gameId}`, (message) => {
                    console.log("게임 끝 받은 점수 "+JSON.stringify(message.body));
                    const data = JSON.parse(message.body);
                    if(data.type==="SCORE") {
                        setRank(data.scores);
                        setIsGameOver(true)
                    }
                    // setMessage(data.content);
                });

                stompClient.current.subscribe(`/topic/game/${headerinit.userId}`, (message) => {
                    console.log("구독 성공 "+JSON.stringify(message.body));
                    const data = JSON.parse(message.body);
                    setScore(data);
                    // setMessage(data.content);
                });

                stompClient.current.subscribe(`/topic/quiz/${location.state.gameId}`, (message) => {
                    // console.log("quiz가져오기 성공 "+message.body);
                    const quizData = JSON.parse(message.body);
                    if(quizData.type==="QUESTION"){
                        setSelectedChoiceId([]);
                        setQuestion(quizData.question);
                        setHasSubmitted(false);
                        setIsReady(false)
                    }
                });

                //timer 계산
                stompClient.current.subscribe(`/topic/timer/${location.state.gameId}`, (message) => {
                    const timerData = JSON.parse(message.body);
                    console.log(JSON.stringify(timerData))
                    if(timerData.type==="READY"){
                        setReadyTime(timerData.time);
                        setIsReady(timerData.flag);
                    }else if(timerData.type==="START"){
                        setIsReady(timerData.flag);
                        setRemainingTime(timerData.time);
                    }else if(timerData.type==="TIMER"){
                        setRemainingTime(timerData.time);
                    }
                })
            },
        });
        stompClient.current.activate();
        return () => {
            stompClient.current.deactivate();
        };
    }, [location.state]);


    //includes 이미 ID가 배열에 있을 경우 filter로 그 ID 해제 아니면 추가
    const toggleChoice = (choiceId) => {
        if(hasSubmitted){return}
        setSelectedChoiceId((prev)=>
            prev.includes(choiceId) ? prev.filter((id)=> id !== choiceId)
                : [...prev, choiceId]
        );
    }

    //초이스 보내기
    const handeChoiceSubmit = (choice) => {
        setHasSubmitted(true)
        const isCorrect = question.choices.filter(choice => choice.isCorrect).map(choice => choice.id);
        if(isCorrect){
            if (stompClient.current && stompClient.current.connected) {
                stompClient.current.publish({
                    destination: `/app/game/${location.state.gameId}`,
                    body: JSON.stringify({
                        score: question.option.score,
                        userId: localStorage.getItem("userId"),
                        type:"SCORE"
                    }),
                });
            }
        }


    }

    // quiz가 아직 로드되지 않으면 로딩 중 화면 표시
    if (isReady) return <div className="loading">{isReady ? (<div>{readyTime}</div>):<div>{message}</div> }</div>;
    if(!question) return <div>퀴즈가 없음</div>
    return (
        <div className="game-host-layout">
            <div className="game-main">
                {isGameOver ? (
                    <div className="game-over">
                        {
                            rank ? (
                                rank.map((item, index) => (
                                    <div key={index}>
                                        <div>순위 {index + 1}</div>
                                        <div>이름: {item.username}</div>
                                        <div>점수: {item.score}</div>
                                    </div>
                                ))
                            ) : (
                                <div>로딩중...</div>
                            )
                        }
                    </div>
                ) : (
                    <div className="game-box">
                        <h2>{question.title}</h2>
                        <div className="game-header">
                            <div className="timer-box">{remainingTime}초</div>
                            <div className="score-box">점수 {score}</div>
                        </div>
                        <div
                            className="question-content"
                            dangerouslySetInnerHTML={{__html: question.content}}
                        ></div>
                        <div className="choices-container">
                            {question.choices.map((choice, idx) => (
                                <div className={`choice-card ${selectedChoiceId.includes(choice.id) ? 'selected' : ''}`}
                                     key={choice.id} onClick={() => toggleChoice(choice.id)}>
                                    <span className="choice-label">{String.fromCharCode(65 + idx)}</span>
                                    {choice.content}
                                </div>
                            ))}
                        </div>
                        {
                            hasSubmitted ?
                                (<div className="text-submit"> 제출 되었습니다.</div>)
                                : (<button className="choice-submit" onClick={handeChoiceSubmit
                                }>제출하기
                                </button>)
                        }

                    </div>
                )}
            </div>

            {question.option.useAiFeedBack && (
                <div className="hint-sidebar">
                <h3>힌트</h3>
                    <p>{question.option.aiQuestion}</p>
                </div>
            )}
        </div>
    );
}

export default GamePlayHost;