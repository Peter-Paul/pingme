import './App.css';
import {useState,useEffect} from "react"
import { useSelector,useDispatch } from "react-redux"

import {signup,signin,signout,refreshToken,getUser,patchUser,activation} from "./services/users"
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom"
import DashboardPage from './pages/dashboard';
import HomePage from './pages/home';
import VerificationPage from './pages/verification';
import { setAccount, setDetails } from './state/actions/app-actions';
import ActivationPage from './pages/activate';
import AuthPage from './pages/auth';

function App() {
  const [suLoading,setsu]=useState(false)
  const httpOptions = useSelector((state) => state.httpOptions)
  const isauthenticated = useSelector((state) => state.isauthenticated)
  const dispatch = useDispatch()

  useEffect( () => { handleCurrentState() },[] ) //runs only when component is mounted, reason for empty array []
  // the empty array prevents and infinite loop
  useEffect( () => { getAccount() },[isauthenticated] )
  
  const handleCurrentState = () =>{
    refreshToken().subscribe({
      next: async data => {
        await dispatch( setDetails(data) )
        const minuteBeforeExpiry=data.credentials.exp_interval-60000 // one minute = 60000 micro seconds
        silentRefresh(minuteBeforeExpiry)
      },
      error: err => console.log("You must Loggin")
    })
  }

  const silentRefresh = refreshAfterTime => setTimeout( () => handleCurrentState(), refreshAfterTime )

  const handlesignup = data => signup(data).subscribe({ next: () => setsu(true), error: err => console.log("Check entry") })
  
  const handlelogin = data => signin(data).subscribe( data => dispatch( setDetails(data) ) )

  const handlelogout = () => {
    signout(httpOptions).subscribe( () => {
      clearTimeout( () => handleCurrentState() ) //prevent silent refresh
      dispatch( setDetails({credentials:{},token:"",isauthenticated:false,httpOptions:{}}) ) // state to default
      dispatch( setAccount( {} ) ) //set user in state to default
    })
  }

  const handleActivation = (data) => activation(data).subscribe( data => console.log(data) )

  const getAccount = () => { if (isauthenticated) getUser(httpOptions).subscribe( data =>  dispatch( setAccount(data) )  ) }

  const handleuserupdate = data => patchUser(data,httpOptions).subscribe( data =>  console.log(data)  ) 

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
        <Route exact path="/" element={<AuthPage
                                        isauthenticated={isauthenticated}
                                        suLoading={suLoading}
                                        handlelogin={handlelogin}
                                        handlesignup={handlesignup}/>
                                      } />

        <Route  path="/verify" element={ <VerificationPage/> } />

        <Route  path="/activate/:uid/:token" element={<ActivationPage
                                        handleActivation={handleActivation}/>
                                      } />

        <Route  path="/dashboard" element={<DashboardPage 
                                        authorized={isauthenticated}
                                        handlelogout={handlelogout} />
                                      } />
      </Routes>
    </Router>
  );
}

export default App;
