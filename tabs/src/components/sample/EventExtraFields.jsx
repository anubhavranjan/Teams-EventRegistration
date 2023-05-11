import React, { useContext, useEffect } from "react";
import { TeamsFxContext } from "../Context";
import { Button, Flex, Input, Dropdown, Table, Checkbox, Text } from '@fluentui/react-northstar';
import "./EventExtraFields.css";
import { EventResult } from "./EventResult";

export function EventExtraFields(props) {
    const [employee, setEmployee] = React.useState(props.employee);
    const [loading, setLoading] = React.useState(true);
    const [event, setEvent] = React.useState(props.event);
    const [extraFields, setExtraFields] = React.useState([]);
    const [renderFields, setRenderFields] = React.useState([]);
    const [registerStatus, setRegisterStatus] = React.useState(0); // 0 = not registered, 1 = registered, 2 = waiting list

    React.useEffect(() => {
        console.log(employee)
        async function getExtraFields() {
            if (extraFields.length === 0) {
                try {
                    let evt = await fetch("https://uat-socialdevelopment-api.azurewebsites.net/api/ExtraFields?EventId=" + event.Id, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Basic QVBJU29jaWFsRGV2ZWxvcG1lbnQ6MWRscDBtT1dSbUhtYmtPSzhUOVo="
                        }
                    });

                    if (evt.ok) {
                        let data = await evt.json();
                        console.log(data)
                        setExtraFields(data);
                    }
                }
                catch (error) {
                } finally {
                    setLoading(false);
                }
            }
        }
        getExtraFields();
    }, []);

    const getEvents = (fieldName) => {
        switch (fieldName) {
            case "PlantMty":
                return ["Planta Mty", "Planta5"];
            case "Distance":
                return ["10K", "21K"];
            case "ResponsibleGender":
                return ["Hombre", "Mujer"];
            case "Transportation":
                return ["Bus Nemak", "Propio"];
            default:
                return [];
        }
    }

    const setFields = (param, value) => {
        console.log(param, value);
    }

    useEffect(() => {
        if (extraFields && extraFields.length > 0) {
            //let tExtraFields = JSON.parse(JSON.stringify(extraFields));
            //tExtraFields.sort((a, b) => a.FieldOrder - b.FieldOrder);
            let tempFields = extraFields.map((field) => {
                if (field && field.FieldType !== "") {
                    switch (field.FieldType) {
                        case "TextBox":
                            return (
                                <>
                                    <p>{field.FieldDisplayName}</p>
                                    <Input fluid name={field.FieldName} />
                                    <br />
                                </>
                            );
                        case "DropDown":
                            return (
                                <>
                                    <p>{field.FieldDisplayName}</p>
                                    <Dropdown
                                        items={getEvents(field.FieldName)}
                                        placeholder="Seleccione una opción" fluid
                                        name={field.FieldName}
                                    />
                                </>
                            );
                        case "Rule":
                            if (field.FieldName === "IncludeRelatives") {
                                let relatives = [];
                                let header = {
                                    key: "header",
                                    items: [{
                                        content: <b>Nombre</b>,
                                        key: "nombre"
                                    },
                                    {
                                        content: <b>Edad</b>,
                                        key: "edad"
                                    },
                                    {
                                        content: <b>¿Asistir?</b>,
                                        key: "asistir"
                                    }]
                                };
                                let moreOptionCell = {
                                    content: <Checkbox />,
                                    truncateContent: true,
                                }
                                if (employee?.Relatives) {
                                    relatives = employee.Relatives.map((relative, index) => {
                                        return { "Name": relative.FirstName, "Age": relative.Age };
                                    });
                                }
                                let rowsPlain = [];
                                for (let i = 0; i < relatives.length; i++) {
                                    rowsPlain.push({
                                        key: i,
                                        items: [
                                            {
                                                key: i + "-" + 1,
                                                content: relatives[i].Name,
                                                truncateContent: false,
                                            },
                                            {
                                                key: i + "-" + 2,
                                                content: relatives[i].Age,
                                                truncateContent: true,
                                            },
                                            {
                                                key: i + "-" + 3,
                                                ...moreOptionCell
                                            }
                                        ],
                                    });
                                }
                                return (
                                    <>
                                        <p>{field.FieldDisplayName}</p>
                                        <Table
                                            header={header}
                                            rows={rowsPlain}
                                        />
                                        <br />
                                    </>
                                );
                            }
                            break;
                        default:
                            return (<br />);
                    }
                }
            });
            setRenderFields(tempFields);
        }
    }, [extraFields, event, employee]);

    return (<>
        {registerStatus === 0 &&
            <div>
                <h3 className="exfHeader">Información General</h3>
                <div className="exfBody">
                    <p>Nombre: <b>{employee?.EmployeeBasics.FirstName + " " + employee?.EmployeeBasics.LastName}</b></p>
                    <p>Teléfono: <b>{employee?.EmployeeBasics.PhoneNumber}</b></p>
                </div>
                <p>Captura la siguiente información requerida para registrarse al evento.</p>
                <h3 className="exfHeader">Información para el registro</h3>
                <div className="exfBody">
                    <p>Evento en el que desea registrarse</p>
                    <p><b>{event.Name}</b></p>
                    {/* <Dropdown
                    items={getEvents()}
                    placeholder={event.Name} fluid
                    disabled
                /> */}
                    <br />
                    {renderFields}
                    <p><Text error content="* No se requiere resistrar a menores de 1 ano" /></p>

                    {/* <p>
                    Total de personas que asistirán
                </p>
                <Dropdown items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                    placeholder="Seleccione una opción" fluid
                />
                <br />
                <p>Planta</p>
                <Dropdown items={["Planta Mty", "Planta5"]}
                    placeholder="Seleccione una opción" fluid
                />
                <br />
                <p>
                    Alergias
                </p>
                <Input type="text" fluid />
                <br />
                <p>Planta</p>
                <Dropdown items={["Planta Mty", "Planta5"]}
                    placeholder="Seleccione una opción" fluid
                /> */}
                </div>
                <Flex gap="gap.small">
                    <Button fluid primary onClick={() => setRegisterStatus(1)}>Registrarse al evento</Button>
                    <Button fluid secondary onClick={() => setRegisterStatus(2)}>Registrarse al evento</Button>
                </Flex>
            </div>
        }
        {registerStatus === 1 &&
            <EventResult event={event} registerStatus={true} confirmation="34217" />
        }
        {registerStatus === 2 &&
            <EventResult event={event} registerStatus={false} confirmation="" />
        }
    </>
    );
}