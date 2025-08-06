import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

function HostLobby(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;
    const [players, setPlayers] = useState([]);
    const [quizInfo, setQuizInfo] = useState({ title: "퀴즈 제목 예시" }); // 필요 시 API 연동
    const stompClient = useRef(null);
    const [userId, setUserId] = useState(null);
    const [messages, setMessages] = useState("");
    const [role,setRole] = useState("HOST");
    console.log("호스트 로비 "+JSON.stringify(data))

    useEffect(() => {
        if (!data.gameId) return;
        console.log("게임 아이디 "+data.gameId)
        setQuizInfo(data.quizInfo);
        setUserId(data.userId);

        const socket = new SockJS("http://localhost:8080/ws");
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                userId: userId,
                roomId: data.gameId,
                name: "HOST", // 호스트 이름 고정 또는 입력받기
                type: "LOBBY",
            },
            onConnect: () => {
                console.log("웹소켓 연결됨 (호스트)");

                // 참가자 연결 감지
                stompClient.current.subscribe(`/topic/chat/${data.gameId}`, (message) => {
                    if (message.body) {
                        const body = JSON.parse(message.body);
                        // console.log("📦 Parsed body:", body);
                        // console.log("호스트 이름 아이디 "+body.name+" "+body.userId);
                        // console.log("CHAT 타입 "+body.type);
                        if(body.type === "KICK"){
                            const rawList = body.userList;
                            // 플레이어 배열을 id와 name을 포함한 객체로 업데이트
                            const updatedPlayers = Object.keys(rawList).map(key => ({
                                id: key,
                                name: rawList[key],
                            }));
                            setPlayers(updatedPlayers);  // 플레이어 배열 업데이트
                            setMessages(body.content);  // 강퇴 메시지 표시
                        }else if(body.type==="GAME"){
                            if(role==="HOST"){
                                navigate("/gamePlay/Host", { state: data });
                            }else if(role==="PLAYER"){
                                navigate("/gamePlay", { state: data });
                            }

                        }else{
                            const rawList = body.userList;

                            // 플레이어 배열을 id와 name을 포함한 객체로 업데이트
                            const updatedPlayers = Object.keys(rawList).map(key => ({
                                id: key,
                                name: rawList[key],
                            }));
                            setPlayers(updatedPlayers);  // 플레이어 배열 업데이트
                            console.log("유저들 "+JSON.stringify(players));
                        }
                    } else {
                        console.log("❌ message.body 없음");
                    }
                });
                // // 구독 직후 초기 데이터 요청 보내기
                // stompClient.current.send("/app/init", {}, JSON.stringify({ gameId: data.gameId }));
            },
            onDisconnect: () => {
                console.log("연결 종료됨 (호스트)");
            },
            debug: (str) => console.log("[DEBUG]", str),
        });

        stompClient.current.activate();
        return () => {
            stompClient.current.deactivate();
        };
    }, [data.gameId]);


    const handleGameStart = ()=>{
        if(stompClient.current && stompClient.current.connected) {
            stompClient.current.publish({
                destination: `/app/chat/${data.gameId}`,
                body: JSON.stringify({
                    content: "GAME"
                }),
            });
        }
    }

    const handleKick = (playerId) => {
        console.log("강퇴할 id "+playerId);
        if (stompClient.current && stompClient.current.connected) {
            stompClient.current.publish({
                destination: `/app/kick/${data.gameId}`,
                body: JSON.stringify({
                    gameId: data.gameId,
                    userId: playerId,
                }),
            });
        }
    }


    return (
        <div className="lobby-page">
            <h2>{quizInfo.title}</h2>
            <h2>호스트 대기실</h2>
            <p className="room-code">방 코드: {data.gameId}</p>

            <h4>참가자 목록</h4>
            <ul className="player-list">
                {players.slice(1).map((p, idx) => (
                    <li key={p.id} className="player-item">
                        <span>{idx + 1}. {p.name}</span>
                        <button className="kick-button" onClick={() => handleKick(p.id)}>강퇴</button>
                    </li>
                ))}
            </ul>
            <h4>참여자 메시지</h4>
            <div className="messages">
                {messages}
            </div>

            <button className="start-button" onClick={handleGameStart}>
                게임 시작
            </button>
        </div>
    );
}

export default HostLobby;