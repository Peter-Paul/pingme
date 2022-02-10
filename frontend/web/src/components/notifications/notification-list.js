import { useEffect, useState } from "react";

function NotificationListComponent({list,showNotifs}) {
    const [notifsPresent,setNotifs]=useState((list.notifications.length > 0)) 
    // useEffect( ()=> {setNotifs((list.notifications.length > 0))},[] )
    return (  
        <div className="container">
            <button className="btn btn-primary" onClick={()=>{showNotifs(false)}}>Back</button>
            <div>
                {!notifsPresent &&
                    <h3 className="text-center">
                        There are currently no notifications in this stream
                    </h3>
                }
                {notifsPresent &&
                    <div >
                        <h2 className="text-center">Notifications for the "{list.title}" stream</h2>
                        { list.notifications.map( (item)=>
                            <div key={item.id} className="d-flex flex-row justify-content-center">
                                <div className="card col-10 my-3">
                                    <div className="card-body">
                                        <h3 className="card-title">{item.title}</h3>
                                        <p>{item.description}</p>
                                        
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                }
            </div>
        </div>
    );
}

export default NotificationListComponent;