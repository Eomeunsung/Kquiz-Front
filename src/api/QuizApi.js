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