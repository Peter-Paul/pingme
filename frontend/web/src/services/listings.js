import axios  from "axios"

const uurl = "http://localhost:8001/api/notifs/ulisting/"
const lurl = "http://localhost:8001/api/notifs/listing/"
const lsurl = "http://localhost:8001/api/notifs/listings/"
const nurl = "http://localhost:8001/api/notifs/notification/"

// Listings
export const getuListing = async (id,token) => {
    return await axios.get( `${uurl}${id}/`,{headers: { Authorization: `Bearer ${token}` } })
    .then(res=>{return {error:false,data:res}})
    .catch(err=>{return {error:true,data:err.response.data}})   
}

export const getListing = async (id,token) => {
    return await axios.get( `${lsurl}${id}/`,{headers: { Authorization: `Bearer ${token}` } })
    .then(res=>{return {error:false,data:res}})
    .catch(err=>{return {error:true,data:err.response.data}})   
}

export const postListing = async (data,token) => {
    return await axios.post( `${lsurl}`,data,{headers: { Authorization: `Bearer ${token}` } })
    .then(res=>{return {error:false,data:res}})
    .catch(err=>{return {error:true,data:err.response.data}})   
}


export const patchListing = async (id,data,token) => {
    return await axios.patch( `${lurl}${id}/`,data,{headers: { Authorization: `Bearer ${token}` } })
    .then(res=>{return {error:false,data:res}})
    .catch(err=>{return {error:true,data:err.response.data}})   
}

export const deleteListing = async (id,token) => {
    return await axios.delete( `${lurl}${id}/`,{headers: { Authorization: `Bearer ${token}` } })
    .then(res=>{return {error:false,data:res}})
    .catch(err=>{return {error:true,data:err.response.data}})   
}

//Notifications
export const getNotif = async (id,token) => {
    return await axios.get( `${nurl}${id}/`,{headers: { Authorization: `Bearer ${token}` } })
    .then(res=>{return {error:false,data:res}})
    .catch(err=>{return {error:true,data:err.response.data}})   
}

export const patchNotif = async (id,data,token) => {
    return await axios.patch( `${nurl}${id}/`,data,{headers: { Authorization: `Bearer ${token}` } })
    .then(res=>{return {error:false,data:res}})
    .catch(err=>{return {error:true,data:err.response.data}})   
}

export const deleteNotif = async (id,token) => {
    return await axios.delete( `${nurl}${id}/`,{headers: { Authorization: `Bearer ${token}` } })
    .then(res=>{return {error:false,data:res}})
    .catch(err=>{return {error:true,data:err.response.data}})   
}
