import React, { useEffect, useState, useContext } from "react";
import { ASSETS_COLORS, INSTRUMENT_DESCRIPTION } from "../../constants";
import { StackContext } from "../../contexts/stack";
import { SmallIcon } from "./SmallIcon";
import { InstrumentDescription } from "./InstrumentDescription";
import { isEmpty } from "lodash";
import ElementForm from "../ElementForm";

export function OperationsOption(props) {
  const [opSelected, setOpSelected] = useState(null);
  const { graph, dispatchGraph, limitColumn } = useContext(StackContext);
  const { ids } = props;
  console.log("id selected ", ids);


  const handleInputsData = (el) => {
    // console.log("inputs data", el);
    setOpSelected(el);
  };

  const handleAction = (addElement) => {
    console.log("Do de add Action", addElement);

    // let addElement = {
    //   parents: ids,
    //   element: el,
    //   limit: limitColumn,
    // };

    dispatchGraph({ type: "ADD_OPERATION", addElement });
    props.closeModal();
  };

  const availableElements = isEmpty(ids) ? [] : graph.getAvailableElements(ids);

  return (
    <div>
      {availableElements.map((element) => {
        // console.log(element);

        if (element.type == "OperationElement") {
          const showElement = opSelected
            ? opSelected.key == element.key
              ? true
              : false
            : true;
          if (showElement) {
            return (
              <>
                <div
                  key={`${element.instrument}-${element.id}`}
                  onClick={() => handleInputsData(element)}
                  className={`modal__op-btn button is-fullwidth is-medium ${opSelected &&
                    "is-disabled"}`}
                >
                  <div className="modal__op-desc">
                    <InstrumentDescription instrument={element.instrument} />{" "}
                    <span className="modal__op--desc">
                      {element.description}
                    </span>
                  </div>
                  <div className="modal__svg--small">
                    <SmallIcon
                      inputs={element.inputs}
                      outputs={element.outputs}
                      type={element.type}
                    />
                  </div>
                </div>

                {opSelected && <ElementForm  element={element} parents={ids} limitColumn={limitColumn} action={handleAction} /> }

              </>
            );
          }
        }
      })}
    </div>
  );
}
