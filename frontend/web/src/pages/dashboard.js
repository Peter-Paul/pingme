import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom"
import { useSelector,useDispatch } from "react-redux"
import {getUser,patchUser} from "../services/users"
import {addListing, updateListing,setAccount} from "../state/actions/app-actions"
import { getuListing, postListing } from "../services/listings";
import WelcomePage from "./welcome";
import ListingItemsComponent from "../components/listings/listing-items";

function DashboardPage({authorized,handlelogout}) {
    const [view,setView]=useState("welcome")
    const dispatch = useDispatch()
    const credentials = useSelector((state) => state.credentials)
    const user = useSelector((state) => state.user)
    const lists = useSelector((state) => state.list)
    const plans = [
        {name:"Free",price:0,benefits:["3 Pings"]},
        {name:"Basic",price:5,benefits:["10 Pings","Temporary Save"]},
        {name:"Advanced",price:10,benefits:["50 Pings","Email Save", "Customize Ping Tone"]},
        {name:"Advanced Plus",price:30,benefits:["100 Pings","Email Save", "Customize Ping Tone"]}
    ]
    const changeView = (view) => setView(view)

    //runs only when component is mounted, and when credentials are updated
    useEffect( async ()=>{
         await setUser()
         await setListing()
    }, [credentials])  

    const setUser = async () => {
        console.log(credentials)
        let credentialsUpdated=Object.keys(credentials).length>0
        if (credentialsUpdated){
            return await getUser(credentials.id,credentials.at).then( (res)=>{
                const {password,...data} = res.data.data.data // remove password from user object
                console.log(data)
                if (!res.error) dispatch(setAccount(data))
            })
        }else{
            return
        }
    }

    const setListing = async () => {
        let credentialsUpdated=Object.keys(credentials).length>0
        if (credentialsUpdated){
            return await getuListing(credentials.id,credentials.at).then( (res)=>{
                let userListings=  res.data.data.data // provide list with notifications stringified. We must parse them
                const mutateData = (d) => {
                    let data = JSON.parse(d)
                    data = data.map(item=> {return { 
                                                id:item.pk, 
                                                title:item.fields.title,
                                                description:item.fields.description,
                                                listing:item.fields.listing,
                                                date_published:item.fields.date_published,
                                            }})
                    return data
                }
                userListings = userListings.map(item=>{return {...item,notifications:mutateData(item.notifications)}})
                if (!res.error) dispatch(updateListing(userListings))
            })
        }else{
            return
        }
    }
    
    const handlePatch = async (data) => {
        await patchUser(credentials.id,{instruction:"patchUser",payload:data},credentials.at).then((res) => {
            if (res.error){
                console.log(res.data)
            }else{ 
                dispatch(setAccount(data))
                setAccount(data)
            }
        })
    }

    const handleAddListing = async (data) => {
        await postListing({...data,owner:credentials.id,tone:"default"},credentials.at).then((res) => {
            if (res.error){
                console.log(res.data)
            }else{ 
                dispatch(addListing(data))
                setAccount(data)
            }
        })
    }

    if (!authorized){
        return <Navigate to="/" />
    }
    
    return (  
        <div className="container">
            <div className="d-flex flex-row justify-content-between">
                <button className="mb-4 btn btn-primary" onClick={()=>changeView("welcome")}>Dashboard</button>
                <button className="mb-4 btn btn-primary" onClick={handlelogout} >Logout</button>
            </div>
            {/* {view==="welcome" &&
                <WelcomePage
                    user={user}
                    lists={lists}
                    plans={plans}
                    handlePatch={handlePatch}
                    handleAddListing={handleAddListing}
                    changeView={changeView}
                />
            }
            {view==="listing" &&
                <ListingItemsComponent
                    lists={lists}
                    changeView={changeView}
                />
            }
  */}
        </div>

        
    );
}

export default DashboardPage;