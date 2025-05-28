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
    const [questionIds, setQuestionIds] = useState([]); //question 아이디 배열로 저장
    const [question, setQuestion] = useState(null); //question 정보
    const [quizTitle, setQuizTitle] = useState(null); //quizTitle
    const [questionIndex, setQuestionIndex] = useState(null);  // 현재 질문 번호
    const [remainingTime, setRemainingTime] = useState(0);  // 남은 시간
    const [isGameOver, setIsGameOver] = useState(false);  // 게임 종료 여부
    const stompClient = useRef(null);
    const [isReady, setIsReady] = useState(true);  // 준비 시간 상태
    const [readyTime, setReadyTime] = useState(3); // 10초 준비 시간
    const [rank, setRank] = useState(null);
    const [quizInfo, setQuizInfo] = useState({});
    const index = useRef(0)
    useEffect(() => {
        if (!location.state) {
            // 렌더링 전에 조건 처리
            console.log("게임 끊김")
            alert("네트워크가 끊겼습니다.");
            navigate("/");
        }
    }, [location.state, navigate]);

    useEffect(()=>{
        setQuizInfo(location.state.quizInfo.questions);
        console.log("게임플레이 "+location.state.quizInfo)
    },[location.state])
    //
    // console.log(quizInfo)
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
                // 전체 문제 목록 구독 | 게임 스코어 및 스코어 반환
                stompClient.current.subscribe(`/topic/game/${location.state.gameId}`, (message) => {
                   console.log("구독 성공 "+JSON.stringify(message.body));
                   const data = JSON.parse(message.body);
                   if(data.type==="SCORE"){
                       setRank(data.scores);
                   }
                   // setMessage(data.content);
                });
                // Question 받아오기
                stompClient.current.subscribe(`/topic/quiz/${location.state.gameId}`, (message) => {
                    // console.log("quiz가져오기 성공 "+message.body);
                    const quizData = JSON.parse(message.body);
                    console.log("퀘스천 웹 소켓 "+JSON.stringify(quizData));
                    if(quizData.type==="QUESTION"){
                        // console.log("question가져오기 성공 "+message.body);
                        // setQuestion(quizData.question);
                        // setRemainingTime(quizData.question.option.time);
                    }else{
                        //퀴즈 정보들 받아오기
                        setQuestionIds(quizData.questionId);
                        setQuizTitle(quizData.title);

                    }
                });

                // //timer 계산기 timer는  /topic/quiz에서 받음
                // stompClient.current.subscribe(`/topic/timer/${location.state.gameId}`, (message) => {
                //     const timerData = JSON.parse(message.body);
                // })
            },
        });

        stompClient.current.activate();
        return () => {
            stompClient.current.deactivate();
        };
    }, [location.state]);

// 1. 타이머 작동: 1초마다 감소
    useEffect(() => {
        if (isReady || question===null) return;
        const timer = setInterval(() => {
            setRemainingTime(prevTime => {
                const newTime = prevTime - 1;
                if (stompClient.current?.connected) {
                    stompClient.current.publish({
                        destination: `/app/timer/${location.state.gameId}`,
                        body: JSON.stringify({
                            type: "TIMER",
                            time: newTime,
                            flag: isReady
                        }),
                    });
                }

                return newTime;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isReady, question, isGameOver]);

// 2. 타이머가 0일 때 문제 넘기기
    useEffect(() => {
        if (isReady || isGameOver || remainingTime > 0) return;

        if (index.current<quizInfo.length) {
            setQuestion(quizInfo[index.current])
            setRemainingTime(quizInfo[index.current].option.time)
            if (stompClient.current?.connected) {
                stompClient.current.publish({
                    destination: `/app/quiz/${location.state.gameId}`,
                    body: JSON.stringify(quizInfo[index.current] ),
                });
            }
            index.current += 1;
        } else {
            setIsGameOver(true);
            if (stompClient.current?.connected) {
                stompClient.current.publish({
                    destination: `/app/game/${location.state.gameId}`,
                    body: JSON.stringify({ type: "END" }),
                });
            }
        }
    }, [remainingTime, isReady, isGameOver, questionIds]);

    // 3. question 플레이어들에게 보냐기
    useEffect(() => {
        if (isReady || questionIndex ===null) return;
        // 새 문제 플레이어들에게 보내기
        if (stompClient.current?.connected) {
            stompClient.current.publish({
                destination: `/app/quiz/${location.state.gameId}`,
                body: JSON.stringify({ question: question }),
            });
        }

    }, [question]);

    //게임 플레이 시작 전  카운터 다운
    useEffect(() => {
        if (!isReady) return;
        if (readyTime > 0) {
            const readyTimer = setInterval(() => {
                setReadyTime(prev => {
                    const newTime = prev - 1;
                    if(stompClient.current && stompClient.current.connected) {
                        stompClient.current.publish({
                            destination: `/app/timer/${location.state.gameId}`,
                            body: JSON.stringify({
                                type:"READY",
                                time:newTime,
                                flag: isReady
                            })
                        });
                    }
                    return newTime;
                });
            }, 1000);

            return () => clearInterval(readyTimer);
        } else {
            //카운터 다운 끝나면 플레이어들에게 보냄
            setIsReady(prev => {
                if(stompClient.current && stompClient.current.connected) {
                    stompClient.current.publish({
                        destination: `/app/timer/${location.state.gameId}`,
                        body: JSON.stringify({
                            type:"START",
                            flag: false
                        })
                    });
                }
                return false;
            }); // 준비 끝 -> 문제 시작
        }
    }, [readyTime, isReady]);



    // quiz가 아직 로드되지 않으면 로딩 중 화면 표시
    if (!question || isReady) return <div className="loading">{isReady ? (<div>{readyTime} 초 후 시작</div>):<div>{message}</div> }</div>;

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
                        <h2>{question.title}</h2>
                        <div className="game-header">
                            <div className="timer-box">{remainingTime}초</div>
                        </div>
                        <div
                            className="question-content"
                            dangerouslySetInnerHTML={{__html: question.content}}
                        ></div>
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