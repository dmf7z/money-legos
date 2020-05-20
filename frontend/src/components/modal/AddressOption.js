import React, { useEffect, useState, useContext } from "react";
import { ASSETS_COLORS, INSTRUMENT_DESCRIPTION, ASSETS_NAMES } from "../../constants";
import { StackContext } from "../../contexts/stack";
import { SmallIcon } from "./SmallIcon";
import { InstrumentDescription } from "./InstrumentDescription";
import { isEmpty } from "lodash";
import { AssetIcon } from "./AssetIcon";

export function AddressOption(props) {
  const [opSelected, setOpSelected] = useState(null);
  const [opCount, setOpCount] = useState(0);
  const [availableElements, setAvailableElements ] = useState([])
  const { graph, dispatchGraph } = useContext(StackContext);
  const { ids } = props;
  // console.log("id selected ", ids);

  const handleInputsData = (el) => {
    // console.log("inputs data", el);
    setOpSelected(el);
  };

  const handleAction = (el) => {
    console.log("Do de add Action", el, ids);

    let addElement = {
      parents: ids,
      element: el,
      value: 50
    }

    dispatchGraph({ type: "ADD_SPLITTER", addElement });
    props.closeModal();

  };

  useEffect(() => {
  let elementsOfInteres =  isEmpty(ids) ? [] : graph.getAvailableElements(ids);
    let filterElements = elementsOfInteres.filter(el => el.type === "AddressElement")
    setAvailableElements(filterElements)
    setOpCount(filterElements.length)

  }, []);

  return (
    <div className="modal__options">
      {/* {isEmpty(availableElements) && availableElements.length > 0 && <div>Are you sure you selected 2 elements with the same output?</div>} */}
      {opCount == 1 && 
      <span class="tag is-info is-light is-small is-fullwidth">
      Address hint
    </span>
      
      }
      {availableElements.map(element => {

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
                  className={`modal__op-btn button is-fullwidth is-medium ${opSelected && 'is-disabled'}`}
                >
                  <div className="modal__op-desc">
                    <span className="modal__op--title">{element.description}</span> 
                  </div>
                  <div className="modal__svg--small">
                    <AssetIcon
                      asset={ASSETS_NAMES[element.inputs[0]]}
  
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
                  
          {opSelected && <button
            onClick={() => handleAction(element)}
            className="button is-warning is-fullwidth is-rounded"
          >
            OK!
          </button>}
                </div>
              </>
            );
        }
      })}
    </div>
  );
}
