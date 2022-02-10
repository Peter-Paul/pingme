import ListingComponent from "../components/listings/listing";
import LoadingPage from "../components/shared/loading"
import ProfileComponent from "../components/profile/profile"
import MembershipView from "../components/membership/membership-view";

function WelcomePage({plans,user,lists,handleAddListing,handlePatch,changeView}) {
    const setGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) {
            return "Good Morning"
        }else if (hour < 18) {
            return "Good Afternoon"
        }else {return "Good Evening"}
    }
    return ( 
        <div className="container">
            { Object.keys(user).length<=0 && 
                <LoadingPage/>
            }
            { Object.keys(user).length>0 &&
                <div>
                    <div className="row">
                        {user.account_complete &&
                            <>
                                <div className="col-12 col-md-6 mb-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h3 className="card-title">{setGreeting()} { user.fullname }</h3>
                                    </div>
                                </div>
                                    
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                    <ListingComponent 
                                        lists={lists} 
                                        handleAddListing={handleAddListing}  
                                        changeView={changeView}
                                    />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                    <div className="d-grid gap-2 col-6 mx-auto">
                                        <button className="btn btn-primary" type="button">
                                            Change Plan
                                        </button>
                                    </div>
                                    <MembershipView plans={plans} />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                    <ProfileComponent user={user} handlePatch={handlePatch}/>
                                </div>
                            </>
                        }
                    </div>                    
                </div>
            }
        </div>
     );
}

export default WelcomePage;