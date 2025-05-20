import axios from "axios";


export const quizCreate = async (data) => {
    try{
        const res = await axios.post(`${process.env.REACT_APP_URL}/quiz/create`, data,{
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log(res.data);
        return res.data;
    }catch (err){
        console.log(err)
        throw err;
    }
}
export const getQuizList = async () =>{
    try{
        const res = await axios.get(`${process.env.REACT_APP_URL}/quiz/list`,{
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
        const res = await axios.delete(`${process.env.REACT_APP_URL}/quiz/delete/${id}`,{
            headers: {
                "Content-Type": "application/json"
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
        const res = await axios.put(`${process.env.REACT_APP_URL}/quiz/update`,data,{
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log("퀴즈 업데이트 성공 "+res.data);
        return res.data;
    }catch (err){
        console.log(err);
        throw err;
    }

}