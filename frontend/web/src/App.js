import './App.css';
import {useState,useEffect} from "react"
import { useSelector,useDispatch } from "react-redux"

import {login,logout,refreshToken} from "./services/users"
// import listReducer from "./state/reducers/listings-reducer"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import DashboardPage from './pages/dashboard';
import HomePage from './pages/home';
import VerificationPage from './pages/verification';
import { setcredentials } from './state/actions/app-actions';

function App() {
  const [authorized,setAuth]=useState(false)
  const credentials = useSelector((state) => state.credentials)
  const dispatch = useDispatch()

  useEffect( ()=>{handleCurrentState()},[]) //runs only when component is mounted, reason for empty array []
  // the empty array prevents and infinite loop

  const handleCurrentState = () =>{
    // checks if there's a token in cookies and refreshes 
    refreshToken().then((res)=>{ 
      if (res.error) {
        console.log(res.data)
        setAuth(false)
      }else{
        console.log(res.data)
        updateCredentials(res.data)
        const expireTime = res.data.exp
        const minuteBeforeExpiry=((expireTime*1000)-Date.now())-60000 // one minute = 60000 micro seconds
        silentRefresh(minuteBeforeExpiry)
      }
    })
  }

  const silentRefresh = refreshAfterTime => setTimeout(()=>handleCurrentState(),refreshAfterTime)

  const handlelogin = (data) => {
    console.log(data)
    login(data)
    .then((res)=>{
      if (res.error){
        console.log(res.data)
      }else{
        console.log(res.data)
        updateCredentials(res.data)        
      }
    })
    .catch(err=>console.log(err))
  }

  const updateCredentials = async (data) =>{
    console.log(data.user_id)
    await dispatch(setcredentials( {id:data.user_id,at:data.at,username:data.username} ))    
    setAuth(true)
  }

  const handlesignup = (data) => {
    console.log(data)
    //signup
  }
  const handlelogout = async () => {
    await logout(credentials.at)
    clearTimeout(()=>handleCurrentState()) //prevent silent refresh
    setAuth(false)
  }
  const handleupdateuser = () =>{
    // edit user
  }
  const handledeleteuser = () => {
  }
  const handleaddList = () => {
    //addlist
  }
  const handleupdatelist = () => {

  }
  const handledeletelist = () => {

  }
  
  
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage
                                        authorized={authorized} 
                                        handlelogin={handlelogin}
                                        handlesignup={handlesignup}/>
                                      } />
        <Route  path="/dashboard" element={<DashboardPage 
                                        authorized={authorized}
                                        handlelogout={handlelogout} />
                                      } />
        <Route  path="/dashboard/x" element={<VerificationPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
