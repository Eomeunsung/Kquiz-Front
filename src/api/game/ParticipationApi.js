// import axios from "axios";
//
// export const participation = async (roomId) =>{
//     try{
//         const res = await axios.get(`${process.env.REACT_APP_URL}/game/participation/${roomId}`,{
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         });
//         console.log(res.data);
//         return res.data;
//     }catch(err){
//         console.log(err.response.data);
//         throw err.response.data;
//     }
// }