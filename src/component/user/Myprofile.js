import React, {useEffect} from 'react';
import "./../../css/user/MyProfile.css"
import {myProfile} from "./../../api/user/UserApi"
import {useNavigate} from "react-router-dom";
function Myprofile(props) {
    const [profile, setProfile] = React.useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
        myProfile()
            .then((res)=>{
                setProfile(res.data);
            }).catch((err)=>{

        })
    },[])

    const handleUpdateQuiz = (data) =>{
        navigate("/quiz", {state: data});
    }

    if(!profile) return <div>Loading...</div>;
    return (
        <div className="profile-container">

            <h2 className="profile-name">NickName: {profile.nickName}</h2>
            <p className="profile-email">Email: {profile.email}</p>
            <p className="profile-bio">가입일: {profile.createAt}</p>

            <h3>내가 만든 퀴즈 목록</h3>
            {profile.quizList && profile.quizList.length > 0 ? (
                <div className="quiz-list">
                    {profile.quizList.map((quiz) => (
                        <div key={quiz.id} className="quiz-item" onClick={()=> handleUpdateQuiz(quiz.id)}>
                            <p>퀴즈 제목: {quiz.title}</p>
                            <p>수정일: {quiz.updateAt}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>퀴즈가 없습니다.</p>
            )}
        </div>
    );
}

export default Myprofile;