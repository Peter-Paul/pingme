import { Navigate,useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/authForm";

function AuthPage({handlelogin,handlesignup,isauthenticated}) {
    const navigate = useNavigate()
    const gotoVerify = () => { 
        <Navigate to="/verify"/> 
      }
    
    if (isauthenticated){
        return <Navigate to="/dashboard" />
    }
    return (  
        <div className="container">
            <button onClick={ () => navigate("/verify") }>Verify</button>
            <div style={{marginTop:"10%"}}>
                <h1 className="text-center text-warning">PingME</h1>
                <div className="d-flex justify-content-center">
                    <AuthForm handlelogin={handlelogin} handlesignup={handlesignup}/>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;