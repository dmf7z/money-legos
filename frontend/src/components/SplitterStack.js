import React from "react";
import { ArcherElement } from "react-archer";
import { arrowStyle } from "../styles/graphStyles";

function SplitterStack(props) {
  return (
    <ArcherElement
      id={props.id}
      className="box"
      relations={
        props.target && [
          {
            targetId: props.target[0],
            targetAnchor: "top",
            sourceAnchor: "bottom",
            arrowThickness: 2,
            style: arrowStyle,
          },
          {
            targetId: props.target[1],
            targetAnchor: "top",
            sourceAnchor: "bottom",
            arrowThickness: 2,
            style: arrowStyle,
          },
        ]
      }
    >
      <div className=" stack--square box box--square">
        <div className={`stack-color stack-color--${props.asset}`}>
          <div className="stack-color__square stack-color__lighten  round--left"></div>
          <div className="stack-color__square stack-color__darken  round--right"></div>
          <img
            className="round--img"
            src={require(`../assets/icons/${props.asset}.svg`)}
          ></img>
        </div>
        <div className="stack--round stack-color__content">
          <div className="stack-color__name">SPLIT {props.asset} 50% </div>
        </div>
      </div>
    </ArcherElement>
  );
}

export default SplitterStack;
