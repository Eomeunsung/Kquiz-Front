import {createSearchParams, useNavigate, useSearchParams} from "react-router-dom";

const getNum = (param, defaultValue) => {
    if(!param){
        return defaultValue;
    }
    return parseInt(param)
}
const useCustomMove = () =>{
    const navigate = useNavigate();
    const [queryParams] = useSearchParams();

    const page = getNum(queryParams.get('page'), 1);
    const size = getNum(queryParams.get('size'), 10);
    const search = queryParams.get('search')??"";
    const queryDefault = createSearchParams({page, size}).toString();

    const moveToList = (pageParam) => {
        let queryStr = ""
        if(pageParam){
            const pageNum = getNum(pageParam.page, 1);
            const sizeNum = getNum(pageParam.size, 10);

            queryStr = createSearchParams({
                page:pageNum,
                size: sizeNum,
                ...(search && { search }) // 검색어가 있을 경우 유지
                }).toString();
        }else{
            queryStr = queryDefault
        }

        navigate({pathname:'../list', search:queryStr});
    }

    const moveToSearchList = (keyword) => {
        let queryStr = ""
            queryStr = createSearchParams({
            page:1,
            size: size,
            search:keyword,
            }).toString();

        console.log(queryDefault)
        navigate({pathname:'../list', search:queryStr})
    }

    return {moveToList, moveToSearchList, page, size}
}

export default useCustomMove;