import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    headers:{'Content-Type':'application/json'},
});

const refreshToken = (token) =>{

    try{
        const res = axios.post(`${process.env.REACT_APP_URL}/refreshToken`,{token},{
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer "+localStorage.getItem("token"),
            }
        })
        console.log("리프레쉬 토큰 "+res)
    }catch (err){
        console.log(err);
    }
}
axiosInstance.interceptors.request.use(
    async (config) => {
            console.log("config 설정 "+JSON.stringify(config));
            const token = localStorage.getItem("token");
            if(token){
                refreshToken(token)
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
    },(error)=>{
        return Promise.reject(error); //에러 반환
    }
)

axiosInstance.interceptors.response.use(
    (response)=>{
        console.log("응답 "+JSON.stringify(response));
        return response;
    },
    (err)=>{
        console.log("응답 오류 "+JSON.stringify(err));
        if (err.response && err.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            localStorage.removeItem("email");
            alert("세션이 만료되어 다시 로그인 해주세요.");
            window.location.href = "/login";
        }

        if(err.response && err.response.status === 401){
            alert("로그인 후 이용 가능합니다.")
            window.location.href = "/login";
        }
        throw err
    }
)

export default axiosInstance;