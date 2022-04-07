import axios  from "axios"
import Axios from  'axios-observable';
import { catchError, map, throwError } from "rxjs";

const url = "http://localhost:8000/auth/"

// utils
const decodeAccessToken = (t) => {
    let data=JSON.parse(window.atob(t.split(".")[1]))
    data.exp_interval = (data.exp*1000)-Date.now() // instead of actual time, get the interval
    return data
}

const stateData = (token) =>{
    const httpOptions = {withCredentials:true,headers:{ Authorization: `JWT ${token}` }}
    const credentials = decodeAccessToken(token)
    const data = {credentials,token,isauthenticated:true,httpOptions}
    return data
}

// AUTH SERVICES

// sign up user
export const signup = payload => {
    return Axios.post( `${url}users/`, payload, {withCredentials:true}).pipe(
        catchError(err=>{return err}),
        map(res=>{
            console.log(res)
            return res.data
        })
    )
}

// activate user
export const activation = (payload) => {
    return Axios.post( `${url}users/activation/`, payload, {withCredentials:true}).pipe(
        catchError(err=>{
            console.log(err)
            return err
        }),
        map(res=>{
            return res.data
        })
    )
}

// login user
export const signin = (payload) => {
    return Axios.post( `${url}jwt/create/`, payload, {withCredentials:true}).pipe(
        catchError(err=>{
            console.log(err)
            return err
        }),
        map(res=>{
            return stateData(res.data)
        })
    )
}

// logout user
export const signout = (httpOptions) =>{
    return Axios.get( `${url}jwt/remove/`, httpOptions).pipe(
        catchError(err=>{
            console.log(err)
            return err
        }),
        map(res=>{
            console.log(res)
            return res
        })
    )
}


// refresh access token
export const refreshToken = () => {
    return Axios.post( `${url}jwt/refresh/`, {},{withCredentials:true}).pipe(
        catchError(err=>{return err}),
        map(res=>{return stateData(res.data)})
    )
}

// USER SERVICE
export const getUser =  (httpOptions) => {
    return Axios.get(`${url}users/me/`,httpOptions).pipe(
        catchError(err=>{
            console.log(err)
            return err
        }),
        map(res=>{
            return res.data
        })
    )
}

export const patchUser = (data,httpOptions) => {
    return Axios.patch(`${url}users/me/`,data,httpOptions).pipe(
        catchError(err=>{
            console.log(err)
            return err
        }),
        map(res=>{
            return res.data
        })
    )
}
