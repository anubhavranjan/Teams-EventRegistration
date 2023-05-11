import React from "react";
import { Button } from '@fluentui/react-northstar';

export function EventResult(props) {
    const [event, setEvent] = React.useState(props.event);
    const [registerStatus, setRegisterStatus] = React.useState(props.registerStatus);
    const [confirmation, setConfirmation] = React.useState(props.confirmation);

    return (
        <div>
            {registerStatus === true &&
                <div style={{
                    backgroundColor: "#d1e7db",
                    color: "#254b3a",
                    padding: "10px"
                }}>
                    <p>
                        Gracias por registrarte al evento <b>{event.Name}</b>, tu folio de confirmación es: <b>{confirmation}</b>.
                    </p>
                    <p>
                        En caso de que no puedas asistir, favoe de avisar a Desarrollo Socail al menos con 24 horas de anticipación.
                    </p>
                </div>
            }
            {registerStatus === false &&
                <>
                    <div style={{
                        backgroundColor: "#f9d5dd",
                        color: "#8c555c",
                        padding: "10px"
                    }}>
                        <p>
                            Desafortunadamente el cupo evento se agotó, mantente atento a los próximos eventos.
                        </p>
                    </div>
                    <br />
                    <div>
                        <p>
                            <b>¿Desea registrarse en la lista de espera de este evento?</b>
                        </p>
                        <Button content="Aceptar" fluid primary />
                    </div>
                </>
            }
        </div>
    );
}