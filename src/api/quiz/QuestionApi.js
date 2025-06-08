import axios from "axios";
import axiosInstance from "./../axiosInstance"
export const questionCreate = async (id) => {
    try{
        const res = await axiosInstance.get(`${process.env.REACT_APP_URL}/question/create/${id}`,{
            headers: {
                "Content-Type": "application/json",
            }
        });
        console.log(res.data);
        return res.data;
    }catch (err){
        console.log(err);
        throw err;
    }

}

export const questionUpdate = async (data) => {
    try{
        const res = await axiosInstance.put(`${process.env.REACT_APP_URL}/question/update`,data,{
            headers: {
                "Content-Type": "application/json",
            }
        })
        console.log(res.data);
        return res.data;
    }catch (err){
        console.log(err);
        throw err;
    }
}

export const questionGet = async (id) => {
    try{
        const res = await axiosInstance.get(`${process.env.REACT_APP_URL}/question/get/${id}`,{
            headers: {
                "Content-Type": "application/json",
            }
        });
        console.log(res.data);
        return res.data;
    }catch (err){
        console.log(err);
        throw err;
    }
}
export const questionDelete=async (id)=>{
    try{
        const res = await axiosInstance.delete(`${process.env.REACT_APP_URL}/question/delete/${id}`,{
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(res.data);
        return res.data;
    }catch (err){
        console.log(err);
        throw err;
    }

}