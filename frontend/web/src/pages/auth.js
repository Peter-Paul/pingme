import SignUp from "../components/auth/signup";

function AuthPage({handlelogin,handlesignup}) {

    return (  
       <div>
           <SignUp
            handlelogin={handlelogin}
            handlesignup={handlesignup}/>
       </div>
    );
}

export default AuthPage;