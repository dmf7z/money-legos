import React, { useEffect, useState, useContext } from "react";
import {
  ASSETS_NAMES,
} from "../../constants";
import { StackContext } from "../../contexts/stack";
import { isEmpty } from "lodash";
import { AssetIcon } from "./AssetIcon";
import ElementForm from "../ElementForm";

export function AddressOption(props) {
  const [opSelected, setOpSelected] = useState(null);
  const [opCount, setOpCount] = useState(0);
  const [availableElements, setAvailableElements] = useState([]);
  const { graph, dispatchGraph, limitColumn } = useContext(StackContext);
  const { ids } = props;

  const handleInputsData = (el) => {
    // console.log("inputs data", el);
    setOpSelected(el);
  };

  const handleAction = (addElement) => {
    console.log("Do Action", addElement);
    dispatchGraph({ type: "ADD_OPERATION", addElement });
    props.closeModal();
  };

  useEffect(() => {
    let elementsOfInteres = isEmpty(ids) ? [] : graph.getAvailableElements(ids);
    let filterElements = elementsOfInteres.filter(
      (el) => el.type === "AddressElement"
    );
    setAvailableElements(filterElements);
    setOpCount(filterElements.length);
  }, []);

  return (
    <div className="">
      {availableElements.map((element) => {
        const showElement = opSelected
          ? opSelected.key == element.key
            ? true
            : false
          : true;
        if (showElement) {
          return (
            <>
              <div
                key={element.id}
                onClick={() => handleInputsData(element)}
                className={`modal__op-btn button is-fullwidth is-medium ${opSelected &&
                  "is-disabled"}`}
              >
                <div className="modal__op-desc">
                  <span className="modal__op--title">
                    {element.description}
                  </span>
                </div>
                <div className="modal__svg--small">
                  <AssetIcon asset={ASSETS_NAMES[element.inputs[0]]} />
                </div>
              </div>
              {opSelected && (
                <ElementForm
                  element={element}
                  parents={ids}
                  limitColumn={limitColumn}
                  action={handleAction}
                />
              )}
            </>
          );
        }
      })}
    </div>
  );
}
