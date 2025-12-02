import axios from "axios";
import axiosInstance from "./../axiosInstance"

export const quizCreate = async (data) => {
    try{
        // console.log("jwt 토큰 값 "+localStorage.getItem("token"))
        const res = await axiosInstance.post(`${process.env.REACT_APP_URL}/quiz/create`, data,{
            headers: {
                "Content-Type": "application/json",
                // Authorization: "Bearer "+localStorage.getItem("token"),
            }
        })
        console.log(res.data);
        return res.data;
    }catch (err){
        console.log(err)
        throw err;
    }
}
export const getQuizList = async (pageParam) =>{
    try{
        const {page, size, search} = pageParam
        console.log("리스트 페이지 "+page+" 사이즈 "+size)
        const res = await axios.get(`${process.env.REACT_APP_URL}/quiz/list`,{
            params: {page:page, size:size, search:search},
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(res.data);
        return res.data;
    }catch(err){
        console.log(err);
        throw err;
    }
}

export const quizGet = async (id) =>{
    try{
        const res = await axios.get(`${process.env.REACT_APP_URL}/quiz/get/${id}`,{
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log(res.data);
        return res.data;
    }catch(err){
        console.log(err);
        throw err;
    }
}

export const quizDelete = async (id) =>{
    try{
        const res = await axiosInstance.delete(`${process.env.REACT_APP_URL}/quiz/delete/${id}`,{
            headers: {
                "Content-Type": "application/json",
                // Authorization: "Bearer "+localStorage.getItem("token"),
            }
        })
        console.log(res.data);
        return res.data;
    }catch (err){
        throw err;
    }
}

export const quizUpdate = async (data) => {
    console.log("업데이트 데이터 "+JSON.stringify(data));
    try{
        const res = await axiosInstance.put(`${process.env.REACT_APP_URL}/quiz/update`,data,{
            headers: {
                "Content-Type": "application/json",
                // Authorization: "Bearer "+localStorage.getItem("token"),
            }
        })
        console.log("퀴즈 업데이트 성공 "+JSON.stringify(res.data));
        return res.data;
    }catch (err){
        console.log(err);
        throw err;
    }
}

export const titleUpdate = async (data) => {
    try{
        const res = await axiosInstance.put(`${process.env.REACT_APP_URL}/quiz/update/title`,data,{
            headers: {
                "Content-Type": "application/json",
            }
        })
        return res.data;
    }catch (err){
        console.log("타이틀 오류 "+err);
        throw err;
    }
}