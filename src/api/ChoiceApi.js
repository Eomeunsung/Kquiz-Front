import axios from "axios";

export const choiceCreate = async (id) =>{
    try{
        const res = await axios.get(`${process.env.REACT_APP_URL}/choice/create/${id}`,{
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