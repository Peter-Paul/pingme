import { useState } from "react";

function ListingForm({handleAddListing}) {
    const [stream, setStream] = useState({title:"",description:""})

    const handleUpdate = (e) => setStream({...stream, [e.target.name]: e.target.value})
    const onAdd = (evt) => {
        evt.preventDefault();
        handleAddListing(stream)
        // return handlePatch({...stream,membership:"Free",account_complete:true})
    }

    return ( 
        <div>
            <form onSubmit={onAdd}>
                <input type="text" placeholder="Enter Title" name="title" value={stream.title}
                className="mb-3 form-control" onChange={e => handleUpdate(e)}/>
                <input type="text" placeholder="Enter Description" name="description" value={stream.description}
                className="mb-3 form-control" onChange={e => handleUpdate(e)}/>
                <button type="submit" value="Submit" className="mb-3 btn btn-primary" >Submit</button>
            </form>
        </div>
     );
}

export default ListingForm;