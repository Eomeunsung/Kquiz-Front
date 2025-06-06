import React, {useState} from 'react';
import "./../../css/user/SignUp.css"
import {signUp} from "./../../api/user/UserApi"
import {useNavigate} from "react-router-dom";

// 초기값 설정
const initSignUp = {
    email: '',
    nickName: '',
    password: '',
};
function SignUp(props) {
    const navigate = useNavigate();
    const [signUpData, setSignUpData] = useState(initSignUp);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    // 입력 값 변경 처리
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setSignUpData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    // 회원가입 처리
    const handleSignUp = () => {
        const { email, nickName, password } = signUpData;

        // 모든 필드가 채워졌는지 확인
        if (nickName && email && password && confirmPassword) {
            if (password !== confirmPassword) {
                setError('비밀번호가 일치하지 않습니다.');
                return;
            }

            // 회원가입 데이터 콘솔 로그
            console.log("회원가입 데이터:", signUpData);
            signUp(signUpData)
                .then((res)=>{
                    alert("회원 가입 완료 했습니다.")
                    navigate("/signIn");
                })
                .catch((err)=>{
                    console.log("회원 가입 에러")
                    setError(err.message);
                })


        } else {
            setError('모든 필드를 입력해주세요.');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h2>회원가입</h2>
                <div className="input-field">
                    <label htmlFor="email">이메일</label>
                    <input
                        type="email"
                        id="email"
                        value={signUpData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-field">
                    <label htmlFor="nickname">닉네임</label>
                    <input
                        type="text"
                        id="nickName"
                        value={signUpData.nickName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-field">
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        value={signUpData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-field">
                    <label htmlFor="confirm-password">비밀번호 확인</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button className="signup-button" onClick={handleSignUp}>
                    회원가입
                </button>
            </div>
        </div>
    );
}

export default SignUp;