import { useState } from "react";
import { Button,Modal } from "react-bootstrap"
import ListingForm from "./listing-form";

function ListingComponent({lists,handleAddListing,changeView}) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true)
    return ( 
        <div>
            <div className="d-grid gap-2 col-6 mx-auto mb-2">
                <Button variant="primary" onClick={handleShow}>
                    Add Listing
                    <i className="fa fa-plus-circle mx-2"></i>
                </Button>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Add Listing</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListingForm handleAddListing={handleAddListing} />
                </Modal.Body>
            </Modal>
            <div className="card h-100">
                <div className="card-body">
                    <h3 className="card-title"> You have {lists.length} streams</h3>
                    <button className="btn btn-primary" onClick={()=>{changeView("listing")}} >View Listings</button>
                </div>
            </div>
        </div> 
    );
}

export default ListingComponent;