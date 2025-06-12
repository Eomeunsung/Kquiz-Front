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
        if (err.response.status === 401 || err.response.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            localStorage.removeItem("email");
            window.location.href = "/signIn";
        }else if (err.response.status === 403) {
            alert("권한이 없습니다.")
        }

        throw err
    }
)

export default axiosInstance;