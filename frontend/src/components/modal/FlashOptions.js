import React, { useEffect, useState, useContext } from "react";
import { ASSETS_NAMES, AVAILABLE_SWAPS } from "../../constants";
import { StackContext } from "../../contexts/stack";
import { SmallIcon } from "./SmallIcon";
import { InstrumentDescription } from "./InstrumentDescription";
import { isEmpty } from "lodash";
import { AssetIcon } from "./AssetIcon";

export function FlashOptions(props) {
  const [opSelected, setOpSelected] = useState(null);

  const { graph, dispatchGraph, limitColumn } = useContext(StackContext);
  const { ids } = props;
  // console.log("id selected ", ids);

  const handleInputsData = (el) => {
    console.log("Do de add Action", el, ids);
    let addElement = {
      limit: limitColumn,
      asset: el,
    };
    dispatchGraph({ type: "ADD_FLASH_SWAP", addElement });
    props.closeModal();
  };

  return (
    <div>
      {Object.keys(AVAILABLE_SWAPS).map((assetKey) => {
        return (
          <div
            key={assetKey}
            onClick={() => handleInputsData(ASSETS_NAMES[assetKey])}
            className={`modal__op-btn button is-fullwidth is-medium ${
              opSelected && "is-disabled"
            }`}
          >
            <div className="modal__op-desc">
              <span className="modal__op--title">
                Borrow {ASSETS_NAMES[assetKey]}
              </span>
            </div>
            <div className="modal__svg--small">
              <AssetIcon asset={ASSETS_NAMES[assetKey]} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
