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
    const [questionIds, setQuestionIds] = useState([]); //question 아이디 배열로 저장
    const [question, setQuestion] = useState(null); //question 정보
    const [quizTitle, setQuizTitle] = useState(null); //quizTitle
    const [questionIndex, setQuestionIndex] = useState(0);  // 현재 질문 번호
    const [remainingTime, setRemainingTime] = useState(0);  // 남은 시간
    const [isGameOver, setIsGameOver] = useState(false);  // 게임 종료 여부
    const stompClient = useRef(null);
    const [isReady, setIsReady] = useState(true);  // 준비 시간 상태
    const [readyTime, setReadyTime] = useState(3); // 10초 준비 시간
    const [rank, setRank] = useState(null);

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
                    if(quizData.type==="QUESTION"){
                        console.log("question가져오기 성공 "+message.body);
                        setQuestion(quizData.question);
                        setRemainingTime(quizData.question.option.time);
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

                //timer 계산기 timer는  /topic/quiz에서 받음
                stompClient.current.subscribe(`/topic/timer/${location.state.gameId}`, (message) => {
                    const timerData = JSON.parse(message.body);
                })
            },
        });

        stompClient.current.activate();
        return () => {
            stompClient.current.deactivate();
        };
    }, [location.state.gameId]);

    useEffect(() => {
        if (!question || isReady) return;
        console.log("remining타이머 "+remainingTime)
        // 처음에 타이머를 설정할 때, `question.option.time` 값이 존재하는지 확인
        if (remainingTime <= 0) {
            if (questionIds.length > 0) {
                const [nextId, ...rest] = questionIds;
                setQuestionIndex(nextId);
                setQuestionIds(rest);
                // `question.option.time`이 없으면 기본 10초를 설정, 있으면 해당 시간으로 설정
                // const nextQuestionTime = question?.option?.time || 10;
                // setRemainingTime(nextQuestionTime);  // 다음 문제 타이머 설정
            } else {
                setIsGameOver(true);  // 게임 종료
                if (stompClient.current && stompClient.current.connected) {
                    stompClient.current.publish({
                        destination: `/app/game/${location.state.gameId}`,
                        body: JSON.stringify({
                            type:"END"
                        }),
                    });
                }

            }
        } else {
            // 타이머가 0초 이하가 되면 다시 1초씩 감소하도록 설정
            const timer = setInterval(() => {
                setRemainingTime(prev => {
                    const newTime = prev - 1;
                    if(stompClient.current && stompClient.current.connected) {
                        stompClient.current.publish({
                            destination: `/app/timer/${location.state.gameId}`,
                            body: JSON.stringify({
                                type:"TIMER",
                                time:newTime,
                                flag: isReady
                            })
                        });
                    }
                    return newTime;
                });  // 1초씩 남은 시간 감소

            }, 1000);

            return () => clearInterval(timer);
        }
    }, [remainingTime, questionIndex, questionIds, question, isReady]);

    //새로운 question 받아오기
    useEffect(() => {
        if(questionIndex===0 || isReady)return
        console.log("퀘스천 인덱스 "+questionIndex)
        if (stompClient.current && stompClient.current.connected) {
            stompClient.current.publish({
                destination: `/app/quiz/${location.state.gameId}`, // ✅ 여기 수정!
                body: JSON.stringify({
                    questionId: questionIndex
                }),
            });
        }
    }, [questionIndex, isReady]);

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
                                type:"READER",
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


    //점수 정렬
    // useEffect(() => {
    //     if (rank && Array.isArray(rank)) {
    //         const sortedRank = [...rank].sort((a, b) => b.score - a.score);
    //         setRank(sortedRank);
    //     }
    // }, [rank]);

    // quiz가 아직 로드되지 않으면 로딩 중 화면 표시
    if (!question || isReady) return <div className="loading">{isReady ? (<div>{readyTime} 초 후 시작</div>):<div>{message}</div> }</div>;

    return (
        <div className="game-host-wrapper">
            {isGameOver ? (
                <div className="game-over">
                    <h2>게임 종료!</h2>
                    <p>모든 문제가 종료되었습니다. 결과를 확인해주세요!</p>
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
                    <div className="question-content" dangerouslySetInnerHTML={{__html: question.content}}></div>
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