import axios from "axios";

export const fileUpload = async (formData) =>{
    console.log("이미지 보내기 전 "+formData.getAll("files"));
    try{
        const res = await axios.post(`${process.env.REACT_APP_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        console.log("이미ㅣㅈ 업로드"+res.data);
    }catch (err){
        throw err;
    }
}