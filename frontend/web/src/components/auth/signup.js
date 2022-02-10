import {useState,useEffect} from "react"

function SignUp ({handlelogin,handlesignup}) {
    const [person1, setUser1] = useState({email:"",username:"",password:"",password2:""});
    const [person2, setUser2] = useState({email:"",password:""});
    const [currentview,setView] = useState("login")
    const onSignup = (evt) => {
        evt.preventDefault();
        handlesignup(person1)
    }
    const onLogin = (evt) => {
        evt.preventDefault();
        handlelogin(person2)
    }
    const handleSignupChange = (e) => setUser1({...person1, [e.target.name]: e.target.value})
    const handleLoginChange = (e) => setUser2({...person2, [e.target.name]: e.target.value})

    return ( 
        <div>
            {currentview === "signup" &&   
                <div>
                    <form onSubmit={onSignup}>
                        <input type="email" placeholder="Enter Email" name="email" value={person1.email}
                        className="mb-3 form-control" onChange={e => handleSignupChange(e)}/>
                        <input type="text" placeholder="Enter Username" name="username" value={person1.username}
                        className="mb-3 form-control" onChange={e => handleSignupChange(e)}/>
                        <input type="password" placeholder="Enter Password" name="password" value={person1.password}
                        className="mb-3 form-control" onChange={e => handleSignupChange(e)}/>
                        <input type="password" placeholder="Repeat Password" name="password2" value={person1.password2}
                        className="mb-3 form-control" onChange={e => handleSignupChange(e)}/>
                        <button type="submit" value="Submit" className="mb-3 btn btn-primary" >Submit</button>
                    </form>
                    <a className="btn btn-link" onClick={() => setView("login")}>Have an account? Login</a>
                </div>
            }
            {currentview === "login" &&
                <div>
                    <form onSubmit={onLogin}>
                        <input type="email" placeholder="Enter Email" name="email" value={person2.email}
                        className="mb-3 form-control" onChange={e => handleLoginChange(e)}/>
                        <input type="password" placeholder="Enter Password" name="password" value={person2.password}
                        className="mb-3 form-control" onChange={e => handleLoginChange(e)}/>
                        <button type="submit" value="Submit" className="mb-3 btn btn-primary" >Submit</button>
                    </form>
                    <a className="btn btn-link" onClick={() => setView("signup")}>Don't an account? Signup</a>
                </div>
            }
        </div>
     );
}

export default SignUp;