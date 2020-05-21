import React, { useEffect, useState, useContext } from "react";
import { ASSETS_COLORS, INSTRUMENT_DESCRIPTION, ASSETS_NAMES } from "../../constants";
import { StackContext } from "../../contexts/stack";
import { SmallIcon } from "./SmallIcon";
import { InstrumentDescription } from "./InstrumentDescription";
import { isEmpty } from "lodash";
import { AssetIcon } from "./AssetIcon";
import ElementForm from "../ElementForm";

export function SplittersOption(props) {
  const [opSelected, setOpSelected] = useState(null);
  const [opCount, setOpCount] = useState(0);
  const [availableElements, setAvailableElements ] = useState([])
  const { graph, dispatchGraph, limitColumn } = useContext(StackContext);
  const { ids } = props;
  // console.log("id selected ", ids);

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

  // const handleAction = (el) => {
  //   console.log("Do de add Action", el, ids);

  //   let addElement = {
  //     parents: ids,
  //     element: el,
  //     value: 50
  //   }

  //   dispatchGraph({ type: "ADD_SPLITTER", addElement });
  //   props.closeModal();

  // };

  useEffect(() => {
  let elementsOfInteres =  isEmpty(ids) ? [] : graph.getAvailableElements(ids);
    let filterElements = elementsOfInteres.filter(el => el.type === "SplitterElement")
    setAvailableElements(filterElements)
    setOpCount(filterElements.length)
    console.log(elementsOfInteres)

  }, []);

  return (
    <div className="">
      {/* {isEmpty(availableElements) && availableElements.length > 0 && <div>Are you sure you selected 2 elements with the same output?</div>} */}
      {opCount == 1 && 
      <span class="tag is-info is-light is-small is-fullwidth">
      You know you can add more than 1 element from the splitter?
    </span>
      
      }
      {availableElements.map(element => {
        console.log(availableElements);

        if (element.type == "SplitterElement") {
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
                {opSelected && <ElementForm  element={element} parents={ids} limitColumn={limitColumn} action={handleAction} /> }
             
          
              </>
            );
          }
        }
      })}
    </div>
  );
}
