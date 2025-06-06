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