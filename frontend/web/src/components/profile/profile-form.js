import { useState } from "react"

function ProfileformComponent({user,handlePatch}) {
    const [person, setUser] = useState(user)

    const handleUpdate = (e) => setUser({...person, [e.target.name]: e.target.value})
    const onUpdate = (evt) => {
        evt.preventDefault();
        if (person.account_complete) {
            return handlePatch(person)
        }
        return handlePatch({...person,membership:"Free",account_complete:true})
    }

    return ( 
        <div>
            <form onSubmit={onUpdate}>
                <input type="text" placeholder="Enter Fullname" name="fullname" value={person.fullname}
                className="mb-3 form-control" onChange={e => handleUpdate(e)}/>
                <input type="text" placeholder="Enter Date of Birth" name="dob" value={person.dob}
                className="mb-3 form-control" onChange={e => handleUpdate(e)}/>
                <input type="text" placeholder="Enter Phonenumber" name="phonenumber" value={person.phonenumber}
                className="mb-3 form-control" onChange={e => handleUpdate(e)}/>
                <input type="text" placeholder="Enter Location" name="location" value={person.location}
                className="mb-3 form-control" onChange={e => handleUpdate(e)}/>
                <button type="submit" value="Submit" className="mb-3 btn btn-primary" >Submit</button>
            </form>
        </div>
     );
}

export default ProfileformComponent;