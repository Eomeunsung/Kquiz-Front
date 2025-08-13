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

    const [isGameOver, setIsGameOver] = useState(false);  // 게임 종료 여부
    const stompClient = useRef(null);
    const [isReady, setIsReady] = useState(true);  // 준비 시간 상태
    const [rank, setRank] = useState(null);


    const [status, setStatus] = useState("READY");
    const [questionIndex, setQuestionIndex] = useState(0);  // 현재 질문 번호
    const [questionInfo, setQuestionInfo] = useState(null);
    const [timer, setTimer] = useState(0); //남은 시간

    useEffect(() => {
        if (!location.state) {
            // 렌더링 전에 조건 처리
            console.log("게임 끊김")
            alert("네트워크가 끊겼습니다.");
            navigate("/");
        }
    }, [location.state, navigate]);

    // useEffect(()=>{
    //     setQuestionIndex(location.state.questionSize)
    // },[location.state])

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        console.log("방 번호 "+location.state.gameId);
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                userId: localStorage.getItem("userId"),
                roomId: location.state.gameId,
                name: localStorage.getItem("name"),
                type:"GAME_START"
            },

            onConnect: () => {
                console.log("연결 완료 - 전체 문제 수신 대기");
                // 전체 문제 목록 구독 | 게임 스코어 및 스코어 반환
                stompClient.current.subscribe(`/topic/game/${location.state.gameId}`, (message) => {
                   console.log("구독 성공 "+JSON.stringify(message.body));
                   const data = JSON.parse(message.body);
                   if(data.type==="SCORE"){
                       setRank(data.scores);
                   }
                });
                // Question 받아오기
                stompClient.current.subscribe(`/topic/quiz/${location.state.gameId}`, (message) => {
                    // console.log("quiz가져오기 성공 "+message.body);
                    const quizData = JSON.parse(message.body);
                    console.log("퀘스천 웹 소켓 "+JSON.stringify(quizData));
                    if(quizData.type==="QUESTION") {
                        setQuestionInfo(quizData.question)
                        setTimer(quizData.question.option.time);
                        if(status !== "QUESTION_LAST_TIMER"){
                            setStatus("QUESTION_TIMER")
                        }
                        setQuestionIndex(prev=>prev+1);
                        console.log("받아온 퀘스천 인덱스 "+questionIndex)
                    }
                });
                stompClient.current.subscribe(`/topic/timer/${location.state.gameId}`, (message) => {
                    const data = JSON.parse(message.body);
                    console.log("Timer 연결 콘솔 "+JSON.stringify(data));
                    if(data.type==="READY_COUNT"){
                        setStatus(data.type)
                        setTimer(data.timer);
                    }else if(data.type==="START"){
                        setStatus(data.type)
                        setIsReady(false)
                    }else if(data.type==="QUESTION_TIMER"){
                        setTimer(data.timer);
                    }else if(data.type==="QUESTION"){
                        setStatus(data.type)
                    }
                });

                stompClient.current.subscribe(`/topic/game/${location.state.gameId}`, (message) => {
                    const data = JSON.parse(message.body);
                    console.log("GAME 연결 콘솔 "+JSON.stringify(data));
                    if(data.type==="GAME_OVER"){
                        console.log("게임 종료")
                        setIsGameOver(prev=>!prev)
                        setStatus(data.type)
                    }
                });

            },
        });

        stompClient.current.activate();
        return () => {
            stompClient.current.deactivate();
        };
    }, [location.state]);



    //퀘스천 Timer
    useEffect(()=>{
        if(status==="QUESTION_TIMER"){
            if (stompClient.current?.connected) {
                stompClient.current.publish({
                    destination: `/app/timer/${location.state.gameId}`,
                    body: JSON.stringify({
                        type:"QUESTION_TIMER",
                        time: timer
                    }),
                });
            }
        }else if(status==="QUESTION_LAST_TIMER"){
            if (stompClient.current?.connected) {
                stompClient.current.publish({
                    destination: `/app/timer/${location.state.gameId}`,
                    body: JSON.stringify({
                        type:"QUESTION_LAST_TIMER",
                        time: timer
                    }),
                });
            }

        }    },[status, timer])

    // 문제 받아오기
    useEffect(() => {
        console.log("현재 문제 번호 "+questionIndex+" 퀘스천 문제 갯수 "+location.state.questionSize);
        if(questionIndex<location.state.questionSize && (status === "START" || status === "QUESTION")) {
            if(questionIndex===location.state.questionSize-1){
                if (stompClient.current?.connected) {
                    stompClient.current.publish({
                        destination: `/app/quiz/${location.state.gameId}`,
                        body: JSON.stringify({questionKey: questionIndex}),
                    });
                    setStatus("QUESTION_LAST_TIMER");
                }
            }else{
                if (stompClient.current?.connected) {
                    stompClient.current.publish({
                        destination: `/app/quiz/${location.state.gameId}`,
                        body: JSON.stringify({questionKey: questionIndex}),
                    });
                }
            }

        }
    }, [status]);


    //시작 전 카운터 다운
    useEffect(() => {
        if(status==="READY_COUNT"){
            if(stompClient.current && stompClient.current.connected) {
                stompClient.current.publish({
                    destination: `/app/timer/${location.state.gameId}`,
                    body: JSON.stringify({
                        type:"READY_COUNT",
                        time: timer,
                    })
                });
            }
        }
    }, [timer, status]);




    // quiz가 아직 로드되지 않으면 로딩 중 화면 표시
    if (!questionInfo || isReady)
        return (
            <div className="loading">
                {isReady ? (
                    <div>{timer}</div>
                ) : (
                    <div>{message}</div>
                )}
            </div>
        );

    return (
        <div className="game-host-layout">
            <div className="game-main">
                {isGameOver ? (
                    <div className="game-over">
                        {
                            rank ? (
                                rank.map((item, index) => (
                                    <div key={index}>
                                        <div>순위 {index+1}</div>
                                        <div>이름: {item.username}</div>
                                        <div>점수: {item.score}</div>
                                    </div>
                                ))
                            ):(
                                <div>로딩중...</div>
                            )
                        }
                    </div>
                ) : (

                    <div className="game-box">
                        <div className="game-box-inner">
                            {/* 왼쪽 사용자 힌트 */}
                            {questionInfo.option.useCommentary && (
                                <div className="commentary-box">
                                    <h3>사용자 힌트</h3>
                                    <p>{questionInfo.option.commentary}</p>
                                </div>
                            )}

                            {/* 가운데 문제 내용 */}
                            <div className="question-main">
                                <h2>{questionInfo.title}</h2>
                                <div className="game-header">
                                    <div className="timer-box">{timer}초</div>
                                </div>
                                <div
                                    className="question-content"
                                    dangerouslySetInnerHTML={{__html: questionInfo.content}}
                                ></div>
                                <div className="choices-container">
                                    {questionInfo.choices.map((choice, idx) => (
                                        <div className="choice-card" key={choice.id}>
                                            <span className="choice-label">{String.fromCharCode(65 + idx)}</span>
                                            {choice.content}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 오른쪽 AI 힌트 */}
                            {questionInfo.option.useAiFeedBack && (
                                <div className="hint-sidebar">
                                    <h3>AI 힌트</h3>
                                    <p>{questionInfo.option.aiQuestion}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GamePlayHost;