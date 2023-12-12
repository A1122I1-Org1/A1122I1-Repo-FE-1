import  axios from "axios"
const URL="http://localhost:8080/api/Group";
const BASE_URL="/api/Group/";
const GROUP_LIST_API = "list-group";
const ACCEPT_GROUP_API="accept-group";
const DELETE_GROUP_API="delete-group";
const CREATE_DEADLINE_API="create-deadline";

export const save= async (groupAccount)=>{
    try{
        await axios.post(URL+"/createGroup",groupAccount)
    }catch (e){
        console.log(e)
    }
}
export const findAll = async (pageNumber,searchKey) => {

    try{
        const result=await  axios.get(`${BASE_URL}${GROUP_LIST_API}/?page=${pageNumber}&find=${searchKey}`)
        console.log(result.data);
        return result.data;
    } catch (e){
        console.log(e)
    }
};
export const acceptGroup=async (id)=>{
    try {
        const result=await axios.patch(`${BASE_URL}${ACCEPT_GROUP_API}/${id}`)
        console.log(result.data);
        return result.data
    } catch (e) {
        console.log(e)
    }
}
export const deleteGroup=async (id,listStudentId)=>{
    try {
        const result=await axios.patch(`${BASE_URL}${DELETE_GROUP_API}/${id}`, listStudentId)
        console.log(result.data);
        return result.data
    } catch (e) {
        console.log(e)
    }


}
export const createDeadLine=async (id,deadline)=>{
    try {
        const result=await axios.patch(`${BASE_URL}${CREATE_DEADLINE_API}/${id}/${deadline}`)
        console.log(result.data);
        return result.data
    } catch (e) {
        console.log(e)
    }

}