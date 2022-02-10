import { useState } from "react";
import { Button,Modal } from "react-bootstrap"
import ProfileformComponent from "./profile-form";

function ProfileComponent({user,handlePatch}) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true)

    return ( 
        <div className="card">
            <div className="card-body">
                <div className="d-flex my-2 justify-content-between">
                    <h2 className="card-title">Profile Info</h2>
                    <Button variant="primary" onClick={handleShow}>
                        {user.account_complete? <i className="fa fa-ellipsis-h"></i>:"Complete Registration"}
                    </Button>
              
                </div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Update Account Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ProfileformComponent user={user} handlePatch={handlePatch} />
                    </Modal.Body>
                </Modal>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Username: {user.username}</li>
                    <li className="list-group-item">Email: {user.email}</li>
                    {user.fullname!=="" && <li className="list-group-item">Fullname: {user.fullname}</li>}
                    {user.dob!=="" && <li className="list-group-item">Date Of Birth: {user.dob}</li>}
                    {user.phonenumber!=="" && <li className="list-group-item">Phonenumber: {user.phonenumber}</li>}
                    {user.location!=="" && <li className="list-group-item">Address: {user.location}</li>}
                    {user.membership!=="" && <li className="list-group-item">Membership Plan: {user.membership}</li>}
                </ul>
            </div>
        </div>
     );
}

export default ProfileComponent;