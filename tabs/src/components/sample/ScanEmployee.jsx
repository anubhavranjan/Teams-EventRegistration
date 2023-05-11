import React from "react";
import { Button, Input } from '@fluentui/react-northstar';

export function ScanEmployee(props) {
    const [empId, setEmpId] = React.useState("");

    const getEmployee = async () => {
        try {
            let employeeResponse = await fetch("https://uat-hremployeeinformation-api.azurewebsites.net/api/Family/GetEmployeeAndFamilyInformationByEmployeeId?employeeId=" + empId, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic SFJFbXBsb3llZUluZm9ybWF0aW9uOitLVTJjM3doTDh2IzNMTTNCbm5talA/ZCM="
                }
            });

            if (employeeResponse.ok) {
                let employeeData = await employeeResponse.json();
                props.updateStep(3, { employee: employeeData });
            } else {

            }
        } catch (error) {

        }
    }


    return (
        <div>
            <h3>
                Para iniciar el proceso de registro, captura tu número de socio en el siguiente recuadro.
                <br />
                <br />
                <Input placeholder="Número de socio" label="Número de socio:" type="text" value={empId} fluid onChange={(e) => setEmpId(e.target.value)} />
                <br />
                <br />
                <Button fluid content="Iniciar registro" onClick={getEmployee} primary />
            </h3>
        </div>
    );
}