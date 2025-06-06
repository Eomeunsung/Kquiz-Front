import axios from "axios";

export const signUp = async (data) => {
    try{
        const res = await axios.post(`${process.env.REACT_APP_URL}/user/signUp`, data,{
            headers: {'Content-Type': 'application/json'}
        });
        console.log(res.data);
        return res.data
    }catch (err){
        console.log(err.response.data.message);
        throw err.response.data;
    }
}

export const signIn = async (data) => {
    try{
        const res = await axios.post(`${process.env.REACT_APP_URL}/user/signIn`, data,{
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log(res.data);
        return res.data
    }catch (err) {
        console.log(err);
        throw err.response.data
    }
}