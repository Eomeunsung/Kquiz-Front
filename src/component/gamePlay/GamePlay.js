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

    const [isReady, setIsReady] = useState(true);  // 준비 시간 상태
    const [readyTime, setReadyTime] = useState(10); // 10초 준비 시간

    const [selectedChoiceId, setSelectedChoiceId] = useState(null); //선택지 id
    const [hasSubmitted, setHasSubmitted] = useState(false); // 중복 제출 방지

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
                // 전체 문제 목록 구독
                stompClient.current.subscribe(`/topic/game/${location.state.gameId}`, (message) => {
                    console.log("구독 성공 "+JSON.stringify(message.body));
                    const data = JSON.parse(message.body);
                    if(data.type==="SCORE"){
                        setRank(data.scores);
                    }
                    // setMessage(data.content);
                });
                stompClient.current.subscribe(`/topic/quiz/${location.state.gameId}`, (message) => {
                    // console.log("quiz가져오기 성공 "+message.body);
                    const quizData = JSON.parse(message.body);
                    if(quizData.type==="QUESTION"){
                        console.log("question가져오기 성공 "+message.body);
                        setQuestion(quizData.question);
                        setHasSubmitted(false);
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
                    if(timerData.type==="READER"){
                        setReadyTime(timerData.time);
                        setIsReady(timerData.flag);
                    }else if(timerData.type==="START"){
                        setIsReady(timerData.flag);
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
    }, [location.state.gameId]);




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
    }, [questionIndex]);


    //초이스 보내기
    const handleChoiceId = (id) =>{
        setHasSubmitted(true);
        console.log("초이스 "+question.choices)

        const selectedChoice = question.choices.find((choice) => choice.id === id);
        if(selectedChoice){
            const isCorrect = selectedChoice.isCorrect;
            console.log("선택한 선택지 ID:", id);
            console.log("정답 여부:", isCorrect);
            console.log("배점 "+question.option.score)
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
    }

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
                            <div className="choice-card" key={choice.id}
                                 onClick={() => !hasSubmitted && handleChoiceId(choice.id)} // 이미 제출했다면 클릭 불가
                            >
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