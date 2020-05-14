import React from "react";
import { arrowStyle } from "../styles/graphStyles";
import { ArcherElement } from "react-archer";

function InitStack(props) {
  return (
    <ArcherElement
      id={props.id}
      relations={props.target && [
        {
          targetId: props.target,
          targetAnchor: "top",
          sourceAnchor: "bottom",
          arrowThickness: 2,
          style: arrowStyle,
        },
      ]}
    >
      <div>
        <div className="stack stack--square box box--square">
          <div className="stack-color__content">
            <div className="stack-color__name">START WITH {props.asset}</div>
          </div>
          <div className={`stack-color stack-color--${props.asset}`}>
            <div className="stack-color__square stack-color__lighten stack-color__lighten--out">
              {props.asset.toUpperCase()}
            </div>
            <div className="stack-color__square stack-color__darken stack-color__darken--out">
              <img src={require(`../assets/icons/${props.asset}.svg`)}></img>
            </div>
          </div>
        </div>
      </div>
    </ArcherElement>
  );
}

export default InitStack;
