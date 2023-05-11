import { useState } from "react";
import { Image } from "@fluentui/react-northstar";
import "./Welcome.css";
import { Events } from "./Events";
import { ScanEmployee } from "./ScanEmployee";
import { EventExtraFields } from "./EventExtraFields";

export function Welcome(props) {
  const [selectedEvent, setSelectedEvent] = useState(undefined);
  const [employee, setEmployee] = useState(undefined);
  const [menu, setMenu] = useState(1);
  const updateStep = (step, data) => {
    if (step === 2) {
      setMenu(2);
      setSelectedEvent(data.event);
    }
    if (step === 3) {
      setEmployee(data.employee);
      setMenu(3);
    }
  }
  return (
    <div className="narrow page-padding" style={{ padding: "2rem" }}>
      <div style={{ textAlign: "center" }}>
        <Image src="logo-nemak-color-190x55.png" />
        <h4>
          ¡Bienvenido a la APP de Desarrollo Social para registrarse a un evento!
        </h4>
      </div>
      {menu === 1 &&
        <Events menu={menu} updateStep={updateStep} />
      }
      {
        menu === 2 &&
        <ScanEmployee menu={menu} updateStep={updateStep} event={selectedEvent} />
      }
      {
        menu === 3 &&
        <EventExtraFields menu={menu} updateStep={updateStep} event={selectedEvent} employee={employee} />
      }
    </div>
  );
}
