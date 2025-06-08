import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    headers:{'Content-Type':'application/json'},
});

axiosInstance.interceptors.request.use(
    async (config) => {
            console.log("config 설정 "+JSON.stringify(config));
            const token = localStorage.getItem("token");
            if(token){
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
        console.log("응답 오류 "+err)
    }
)

export default axiosInstance;