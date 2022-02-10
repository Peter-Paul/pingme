function MembershipForm({plans}) {
    const [person, setUser] = useState(user)

    const handleUpdate = (e) => setUser({...person, [e.target.name]: e.target.value})
    const onUpdate = (evt) => {
        evt.preventDefault();
        handlePatch(person)
    }

    return ( 
        <div>
            <form onSubmit={onUpdate}>
                <input type="text" placeholder="Enter Fullname" name="fullname" value={person.fullname}
                className="mb-3 form-control" onChange={e => handleUpdate(e)}/>
                <select class="form-select" aria-label="Default select example">
                    <option selected>select</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </select>

                <button type="submit" value="Submit" className="mb-3 btn btn-primary" >Submit</button>
            </form>
        </div>
     );
}

export default MembershipForm;