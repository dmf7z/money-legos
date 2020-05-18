import React, { useEffect, useState, useContext } from "react";
import { ASSETS_NAMES, INSTRUMENT_DESCRIPTION } from "../../constants";
import { StackContext } from "../../contexts/stack";
import { SmallIcon } from "./SmallIcon";
import { InstrumentDescription } from "./InstrumentDescription";
import { isEmpty } from "lodash";
import { AssetIcon } from "./AssetIcon";

export function AssetsOptions(props) {
  const [opSelected, setOpSelected] = useState(null);

  const { graph, dispatchGraph, limitColumn} = useContext(StackContext);
  const { ids } = props;
  // console.log("id selected ", ids);


  const handleInputsData = (el) => {
    console.log("Do de add Action", el, ids);
    let addElement = {
      limit: limitColumn,
      asset: el
    }
    dispatchGraph({ type: "ADD_INPUT", addElement });
    props.closeModal();

  };

  return (
    <div>
      {Object.keys(ASSETS_NAMES).map(assetKey => {

        return(
     
                <div
                key={assetKey}
                  onClick={() => handleInputsData(ASSETS_NAMES[assetKey])}
                  className={`modal__op-btn button is-fullwidth is-medium ${opSelected && 'is-disabled'}`}
                >
                  <div className="modal__op-desc">
                   <span className="modal__op--title">{ASSETS_NAMES[assetKey]}</span> 
                  </div>
                  <div className="modal__svg--small">
                    <AssetIcon
                      asset={ASSETS_NAMES[assetKey]}
                    />
                  </div>
                </div>
              
            );
          })
        }
    </div>
  );
}
