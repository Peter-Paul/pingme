import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { Navigate } from "react-router-dom"


function ActivationPage({handleActivation}) {
    const {uid,token} = useParams()
    const payload={uid,token}
    useEffect( ()=>{ activateAccount() },[])

    const activateAccount = () => { handleActivation(payload); return <Navigate to="/" /> }
    return (  
        <div className='container'>
            <h1 className='display-1'>Activating Account</h1>
        </div>
    );
}


export default ActivationPage;