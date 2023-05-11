import { useContext, useState } from "react";
import { Image, Menu } from "@fluentui/react-northstar";
import "./Welcome.css";
import { EditCode } from "./EditCode";
import { AzureFunctions } from "./AzureFunctions";
import { Graph } from "./Graph";
import { CurrentUser } from "./CurrentUser";
import { useData } from "@microsoft/teamsfx-react";
import { Deploy } from "./Deploy";
import { Publish } from "./Publish";
import { TeamsFxContext } from "../Context";
import { Events } from "./Events";
import { ScanEmployee } from "./ScanEmployee";
import { EventExtraFields } from "./EventExtraFields";

export function Welcome(props) {
  const { showFunction, environment } = {
    showFunction: true,
    environment: window.location.hostname === "localhost" ? "local" : "azure",
    ...props,
  };
  // const friendlyEnvironmentName =
  //   {
  //     local: "local environment",
  //     azure: "Azure environment",
  //   }[environment] || "local environment";

  // const steps = ["local", "azure", "publish"];
  // const friendlyStepsName = {
  //   local: "1. Build your app locally",
  //   azure: "2. Provision and Deploy to the Cloud",
  //   publish: "3. Publish to Teams",
  // };
  // const [selectedMenuItem, setSelectedMenuItem] = useState("local");
  // const items = steps.map((step) => {
  //   return {
  //     key: step,
  //     content: friendlyStepsName[step] || "",
  //     onClick: () => setSelectedMenuItem(step),
  //   };
  // });

  const { teamsUserCredential } = useContext(TeamsFxContext);
  const { loading, data, error } = useData(async () => {
    if (teamsUserCredential) {
      const userInfo = await teamsUserCredential.getUserInfo();
      return userInfo;
    }
  });
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
      //console.log(data.employee);
    }

  }
  const userName = (loading || error) ? "" : data.displayName;
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
