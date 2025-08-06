import axios from "axios";

export const gameCreate = async (id) =>{
    try{
        const res = await axios.get(`${process.env.REACT_APP_URL}/game/create/${id}`,{
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


export const gameJoin = async (data) =>{
    console.log("Join API 데이터 "+data.gameId)
    try{
        const res = await axios.post(`${process.env.REACT_APP_URL}/game/join`, data ,{
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(res.data);
        return res.data;
    }catch(err){
        console.log(err.response.data);
        throw err.response.data;
    }
}