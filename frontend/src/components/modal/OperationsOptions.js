import React, { useEffect, useState, useContext } from "react";
import { ASSETS_COLORS, INSTRUMENT_DESCRIPTION } from "../../constants";
import { StackContext } from "../../contexts/stack";
import { SmallIcon } from "./SmallIcon";
import { InstrumentDescription } from "./InstrumentDescription";

export function OperationsOption(props) {
  const [opSelected, setOpSelected] = useState(null);

  const { graph } = useContext(StackContext);
  const { ids } = props;
  console.log("id selected ", ids);

  const handleInputsData = (el) => {
    console.log("inputs data", el);
    setOpSelected(el);
  };

  const handleAction = (el) => {
    console.log("ACTION!!", el);
    props.closeModal();
  };

  const availableElements = graph.getAvailableElements(ids);
  return (
    <div>
      {Object.keys(availableElements).map((elementKey) => {
        console.log('i',availableElements);
        let element = availableElements[elementKey]

        if (element.type == "OperationElement") {
          const showElement = opSelected
            ? opSelected.description == element.description
              ? true
              : false
            : true;
          if (showElement) {
            return (
              <>
                <div
                  onClick={() => handleInputsData(element)}
                  className={`modal__op-btn button is-fullwidth is-medium ${opSelected && 'is-disabled'}`}
                >
                  <div className="modal__op-desc">
                    <InstrumentDescription instrument={element.instrument} /> <span className="modal__op--desc">{element.description}</span> 
                  </div>
                  <div className="modal__svg--small">
                    <SmallIcon
                      inputs={element.inputs}
                      outputs={element.outputs}
                      type={element.type}
                    />
                  </div>
                </div>
                {opSelected && (
                  <div>
                    {element.executionData.map((input) => {
                      if (input.type == "input") {
                        return (
                          <div class="field">
                            <label class="label">{input.title}</label>
                            <div class="control">
                              <input
                                class="input is-info"
                                type="text"
                                placeholder={input.default}
                              />
                            </div>
                            <p class="help">{input.description}</p>
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
                <div>
                  
          <button
            onClick={() => handleAction(element)}
            className="button is-warning is-fullwidth is-rounded"
          >
            OK!
          </button>
                </div>
              </>
            );
          }
        }
      })}
    </div>
  );
}
