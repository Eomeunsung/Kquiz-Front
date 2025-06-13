import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    headers:{'Content-Type':'application/json'},
});

const refreshToken = async (token) =>{

    try{
        const res = await axios.post(`${process.env.REACT_APP_URL}/refreshToken`,{token},{
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer "+localStorage.getItem("token"),
            }
        })
        if(res.data.code==="T200"){
            localStorage.setItem("token",res.data.data)
        }
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
        return response;
    },
    (err)=>{
        if (err.response.status === 401 ) {
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            localStorage.removeItem("email");
            window.location.href = "/signIn";
        }else if (err.response.status === 403) {
            alert("권한이 없습니다.")
        }

    }
)

export default axiosInstance;