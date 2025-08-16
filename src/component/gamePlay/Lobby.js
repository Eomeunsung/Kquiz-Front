import React, {useEffect, useRef, useState} from 'react';
import "./../../css/Lobby.css"
import {gameCreate} from "../../api/game/GameApi"
import {useLocation, useNavigate} from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

function Lobby(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state;
    const [players, setPlayers] = useState([]);
    const [quizTitle, setQuizTitle] = useState("");
    const [gameId, setGameId] = useState(null);
    const stompClient = useRef(null);
    const [messages, setMessages] = useState("");
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState(null);
    const [role, setRole] = useState("PLAYER");

    console.log("참여자 로비 "+JSON.stringify(data))

    useEffect(() => {
        setUserName(data.name);
        localStorage.setItem("name", data.name);
        setGameId(data.gameId);
        setUserId(localStorage.getItem("userId"));
        setUserName(localStorage.getItem("name"));
        setQuizTitle(data.quizTitle);

    },[])
    useEffect(() => {
        if(!gameId || !userName){return;}

        const socket = new SockJS("http://localhost:8080/ws");
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                userId: userId,
                roomId: gameId,
                name: userName,
                type: "LOBBY",
            },
            onConnect: () => {
                console.log("연결 됨");
                // ✅ 채팅 구독
                stompClient.current.subscribe(`/topic/lobby/${gameId}`, (message) => {
                    if (message.body) {
                        console.log("")
                        const body = JSON.parse(message.body);
                        if(body.type === "KICK"){
                            const rawList = body.userList;
                            setPlayers(Object.values(rawList));  // 플레이어 배열 업데이트
                            setMessages(body.content);  // 강퇴 메시지 표시
                        }else if(body.typeEnum==="GAME") {
                            // if(role==="HOST"){
                            //     navigate("/gamePlay/Host", { state: data });
                            // }else if(role==="PLAYER"){
                            navigate("/gamePlay", { state: data });
                            // }
                        }else{
                            console.log("📦 Parsed body:", body.userList);
                            const rawList = body.userList;
                            setPlayers(Object.values(rawList));
                            setMessages(body.content);
                        }
                    }
                });
                stompClient.current.subscribe(`/topic/kick/${gameId}/${userId}`, (message) => {
                    console.log("연결된 킥 "+`/topic/kick/${gameId}/${userId}`)
                    alert("호스트에 의해 강퇴당했습니다.");
                    console.log("강퇴 당함")
                    stompClient.current.deactivate();
                    navigate("/");
                })

            },
            onDisconnect: () => {
                console.log("연결 해제됨");
            },
            debug: (str) => {
                console.log("[DEBUG]: ",str);
            },
        });
        stompClient.current.activate();

        return () => {
            stompClient.current.deactivate();
        };
    },[gameId, userId])


    return (
        <div className="lobby-page">
            <h2>{quizTitle}</h2>
            <h2>퀴즈 대기실</h2>
            <p className="room-code">방 코드: {gameId}</p>
            <h2>참가자 목록</h2>
            <ul className="player-list">
                {players.slice(0).map((p, idx) => (
                    <li key={idx}>{p}</li>
                ))}
            </ul>
            <h4>참여자 메시지</h4>
            <div className="messages">
                {messages}
            </div>
        </div>
    );
}

export default Lobby;