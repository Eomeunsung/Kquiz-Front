import React, {useEffect, useRef, useState} from 'react';
import "./../../css/Lobby.css"
import {gameCreate} from "../../api/GameApi"
import {useLocation} from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

function Lobby(props) {
    const location = useLocation();
    const data = location.state;
    const [players, setPlayers] = useState([]);
    const [quizInfo, setQuizInfo] = useState({});
    const [gameId, setGameId] = useState(null);
    const [isHost, setIsHost] = useState(true);
    const stompClient = useRef(null);
    const [messages, setMessages] = useState("");
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        setGameId(data.gameId);
        setUserName(data.name);

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
            },
            onConnect: () => {
                console.log("연결 됨");
                stompClient.current.subscribe(`/topic/chat/${gameId}`, (message)=>{
                    if(message.body){
                        const body = JSON.parse(message.body);
                        console.log("📦 Parsed body:", body);
                        setUserId(body.userId);
                        const rawList = body.userList;
                        setPlayers(Object.values(rawList));
                        setMessages(body.content);
                    }

                });
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
    },[gameId])
    return (
        <div className="lobby-page">
            <h2>퀴즈 {quizInfo.title}</h2>
            <h2>퀴즈 대기실</h2>
            <p className="room-code">방 코드: {gameId}</p>
            <h2>참가자 목록</h2>
            <ul className="player-list">
                {players.slice(1).map((p, idx) => (
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