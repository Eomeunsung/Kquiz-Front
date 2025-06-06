import React, {useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import "./../../css/user/SignIn.css"
import {signIn} from "./../../api/user/UserApi"

const initState={
    email:"",
    password:"",
}
function SignIn(props) {
    let navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();

    // 이전 경로 정보 가져오기
    const from = location.state?.from?.pathname || '/';


    const handleLogin = () => {
        if (email && password) {
            initState.email = email;
            initState.password = password;

            signIn(initState)
                .then((res)=>{
                    localStorage.setItem("token",res.data.token)
                    localStorage.setItem("nickName",res.data.nickName)
                    navigate(from, { replace: true });
                })
                .catch((err)=>{
                    setError(err.message)
                })
            // 여기에 API 호출 등을 추가할 수 있습니다.
        } else {
            setError('이메일와 비밀번호를 입력해주세요.');
        }
    };


    return (
        <div className="login-container">
            <div className="login-form">
                <h2>로그인</h2>
                <div className="input-field">
                    <label htmlFor="username">아이디</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-field">
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <div className="button-container">
                    <button className="login-button" onClick={handleLogin}>
                        로그인
                    </button>
                    <button className="signup-button" onClick={() => {
                        navigate('/signup')
                    }}>
                        회원 가입
                    </button>

                </div>
            </div>
        </div>
    );
}

export default SignIn;