import axiosInstance from "../axiosInstance";

export const roleGet = async () =>{
    try{
        const res = await axiosInstance.get(`${process.env.REACT_APP_URL}/role`,{
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

export const userRoleGet = async () =>{
    try{
        const res = await axiosInstance.get(`${process.env.REACT_APP_URL}/role/user`,{
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


