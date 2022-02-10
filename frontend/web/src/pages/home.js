import { Navigate } from "react-router-dom"
import {useState,useEffect} from "react"
import AuthPage from "./auth"
import WelcomePage from "./welcome"
import ForgotPasswordPage from "./forgotpassword"
import VerificationPage from "./verification"


function HomePage({authorized,handlelogin,handlesignup}) {
    const [currentview,setcurrentview]=useState("auth")
    if (authorized){
        return <Navigate to="/dashboard" />
    }
    const changeView = (view) =>{
        setcurrentview(view)
    }
    return (  
        <div className="container">
            { currentview==="welcome" &&
                <WelcomePage changeView={changeView} />
            }
            { currentview==="auth" &&
                <AuthPage 
                    changeView={changeView} 
                    handlelogin={handlelogin}
                    handlesignup={handlesignup}/>
            }
            { currentview==="fpwd" &&
                <ForgotPasswordPage changeView={changeView} />
            }
            { currentview==="verify" &&
                <VerificationPage changeView={changeView} />
            }
        </div>
    );
}

export default HomePage;