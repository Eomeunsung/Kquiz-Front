import React, {useEffect, useState} from 'react';
import "./../../css/GameCreateModal.css"
import {gameCreate} from "../../api/game/GameApi"
import {useNavigate} from "react-router-dom";

function GameCreateModal({quizId, modalFlag}) {
    const navigate = useNavigate();
    console.log("퀴즈 아이디 "+quizId);


    //퀴즈 게임 생성
    const handleGameCreate= () =>{
        gameCreate(quizId)
            .then((result) => {
                const data = {
                    gameId: result.data.gameId,
                    quizTitle: result.data.quizTitle,
                    questionSize: result.data.questionSize,
                };
                localStorage.setItem("userId", result.data.userId);
                localStorage.setItem("name", "HOST");
                navigate("/hostLobby", {state: data});
            })
            .catch((err) => {})
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                <h3>게임을 생성하시겠습니까?</h3>
                <p>이 퀴즈를 기반으로 게임이 시작됩니다.</p>

                <div className="modal-buttons">
                    <button className="modal-start-button" onClick={()=>{handleGameCreate()}}>생성하기</button>
                    <button className="modal-close-button" onClick={modalFlag}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default GameCreateModal;