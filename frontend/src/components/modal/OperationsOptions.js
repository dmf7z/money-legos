import React, { useEffect, useRef, useContext } from "react";
import { ASSETS_COLORS, INSTRUMENT_DESCRIPTION } from "../../constants";
import { StackContext } from "../../contexts/stack";
import { SmallIcon } from "./SmallIcon";

export function OperationsOption(props) {
  const { graph } = useContext(StackContext);
  const { ids } = props;
  console.log("id selected ", ids);

  const handleAction = (el) => {
    console.log("ACTION!!", el);
    props.closeModal();
  };

  const availableElements = graph.getAvailableElements(ids);
  return (
    <div>
      {availableElements.map((element) => {
          console.log(element)
        if (element.type == "OperationElement") {
          return (
            <div
              onClick={() => handleAction(element)}
              className="modal__op-btn button is-fullwidth is-medium"
            >
               
              

              <div className="modal__op-desc">
                {element.instrument} {element.description} 
              </div>
              <div className="modal__svg--small" >

<SmallIcon
inputs={element.inputs}
outputs={element.outputs}
type={element.type}
/>

</div>
            </div>
          );
        }
      })}
    </div>
  );
}
