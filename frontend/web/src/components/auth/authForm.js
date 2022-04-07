import {useState} from "react"

export default function AuthForm ({handlelogin,handlesignup}) {
    const [person1, setUser1] = useState({email:"",username:"",password:"",re_password:""});
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
        <div className="card col-10 col-md-5">
            {currentview === "signup" &&   
                <div className="card-body">
                    <form onSubmit={onSignup}>
                        <input type="email" placeholder="Enter Email" name="email" value={person1.email}
                        className="mb-3 form-control" onChange={e => handleSignupChange(e)}/>
                        <input type="text" placeholder="Enter Username" name="username" value={person1.username}
                        className="mb-3 form-control" onChange={e => handleSignupChange(e)}/>
                        <input type="password" placeholder="Enter Password" name="password" value={person1.password}
                        className="mb-3 form-control" onChange={e => handleSignupChange(e)}/>
                        <input type="password" placeholder="Repeat Password" name="re_password" value={person1.re_password}
                        className="mb-3 form-control" onChange={e => handleSignupChange(e)}/>
                        <button type="submit" value="Submit" className="mb-3 btn btn-warning">SignUp</button>
                    </form>
                    <a className="btn btn-link" onClick={() => setView("login")}>Have an account? SignIn</a>
                </div>
            }
            {currentview === "login" &&
                <div className="card-body">
                    <form onSubmit={onLogin}>
                        <input type="email" placeholder="Enter Email" name="email" value={person2.email}
                        className="mb-3 form-control" onChange={e => handleLoginChange(e)}/>
                        <input type="password" placeholder="Enter Password" name="password" value={person2.password}
                        className="mb-3 form-control" onChange={e => handleLoginChange(e)}/>
                        <button type="submit" value="Submit" className="mb-3 btn btn-warning">SignIn</button>
                    </form>
                    <a className="btn btn-link" onClick={() => setView("signup")}>Don't an account? Signup</a>
                </div>
            }
        </div>
     );
}
