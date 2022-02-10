import axios  from "axios"

const url = "http://localhost:8000/api/users/"
const refreshurl = "http://localhost:8000/api/token/refresh/"

// USER AUTHENTICATION
export const signup = async (payload) => {
    try{
        const res=await axios.post( `${url}register/`, payload)
        .then(res=>{
            if (res.next === "login"){
                console.log(res)
                // if with google, go to main page
            }else{
                // else go to verification
                console.log('Waiting for verification')
        }}) 
        console.log(res)
    }catch(error){
        console.log(error)
    }
}

export const login = async (payload) => {
    return await axios.post( `${url}login/`, payload, {withCredentials:true})
    .then(res=>{
        const access = res.data.token.access
        const payload = decodeAccessToken(access)
        return {error:false,data:payload}
    })
    .catch(err=>{return {error:true,data:err.response.data}})
}

const decodeAccessToken = (t) => {
    let data=JSON.parse(window.atob(t.split(".")[1]))
    data.at=t
    return data
}

export const refreshToken = async() => {
    return await axios.post( refreshurl, {},{withCredentials:true})
    .then(res=>{
        const access = res.data.access
        const payload = decodeAccessToken(access)
        return {error:false,data:payload}
    })
    .catch(err=>{return {error:true,data:err.response.data}})

}

export const logout = async (token) =>{
    return await axios.post( `${url}logout/`,{}, {withCredentials:true})
    .then(res=>{
        return {error:false,data:res}})
    .catch(err=>{return {error:true,data:err.response.data}}) 
}

export const getUser = async (id,token) => {
    return await axios.get( `${url}${id}/`,{headers: { Authorization: `Bearer ${token}` } })
    .then(res=>{return {error:false,data:res}})
    .catch(err=>{return {error:true,data:err.response.data}})   
}

export const patchUser = async (id,data,token) => {
    return await axios.patch( `${url}${id}/`,data,{headers: { Authorization: `Bearer ${token}` } })
    .then(res=>{return {error:false,data:res}})
    .catch(err=>{return {error:true,data:err.response.data}})   
}
