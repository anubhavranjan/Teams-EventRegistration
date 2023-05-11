import React, { useEffect } from "react";
import { Button, Carousel, Image, Loader } from '@fluentui/react-northstar'
import "./Events.css"
export function Events(props) {
    const [events, setEvents] = React.useState([]);
    const [renderEvents, setRenderEvents] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function getEvents() {
            if (events.length === 0) {
                try {
                    let evt = await fetch("https://uat-socialdevelopment-api.azurewebsites.net/api/Event/GetEvents", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Basic QVBJU29jaWFsRGV2ZWxvcG1lbnQ6MWRscDBtT1dSbUhtYmtPSzhUOVo="
                        }
                    });

                    if (evt.ok) {
                        let data = await evt.json();
                        setEvents(data);
                    }
                }
                catch (error) {
                    setLoading(false);
                } finally {
                    setLoading(false);
                }
            }
        }
        getEvents();
    });

    const register = (event) => {
        props.updateStep(2, { event: event });
    }

    useEffect(() => {
        if (events.length > 0) {
            let tempEvents = [];
            events.forEach((event) => {
                let tempEvent = {};
                tempEvent.key = event.Id;
                tempEvent.id = event.Id;
                tempEvent.content = (
                    <div>
                        <h3>{event.Name}</h3>
                        <Image src={"data:image/png;base64," + event.EventImage} width="100%" style={{ height: "200px" }} fluid />
                        <span><h3>Fecha del evento: </h3>{event.EventDate}</span><br />
                        <h3>Fecha de inicio de registro: </h3>{event.RegistrationStart}<br />

                        Te invitamos a nuestro campamento de primavera
                        <br /><br />
                        <Button fluid content="Registrar" onClick={e => register(event)} primary disabled={event.IsRegisteringEnabled !== 1} />
                    </div>
                );
                tempEvents.push(tempEvent);
            });
            setRenderEvents(tempEvents);
            console.log(renderEvents);
        }
    }, [events]);

    return (<>
        {loading && <Loader label="Loading..." />}
        {!loading && <Carousel
            aria-roledescription="carousel"
            aria-label="Events collection"
            navigation={{
                'aria-label': 'events portraits',
                items: renderEvents.map((item, index) => ({
                    key: item.Id,
                    'aria-label': item.Name,
                    'aria-controls': item.Id,
                })),
            }}
            style={{ width: "100%" }}
            items={renderEvents}
            getItemPositionText={(index, size) => `${index + 1} of ${size}`} />
        }
    </>
    )
}