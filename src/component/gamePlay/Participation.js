import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import "./../../css/Participation.css"
import {participation} from "./../../api/ParticipationApi"
function Participation(props) {
    const navigate = useNavigate();
    const [gameId, setGameId] = useState('');
    const [error, setError] = useState('');
    const [userName, setUserName] = useState('');

    const handleParticipation = () =>{
        if(!userName){
            setError("이름을 입력하세요")
            return
        }
        participation(gameId)
            .then((res)=>{
                const data = {
                    gameId:gameId,
                    name : userName,
                }
                navigate("/lobby", {state: data});
            })
            .catch((err)=>{
                if(err.code === 'P000'){
                    setError("게임을 찾지 못했습니다.");
                }else{
                    setError("오류가 발생했습니다.");
                }
            })
    }


    return (
        <div className="participation-container">
            <div className="participation-card">
                <h2>게임 참여</h2>
                <input
                    type="text"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    placeholder="게임 방 코드를 입력하세요"
                    className="room-id-input"
                />
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="이름을 입력하세요"
                    className="room-id-input"
                />
                <button type="submit" className="join-button" onClick={()=>{handleParticipation()}}>참여하기</button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default Participation;