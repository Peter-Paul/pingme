import { Carousel } from "react-bootstrap"

function MembershipView({plans}) {
    return (  
        <div>
            <Carousel>
                { plans.map( plan =>
                    <Carousel.Item key={plan.name} interval={1000}>
                        <img
                        className="d-block w-100"
                        src="holder.js/800x400?text=First slide&bg=373940"
                        alt="First slide"
                        />
                        <Carousel.Caption>
                        <h3>{plan.name}</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                )}
            </Carousel>

        </div>
    );
}

export default MembershipView;