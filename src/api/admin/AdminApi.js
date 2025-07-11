import axiosInstance from "../axiosInstance";

export const quizList = async () =>{
    try{
        const res = await axiosInstance.get(`${process.env.REACT_APP_URL}/admin/quiz/list`,{
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

export const quizDelete = async (id) =>{
    try{
        const res = await axiosInstance.delete(`${process.env.REACT_APP_URL}/admin/quiz/delete/${id}`,{
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

export const userList = async () =>{
    try{
        const res = await axiosInstance.get(`${process.env.REACT_APP_URL}/admin/user/list`,{
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

export const userGet = async (id) =>{
    try{
        const res = await axiosInstance.get(`${process.env.REACT_APP_URL}/admin/user/${id}`, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log(res.data);
        return res.data;
    }catch (err){
        console.log(err);
        throw err;
    }
}

export const userUpdate = async (data) =>{
    console.log("보낸 데이터 "+JSON.stringify(data))
    try{
        const res = await axiosInstance.put(`${process.env.REACT_APP_URL}/admin/user/update`, data,{
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log(res.data);
        return res.data;
    }catch (err){
        console.log("유저 업데이트 에러 "+err);
        throw err;
    }
}