import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "./../../css/GamePlayHost.css"
import loading from "../../img/loading.png"

function GamePlayHost(props) {
    // useLocation 훅을 통해, URL에서 전달된 게임 정보 가져오기
    const location = useLocation();
    const navigate = useNavigate();
    const stompClient = useRef(null);

    // 상태 변수들 초기화
    const [message, setMessage] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);  // 게임 종료 여부
    const [playerScore, setPlayerScore] = useState(0);
    const [isReady, setIsReady] = useState(true);  // 준비 시간 상태

    const [selectedChoiceId, setSelectedChoiceId] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false); // 중복 제출 방지
    const [score, setScore] = useState(0);

    const [rank, setRank] = useState(null);

    const [questionInfo, setQuestionInfo] = useState(null);
    const [timer, setTimer] = useState(0); //남은 시간
    const [status, setStatus] = useState("READY");

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
                userId: localStorage.getItem("userId"),
                roomId: location.state.gameId,
                name: localStorage.getItem("name"),
                type:"GAME_START"
            },

            onConnect: () => {
                console.log("연결 완료 - 전체 문제 수신 대기");
                // 전체 문제 목록 구독
                stompClient.current.subscribe(`/topic/game/${location.state.gameId}`, (message) => {
                    console.log("게임 끝 받은 점수 "+JSON.stringify(message.body));
                    const data = JSON.parse(message.body);
                    if(data.type==="SCORE") {
                        setPlayerScore(data.score)
                    }else if(data.type==="GAME_OVER"){
                        console.log("게임 종료")
                        setIsGameOver(prev=>!prev)
                        setStatus(data.type)
                        setRank(data.scores);
                    }
                    // setMessage(data.content);
                });

                stompClient.current.subscribe(`/topic/game/${location.state.gameId}`, (message) => {
                    console.log("구독 성공 "+JSON.stringify(message.body));
                    const data = JSON.parse(message.body);
                    setScore(data);
                    // setMessage(data.content);
                });

                stompClient.current.subscribe(`/topic/quiz/${location.state.gameId}`, (message) => {
                    const quizData = JSON.parse(message.body);
                    // console.log("퀘스천 웹 소켓 "+JSON.stringify(quizData));
                    if(quizData.type==="QUESTION") {
                        setSelectedChoiceId([])
                        setHasSubmitted(false)
                        setQuestionInfo(quizData.question)
                        setTimer(quizData.question.option.time);
                        if(status !== "QUESTION_LAST_TIMER"){
                            setStatus("QUESTION_TIMER")
                        }
                    }
                });

                //timer 계산
                stompClient.current.subscribe(`/topic/timer/${location.state.gameId}`, (message) => {
                    const data = JSON.parse(message.body);
                    // console.log("Timer 연결 콘솔 "+JSON.stringify(data));
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
        console.log("선택된 초이스 "+selectedChoiceId)
    }

    //초이스 보내기
    const handeChoiceSubmit = () => {
        setHasSubmitted(true)
        let isCorrect = false
        const choiceIsCorrect = questionInfo.choices.filter(choice => choice.isCorrect).map(choice => choice.id)

        if(choiceIsCorrect.length === selectedChoiceId.length){
           isCorrect = choiceIsCorrect.every(id => selectedChoiceId.includes(id))
        }
        if(isCorrect){
            console.log("정답")
            if (stompClient.current && stompClient.current.connected) {
                stompClient.current.publish({
                    destination: `/app/game/${location.state.gameId}`,
                    body: JSON.stringify({
                        score: questionInfo.option.score,
                        userId: localStorage.getItem("userId"),
                        type:"SCORE"
                    }),
                });
            }
        }
    }

    // quiz가 아직 로드되지 않으면 로딩 중 화면 표시
    if (isReady) return <div className="loading">{isReady ? (<div>{timer}</div>):<div>{message}</div> }</div>;
    if (!questionInfo) return <div><img src={loading} alt='loading' height='100px' width='200px' /> </div>
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
                        <h2>{questionInfo.title}</h2>
                        <div className="game-header">
                            <div className="timer-box">{timer}초</div>
                            <div className="score-box">점수 {playerScore}</div>
                        </div>
                        <div
                            className="question-content"
                            dangerouslySetInnerHTML={{__html: questionInfo.content}}
                        ></div>
                        <div className="choices-container">
                            {questionInfo.choices.map((choice, idx) => (
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
                                : (<button className="choice-submit" onClick={handeChoiceSubmit}>제출하기
                                </button>)
                        }

                    </div>
                )}
            </div>

            {questionInfo.option.useAiFeedBack && (
                <div className="hint-sidebar">
                <h3>힌트</h3>
                    <p>{questionInfo.option.aiQuestion}</p>
                </div>
            )}
        </div>
    );
}

export default GamePlayHost;