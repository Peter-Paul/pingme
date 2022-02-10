import { useState } from "react";
import NotificationListComponent from "../notifications/notification-list";

function ListingItemsComponent({lists,changeView}) {
    const [notifsView,showNotifs]=useState(false)
    const [list,setList]=useState({})
    return ( 
        <div className="container">
            {!notifsView ?
                <>
                    <button className="btn btn-primary" onClick={()=>{changeView("welcome")}}>Back</button>
                    {lists.map( (item)=>
                        <div key={item.id} className="d-flex flex-row justify-content-center">
                            <div className="card col-10 my-3">
                                <div className="card-body">
                                    <h3 className="card-title">{item.title}</h3>
                                    <p>{item.description}</p>
                                    <button className="btn btn-primary" onClick={()=>{setList(item);showNotifs(true)}}>View Notifications</button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
                : <NotificationListComponent list={list} showNotifs={showNotifs} />

            }
            
        </div>
     );
}

export default ListingItemsComponent;