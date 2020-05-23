import React, { useEffect, useState, useContext } from "react";
import {
  ASSETS_COLORS,
  INSTRUMENT_DESCRIPTION,
  ASSETS_NAMES,
} from "../../constants";
import { StackContext } from "../../contexts/stack";
import { SmallIcon } from "./SmallIcon";
import { InstrumentDescription } from "./InstrumentDescription";
import { isEmpty } from "lodash";
import { AssetIcon } from "./AssetIcon";
import ElementForm from "../ElementForm";
import { Web3Context } from "@dapperlabs/react-web3";

export function LoadedOptions(props) {
  const [opSelected, setOpSelected] = useState(null);
  const [opCount, setOpCount] = useState(0);
  const [elementStack, setElementStack] = useState([]);
  const [availableElements, setAvailableElements] = useState([]);
  const { graph, dispatchGraph, limitColumn, allowElement } = useContext(
    StackContext
  );
  const { ids } = props;
  const { web3 } = useContext(Web3Context);
  const handleAction = (addElement) => {
    console.log("Do de add Action", addElement);

    dispatchGraph({ type: "ADD_DATA", addElement });
    props.closeModal();
  };

  const handleAllow = async (id) => {
    let result = await allowElement(web3, id);
    console.log(result);
  };

  useEffect(() => {
    let element = isEmpty(ids) ? [] : graph.getElementById(ids);
    setElementStack(element);
    console.log(element);
  }, []);

  return (
    <div className="modal__loaded-box">
      <span class="tag is-info is-light is-small is-fullwidth">
        Here you can check the settings to run this graph
      </span>
      {elementStack.type == "InputElement" && (
        <div
          onClick={() => handleAllow(elementStack.id)}
          className={`modal__op-btn button is-fullwidth is-medium`}
        >
          <div className="modal__op-desc">
            <span className="modal__op--title">
              Allow {ASSETS_NAMES[elementStack.outputs[0]]}
            </span>
          </div>
          <div className="modal__svg--small">
            <AssetIcon asset={ASSETS_NAMES[elementStack.outputs[0]]} />
          </div>
        </div>
      )}

      <div className="modal__loaded-content">
        <ElementForm
          element={elementStack}
          parents={ids}
          limitColumn={limitColumn}
          action={handleAction}
        />
      </div>
    </div>
  );
}
