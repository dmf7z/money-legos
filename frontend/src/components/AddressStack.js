import React from "react";
import { ArcherElement } from "react-archer";
import { arrowStyle } from "../styles/graphStyles";
import IdenticonAddress from "./IdenticonAddress";

function AddressStack(props) {
  return (
    <ArcherElement
      id={props.id}
      className="box"
      relations={
        props.target && [
          {
            targetId: props.target,
            targetAnchor: "top",
            sourceAnchor: "bottom",
            arrowThickness: 2,
            style: arrowStyle,
          },
        ]
      }
    >
      <div className=" stack--square box box--square">
    
        <div className="stack stack-color__content">
          <div className="stack-color__address">
          <div>Address</div>
            <IdenticonAddress address={props.address} />
          </div>
        </div>
      </div>
    </ArcherElement>
  );
}

export default AddressStack;
