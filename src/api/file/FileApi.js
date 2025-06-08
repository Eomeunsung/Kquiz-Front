import axios from "axios";

export const fileUpload = async (formData, quizId) =>{
    console.log("이미지 보내기 전 "+formData.getAll("files"));
    try{
        const res = await axios.post(`${process.env.REACT_APP_URL}/upload/${quizId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: "Bearer "+localStorage.getItem("token"),
            }
        })
        console.log("이미ㅣㅈ 업로드"+JSON.stringify(res.data));
    }catch (err){
        console.log(err);
        throw err;
    }
}

export const changeImgApi = async (data) => {
    try{
        const res = await axios.post(`${process.env.REACT_APP_URL}/img/change`,data,{
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer "+localStorage.getItem("token"),
            }
        })
        console.log("이미지 바꾸기 "+res.data);
        return res.data;
    }catch (err){
        console.log(err);
        throw err;
    }
}